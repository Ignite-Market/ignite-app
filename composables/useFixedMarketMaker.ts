import { useAccount } from '@wagmi/vue';
import { type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';

export default function useFixedMarketMaker() {
  const { address } = useAccount();
  const { checkCollateralAllowance, getTokenStore, loadToken } = useCollateralToken();
  const { checkConditionalApprove } = useConditionalToken();
  const { activeChain, initContract } = useContracts();
  const tokenStore = getTokenStore();

  // // Function to get price per share
  // async function getPricePerShare(
  //   contract: any, // The contract instance
  //   investmentAmount: BigNumber, // The amount to invest
  //   outcomeIndex: number // The outcome index
  // ): Promise<BigNumber> {
  //   try {
  //     // Call calcBuyAmount to get the number of shares received
  //     const sharesReceived: BigNumber = await contract.calcBuyAmount(investmentAmount, outcomeIndex);

  //     if (sharesReceived.isZero()) {
  //       throw new Error('Shares received is zero, cannot divide.');
  //     }

  //     // Price per share = investmentAmount / sharesReceived
  //     return investmentAmount.div(sharesReceived);
  //   } catch (error) {
  //     console.error('Error calculating price per share:', error);
  //     return BigNumber.from(0);
  //   }
  // }

  async function getPricePerShare(fpmmContractAddress: Address, outcomeIndex: number) {
    const amount = BigInt(Math.round(1 * 10 ** tokenStore.decimals));

    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);
    const expectedShares = await contract.read.calcBuyAmount([amount, outcomeIndex]);
    console.log(amount);
    console.log(expectedShares);

    return amount / expectedShares;
  }

  /**
   *
   * @param fpmmContractAddress
   * @param amount
   * @param outcomeIndex
   * @param slippage
   * @returns
   */
  async function getMaxTokensToSell(
    fpmmContractAddress: Address,
    amount: number,
    outcomeIndex: number,
    slippage: number
  ) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const sellAmount = await contract.read.calcSellAmount([amount, outcomeIndex]);
    const maxOutcomeTokensToSell = sellAmount * (BigInt(100 - slippage) / BigInt(100));

    return maxOutcomeTokensToSell;
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
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));
    const expectedShares = await contract.read.calcBuyAmount([scaledAmount, outcomeIndex]);
    const minOutcomeTokensToBuy = (expectedShares * BigInt(100 - slippage)) / BigInt(100);

    return minOutcomeTokensToBuy;
  }

  /**
   * Write actions.
   */

  /**
   * Adds funding to selected market.
   * @param fpmmContractAddress FPMM contract address.
   * @param amount Funding amount in collateral token.
   */
  async function addFunding(fpmmContractAddress: Address, amount: number) {
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
   *
   * @param fpmmContractAddress
   * @param amount
   * @param outcomeIndex
   * @param slippage
   * @returns
   */
  async function buy(fpmmContractAddress: Address, amount: number, outcomeIndex: number, slippage: number) {
    if (!tokenStore.loaded) {
      await loadToken();
    }
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const allowance = await checkCollateralAllowance(fpmmContractAddress);
    if (allowance) {
      const minOutcomeTokensToBuy = await getMinTokensToBuy(fpmmContractAddress, amount, outcomeIndex, slippage);
      const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));

      return await contract.write.buy([scaledAmount, outcomeIndex, minOutcomeTokensToBuy]);
    }
  }

  async function sell(fpmmContractAddress: Address, amount: number, outcomeIndex: number, slippage: number) {
    if (!tokenStore.loaded) {
      await loadToken();
    }

    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    const approved = await checkConditionalApprove(fpmmContractAddress);
    if (approved) {
      const minOutcomeTokensToBuy = await getMinTokensToBuy(fpmmContractAddress, amount, outcomeIndex, slippage);
      const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));

      return await contract.write.sell([scaledAmount, outcomeIndex, 1]);
    }
  }

  return {
    getMaxTokensToSell,
    getMinTokensToBuy,
    addFunding,
    buy,
    sell,
    getPricePerShare,
  };
}
