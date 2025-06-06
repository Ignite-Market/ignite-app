/* eslint-disable import/no-named-as-default */
import { newtonRaphson } from '@fvictorio/newton-raphson-method';
import { useAccount } from '@wagmi/vue';
import Big from 'big.js';
import { parseEther, type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';

/**
 * Slippage scale for fraction calculation support.
 */
const SLIPPAGE_SCALE = 100;

/**
 * Use Fixed Market Maker (FMM) Contract.
 */
export default function useFixedMarketMaker() {
  const { initContract, initReadContract } = useContracts();
  const { address, isConnected } = useAccount();

  /**
   * Gets current share price.
   *
   * @param fpmmContractAddress FPMM contract address.
   * @param outcomeIndex Outcome index.
   * @param collateralDecimals Number of decimal places of collateral token.
   * @returns Price per share.
   */
  async function getPricePerShare(fpmmContractAddress: Address, outcomeIndex: number, collateralDecimals: number) {
    const amount = BigInt(Math.round(1 * 10 ** collateralDecimals));
    const contract = await initReadContract(ContractType.FPMM, fpmmContractAddress);
    const expectedShares = await contract.read.calcBuyAmount([amount, outcomeIndex]);

    return Number(amount) / Number(expectedShares);
  }

  /**
   * Returns max tokens to sell based on slippage.
   *
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
    const maxTokensToSell =
      (maxTokensToSellNoSlippage * BigInt(100 * SLIPPAGE_SCALE + slippage * SLIPPAGE_SCALE)) /
      BigInt(100 * SLIPPAGE_SCALE);

    return { maxTokensToSell, maxTokensToSellNoSlippage };
  }

  /**
   * Return min tokens to buy based on slippage.
   *
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Amount of collateral to spend.
   * @param outcomeIndex Outcome index.
   * @param slippage Slippage.
   * @param collateralDecimals Number of decimal places of collateral token.
   * @returns Min tokens to buy.
   */
  async function getMinTokensToBuy(
    fpmmContractAddress: Address,
    amount: number,
    outcomeIndex: number,
    slippage: number,
    collateralDecimals: number
  ) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const scaledAmount = BigInt(Math.round(amount * 10 ** collateralDecimals));
    const minTokensToBuyNoSlippage = await contract.read.calcBuyAmount([scaledAmount, outcomeIndex]);
    const minTokensToBuy =
      (minTokensToBuyNoSlippage * BigInt(100 * SLIPPAGE_SCALE - slippage * SLIPPAGE_SCALE)) /
      BigInt(100 * SLIPPAGE_SCALE);

    return { minTokensToBuy, minTokensToBuyNoSlippage };
  }

  /**
   * Buys outcome tokens for the given market.
   *
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Buy amount in collateral token.
   * @param outcomeIndex Outcome index to buy.
   * @param slippage Slippage percentage.
   * @param collateralDecimals Number of decimal places of collateral token.
   * @returns Buy TX.
   */
  async function buy(
    fpmmContractAddress: Address,
    amount: number,
    outcomeIndex: number,
    slippage: number,
    collateralDecimals: number
  ) {
    if (!isConnected.value) {
      return;
    }
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    // Make sure that you check for collateral allowance separately.
    const { minTokensToBuy } = await getMinTokensToBuy(
      fpmmContractAddress,
      amount,
      outcomeIndex,
      slippage,
      collateralDecimals
    );
    const scaledAmount = BigInt(Math.round(amount * 10 ** collateralDecimals));

    return await contract.write.buy([scaledAmount, outcomeIndex, minTokensToBuy]);
  }

  /**
   * Sells outcome shares.
   *
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Amount of outcome shares to sell.
   * @param outcomeIndex Outcome index.
   * @param slippage Slippage value.
   * @returns Sell TX.
   */
  async function sell(fpmmContractAddress: Address, collateralAmount: bigint, outcomeIndex: number, slippage: number) {
    if (!isConnected.value) {
      return;
    }

    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    // Make sure that you check for conditional allowance separately.
    const { maxTokensToSell } = await getMaxTokensToSell(fpmmContractAddress, collateralAmount, outcomeIndex, slippage);
    return await contract.write.sell([collateralAmount, outcomeIndex, maxTokensToSell]);
  }

  /**
   * Returns user's funding balance - LP tokens.
   *
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
   *
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Funding amount in collateral token.
   * @param collateralDecimals Number of decimal places of collateral token.
   */
  async function addFunding(fpmmContractAddress: Address, amount: number, collateralDecimals: number) {
    if (!isConnected.value) {
      return;
    }
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    // Make sure that you check for collateral allowance separately.
    const scaledAmount = BigInt(Math.round(amount * 10 ** collateralDecimals));
    return await contract.write.addFunding([scaledAmount, []]);
  }

  /**
   * Removes funding from the selected market.
   *
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
   *
   * @param fpmmContractAddress FPMM contract address.
   * @param shareAmount Amount of shares to return.
   */
  async function getTotalFunding(fpmmContractAddress: Address) {
    const contract = await initReadContract(ContractType.FPMM, fpmmContractAddress);

    return await contract.read.fundingAmountTotal();
  }

  /**
   * Calculate shares amount approximation in collateral amount.
   *
   * @param sharesAmount Shares amount.
   * @param outcomeIndex Outcome index.
   * @param fpmmContractAddress FPMM contract address.
   * @param positionIds Array of position IDs.
   * @param collateralDecimals Number of decimal places of collateral token.
   * @returns Shares amount in collateral.
   */
  async function calcSellAmountInCollateral(
    sharesAmount: number,
    outcomeIndex: number,
    fpmmContractAddress: Address,
    positionIds: string[],
    collateralDecimals: number
  ) {
    Big.DP = 90;

    const ctContract = await initContract(ContractType.CONDITIONAL_TOKEN);
    const owners = positionIds.map(() => fpmmContractAddress);
    const ids = positionIds.map(positionId => BigInt(positionId));
    const marketSharesAmounts = await ctContract.read.balanceOfBatch([owners, ids]);

    const fpmmContract = await initContract(ContractType.FPMM, fpmmContractAddress);
    const fee = await fpmmContract.read.fee();

    const feeBN = new Big(fee.toString());
    const userFeeDecimal = feeBN.div(parseEther('1').toString());

    const marketSellingSharesAmounts = new Big(marketSharesAmounts[outcomeIndex]);
    const marketNonSellingSharesAmounts = marketSharesAmounts
      .filter((_: any, index: any) => index !== outcomeIndex)
      .map((marketShares: any) => new Big(marketShares));
    const sharesToSell = new Big(Math.round(sharesAmount * 10 ** collateralDecimals));

    const f = (r: any) => {
      /* For three outcomes, where the `x` is the one being sold, the formula is:
       * f(r) = ((y - R) * (z - R)) * (x  + a - R) - (x * y * z)
       * where:
       *   `R` is r / (1 - fee)
       *   `x`, `y`, `z` are the market maker shares for each outcome, where `x` is the market maker share being sold
       *   `a` is the amount of outcomes shares that are being sold
       *   `r` (the unknown) is the amount of collateral that will be returned in exchange of `a` tokens
       */

      const R = r.div(new Big(1).minus(userFeeDecimal)); // Adjust for fee
      // const R = r.div(1);
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
     * The x-axis is the number of collateral tokens to be received.
     * This meaning we want to know how much collateral we need to receive to have 0 outcome tokens / shares.
     */
    const r = newtonRaphson(f, 0, { maxIterations: 100 });

    if (!r) {
      return null;
    }

    return BigInt(r.toFixed(0)) as any;
  }

  /**
   * Calculate number of shares needed to get specific amount of collateral.
   *
   * @param collateralAmount Desired amount of collateral to receive.
   * @param outcomeIndex Outcome index.
   * @param fpmmContractAddress FPMM contract address.
   * @param positionIds Array of position IDs.
   * @param collateralDecimals Number of decimal places of collateral token.
   * @returns Number of shares needed to sell.
   */
  async function calcSharesForCollateral(
    collateralAmount: number,
    outcomeIndex: number,
    fpmmContractAddress: Address,
    positionIds: string[],
    collateralDecimals: number
  ) {
    Big.DP = 90;

    const ctContract = await initContract(ContractType.CONDITIONAL_TOKEN);
    const owners = positionIds.map(() => fpmmContractAddress);
    const ids = positionIds.map(positionId => BigInt(positionId));
    const marketSharesAmounts = await ctContract.read.balanceOfBatch([owners, ids]);

    const fpmmContract = await initContract(ContractType.FPMM, fpmmContractAddress);
    const fee = await fpmmContract.read.fee();

    const feeBN = new Big(fee.toString());
    const userFeeDecimal = feeBN.div(parseEther('1').toString());

    const marketSellingSharesAmounts = new Big(marketSharesAmounts[outcomeIndex]);
    const marketNonSellingSharesAmounts = marketSharesAmounts
      .filter((_: any, index: any) => index !== outcomeIndex)
      .map((marketShares: any) => new Big(marketShares));
    const desiredCollateral = new Big(Math.round(collateralAmount * 10 ** collateralDecimals));

    const f = (a: any) => {
      /* For three outcomes, where the `x` is the one being sold, the formula is:
       * f(a) = ((y - R) * (z - R)) * (x + a - R) - (x * y * z)
       * where:
       *   `R` is r / (1 - fee)
       *   `x`, `y`, `z` are the market maker shares for each outcome, where `x` is the market maker share being sold
       *   `a` (the unknown) is the amount of outcome shares that need to be sold
       *   `r` is the desired amount of collateral to receive
       */

      const R = desiredCollateral.div(new Big(1).minus(userFeeDecimal)); // Adjust for fee

      // ((y - R) * (z - R))
      const firstTerm = marketNonSellingSharesAmounts.map(h => h.minus(R)).reduce((a, b) => a.mul(b));

      // (x + a - R)
      const secondTerm = marketSellingSharesAmounts.plus(a).minus(R);

      // (x * y * z)
      const thirdTerm = marketNonSellingSharesAmounts.reduce((a, b) => a.mul(b), marketSellingSharesAmounts);

      // ((y - R) * (z - R)) * (x + a - R) - (x * y * z)
      return firstTerm.mul(secondTerm).minus(thirdTerm);
    };

    const a = newtonRaphson(f, 0, { maxIterations: 100 });

    if (!a) {
      return null;
    }

    return BigInt(a.toFixed(0));
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
    calcSharesForCollateral,
  };
}
