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
   * @returns
   */
  async function getSellAmount(fpmmContractAddress: Address, amount: number, outcomeIndex: number) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    return await contract.read.calcSellAmount([amount, outcomeIndex]);
  }

  /**
   *
   * @param fpmmContractAddress
   * @param amount
   * @param outcomeIndex
   * @returns
   */
  async function getBuyAmount(fpmmContractAddress: Address, amount: number, outcomeIndex: number) {
    const contract = await initContract(ContractType.FPMM, fpmmContractAddress);

    return await contract.read.calcBuyAmount([amount, outcomeIndex]);
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

  return {
    getSellAmount,
    getBuyAmount,
    addFunding,
  };
}
