import { useAccount } from '@wagmi/vue';
import { type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';

export default function useConditionalToken() {
  const { address } = useAccount();
  const { ensureCorrectNetwork, initContract } = useContracts();
  const txWait = useTxWait();
  const message = useMessage();

  const { getTokenStore } = useCollateralToken();

  /**
   *
   * @param fpmmContractAddress
   * @returns
   */
  async function checkConditionalApprove(fpmmContractAddress: Address) {
    const contract = await initContract(ContractType.CONDITIONAL_TOKEN);

    try {
      const isApproved = await contract.read.isApprovedForAll([address.value, fpmmContractAddress]);
      if (!isApproved) {
        txWait.hash.value = await contract.write.setApprovalForAll([fpmmContractAddress, true]);
        const receipt = await txWait.wait();
        console.debug(receipt);
      }

      return true;
    } catch (e) {
      console.error(e);
      message.error(contractError(e));
      return false;
    }
  }

  /**
   * Gets balance of conditional tokens for give position ID.
   */
  async function getConditionalBalance(outcomePositionId: string) {
    const contract = await initContract(ContractType.CONDITIONAL_TOKEN);

    return await contract.read.balanceOf([address.value, outcomePositionId]);
  }

  /**
   *
   * @param fixed
   * @returns
   */
  function parseConditionalBalance(balance: bigint) {
    const tokenStore = getTokenStore();
    const parsedBalance = Number(balance) / Math.pow(10, tokenStore.decimals);

    return parsedBalance.toFixed(tokenStore.decimals);
  }

  return {
    checkConditionalApprove,
    getConditionalBalance,
    parseConditionalBalance,
  };
}
