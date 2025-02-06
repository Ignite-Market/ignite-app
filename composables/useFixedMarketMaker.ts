import { useAccount } from '@wagmi/vue';
import { type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';

export default function useFixedMarketMaker() {
  const { address } = useAccount();
  const { checkAllowance, getTokenStore, loadToken } = useCollateralToken();
  const { activeChain, initContract } = useContracts();
  const tokenStore = getTokenStore();

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

    const allowance = await checkAllowance(fpmmContractAddress);
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

    const allowance = await checkAllowance(fpmmContractAddress);
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

    const allowance = await checkAllowance(fpmmContractAddress);
    if (allowance) {
      const minOutcomeTokensToBuy = await getMinTokensToBuy(fpmmContractAddress, amount, outcomeIndex, slippage);
      const scaledAmount = BigInt(Math.round(amount * 10 ** tokenStore.decimals));

      return await contract.write.buy([scaledAmount, outcomeIndex, minOutcomeTokensToBuy]);
    }
  }

  return {
    getMaxTokensToSell,
    getMinTokensToBuy,
    addFunding,
    buy,
  };
}
