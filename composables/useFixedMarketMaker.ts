import { newtonRaphson } from '@fvictorio/newton-raphson-method';
import { useAccount } from '@wagmi/vue';
// eslint-disable-next-line import/no-named-as-default
import Big from 'big.js';
import { type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';

/**
 * Use Fixed Market Maker (FMM) Contract.
 */
export default function useFixedMarketMaker() {
  const { checkCollateralAllowance, getTokenStore, loadToken } = useCollateralToken();
  const { checkConditionalApprove } = useConditionalToken();
  const { initContract, initReadContract } = useContracts();
  const { address, isConnected } = useAccount();
  const tokenStore = getTokenStore();

  /**
   * Gets current share price.
   * @param fpmmContractAddress FPMM contract address.
   * @param outcomeIndex Outcome index.
   * @returns Price per share.
   */
  async function getPricePerShare(fpmmContractAddress: Address, outcomeIndex: number) {
    if (!tokenStore.loaded) {
      await loadToken();
    }

    const amount = BigInt(Math.round(1 * 10 ** tokenStore.decimals));
    const contract = await initReadContract(ContractType.FPMM, fpmmContractAddress);
    const expectedShares = await contract.read.calcBuyAmount([amount, outcomeIndex]);

    return Number(amount) / Number(expectedShares);
  }

  /**
   * Returns max tokens to sell based on slippage.
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Amount of collateral token to return.
   * @param outcomeIndex Outcome index.
   * @param slippage Slippage.
   * @returns Max tokens to sell.
   */
  async function getMaxTokensToSell(
    fpmmContractAddress: Address,
    collateralAmount: bigint,
    outcomeIndex: number,
    slippage: number
  ) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const maxTokensToSellNoSlippage = await contract.read.calcSellAmount([collateralAmount, outcomeIndex]);
    const maxTokensToSell = (maxTokensToSellNoSlippage * BigInt(100 + slippage)) / BigInt(100);

    return { maxTokensToSell, maxTokensToSellNoSlippage };
  }

  /**
   *
   * @param fpmmContractAddress
   * @param amount
   * @param outcomeIndex
   * @param slippage
   * @returns
   */
  async function getMinTokensToBuy(
    fpmmContractAddress: Address,
    amount: number,
    outcomeIndex: number,
    slippage: number
  ) {
    if (!tokenStore.loaded) {
      await loadToken();
    }

    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));
    const minTokensToBuyNoSlippage = await contract.read.calcBuyAmount([scaledAmount, outcomeIndex]);
    const minTokensToBuy = (minTokensToBuyNoSlippage * BigInt(100 - slippage)) / BigInt(100);

    // TODO: FIX FRACTIONS:
    // new Big(amount.toString()).mul(keepFraction).toFixed(0);
    return { minTokensToBuy, minTokensToBuyNoSlippage };
  }

  /**
   * Buys outcome tokens for the given market.
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Buy amount in collateral token.
   * @param outcomeIndex Outcome index to buy.
   * @param slippage Slippage percentage.
   * @returns Buy TX.
   */
  async function buy(fpmmContractAddress: Address, amount: number, outcomeIndex: number, slippage: number) {
    if (!isConnected.value) {
      return;
    }

    if (!tokenStore.loaded) {
      await loadToken();
    }
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const allowance = await checkCollateralAllowance(fpmmContractAddress);
    if (allowance) {
      const { minTokensToBuy } = await getMinTokensToBuy(fpmmContractAddress, amount, outcomeIndex, slippage);
      const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));

      return await contract.write.buy([scaledAmount, outcomeIndex, minTokensToBuy]);
    }
  }

  /**
   *
   * @param fpmmContractAddress
   * @param amount
   * @param outcomeIndex
   * @param slippage
   * @returns
   */
  async function sell(fpmmContractAddress: Address, collateralAmount: bigint, outcomeIndex: number, slippage: number) {
    if (!isConnected.value) {
      return;
    }

    if (!tokenStore.loaded) {
      await loadToken();
    }
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const approved = await checkConditionalApprove(fpmmContractAddress);
    if (approved) {
      const { maxTokensToSell } = await getMaxTokensToSell(
        fpmmContractAddress,
        collateralAmount,
        outcomeIndex,
        slippage
      );

      return await contract.write.sell([collateralAmount, outcomeIndex, maxTokensToSell]);
    }
  }

  /**
   * Returns user's funding balance - LP tokens.
   * @param fpmmContractAddress FPMM contract address.
   * @returns Funding balance.
   */
  async function getFundingBalance(fpmmContractAddress: Address) {
    if (!isConnected.value) {
      return;
    }

    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);
    return await contract.read.balanceOf([address.value]);
  }

  /**
   * Adds funding to selected market.
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Funding amount in collateral token.
   */
  async function addFunding(fpmmContractAddress: Address, amount: number) {
    if (!isConnected.value) {
      return;
    }

    if (!tokenStore.loaded) {
      await loadToken();
    }
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const allowance = await checkCollateralAllowance(fpmmContractAddress);
    if (allowance) {
      const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));
      return await contract.write.addFunding([scaledAmount, []]);
    }
  }

  /**
   * Removes funding from the selected market.
   * @param fpmmContractAddress FPMM contract address.
   * @param shareAmount Amount of shares to return.
   */
  async function removeFunding(fpmmContractAddress: Address, shareAmount: bigint) {
    if (!isConnected.value) {
      return;
    }

    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);
    return await contract.write.removeFunding([Number(shareAmount)]);
  }

  /**
   * Returns total funding for selected market.
   * @param fpmmContractAddress FPMM contract address.
   * @param shareAmount Amount of shares to return.
   */
  async function getTotalFunding(fpmmContractAddress: Address) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);
    const res = await contract.read.fundingAmountTotal();
    return res;
  }

  /**
   *
   * @param sharesAmount
   * @param outcomeIndex
   * @param fpmmContractAddress
   * @param positionIds
   * @returns
   */
  async function calcSellAmountInCollateral(
    sharesAmount: number,
    outcomeIndex: number,
    fpmmContractAddress: Address,
    positionIds: string[]
  ) {
    Big.DP = 90;

    const ctContract = await initContract(ContractType.CONDITIONAL_TOKEN);
    const owners = positionIds.map(() => fpmmContractAddress);
    const ids = positionIds.map(positionId => BigInt(positionId));
    const marketSharesAmounts = await ctContract.read.balanceOfBatch([owners, ids]);

    const fpmmContract = await initContract(ContractType.FPMM, fpmmContractAddress);
    const actualFee = await fpmmContract.read.fee();

    // TODO: HANDLE FEE IN CALCULATION

    const marketFee = new Big(actualFee.toString()).div(10 ** 18);
    console.log('marketFee: ', marketFee.toFixed(18));

    const marketSellingSharesAmounts = new Big(marketSharesAmounts[outcomeIndex]);
    const marketNonSellingSharesAmounts = marketSharesAmounts
      .filter((_, index) => index !== outcomeIndex)
      .map(marketShares => new Big(marketShares));
    const sharesToSell = new Big(Math.round(sharesAmount * 10 ** tokenStore.decimals));

    const f = r => {
      /* For three outcomes, where the `x` is the one being sold, the formula is:
       * f(r) = ((y - R) * (z - R)) * (x  + a - R) - (x * y * z)
       * where:
       *   `R` is r / (1 - fee)
       *   `x`, `y`, `z` are the market maker shares for each outcome, where `x` is the market maker share being sold
       *   `a` is the amount of outcomes shares that are being sold
       *   `r` (the unknown) is the amount of collateral that will be returned in exchange of `a` tokens
       */

      const R = r.div(1);
      // const R = r.div(1 - marketFee);

      // ((y - R) * (z - R))
      const firstTerm = marketNonSellingSharesAmounts.map(h => h.minus(R)).reduce((a, b) => a.mul(b));

      // (x  + a - R)
      const secondTerm = marketSellingSharesAmounts.plus(sharesToSell).minus(R);

      // (x * y * z)
      const thirdTerm = marketNonSellingSharesAmounts.reduce((a, b) => a.mul(b), marketSellingSharesAmounts);

      // ((y - R) * (z - R)) * (x  + a - R) - (x * y * z)
      return firstTerm.mul(secondTerm).minus(thirdTerm);
    };

    /* Newton-Raphson method is used to find the root of a function.
     * Root of a function is the point where the function touches the x-axis on a graph.
     * In this case y-axis is the number of outcome tokens / shares.
     * The x-axis is the number of colleral tokens to be received.
     * This meaning we want to know how much collateral we need to receive to have 0 outcome tokens / shares.
     */
    const r = newtonRaphson(f, 0, { maxIterations: 100 });

    if (!r) {
      return null;
    }

    return BigInt(r.toFixed(0)) as any;
  }

  // Removes the given fraction from the given integer-bounded amount and returns the value as an original type.
  function removeFraction(amount: bigint, fraction: number): bigint {
    if (fraction >= 1 || fraction <= 0)
      throw new Error(`The given basisPoints ${fraction} is not in the range [0, 1].`);

    const keepFraction = 1 - fraction;

    return BigInt(new Big(amount.toString()).mul(keepFraction).toFixed(0));
  }

  // Adds the given fraction from the given integer-bounded amount and returns the value as an original type.
  function addFraction(amount: bigint, fraction: number): bigint {
    if (fraction >= 1 || fraction <= 0)
      throw new Error(`The given basisPoints ${fraction} is not in the range [0, 1].`);

    const keepFraction = 1 + fraction;

    return BigInt(new Big(amount.toString()).mul(keepFraction).toFixed(0));
  }

  return {
    getMaxTokensToSell,
    getMinTokensToBuy,
    addFunding,
    buy,
    sell,
    getPricePerShare,
    getFundingBalance,
    removeFunding,
    getTotalFunding,
    calcSellAmountInCollateral,
    removeFraction,
    addFraction,
  };
}
