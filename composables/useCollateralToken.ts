import { useAccount } from '@wagmi/vue';
import { maxUint256, type Address } from 'viem';
import { ContractType } from '~/lib/config/contracts';

export default function useCollateralToken() {
  const { ensureCorrectNetwork, initContract } = useContracts();
  const { address, isConnected } = useAccount();
  const txWait = useTxWait();
  const message = useMessage();
  const tokensStore = useTokensStore();

  /**
   * Checks collateral token balance and increases it if it is not sufficient.
   *
   * @param collateralId Collateral token ID.
   * @param fpmmContractAddress FPMM contract address.
   * @returns Boolean.
   */
  async function checkCollateralAllowance(collateralId: number, fpmmContractAddress: Address): Promise<boolean> {
    if (!isConnected.value) {
      return false;
    }

    const token = tokensStore.getToken(collateralId);
    if (!token) {
      return false;
    }

    const contract = await initContract(ContractType.COLLATERAL_TOKEN, token.address);
    try {
      await ensureCorrectNetwork();

      const allowance = await contract.read.allowance([address.value, fpmmContractAddress]);
      if (allowance < maxUint256) {
        txWait.hash.value = await contract.write.approve([fpmmContractAddress, maxUint256]);
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
   * Get collateral token balance.
   *
   * @param collateralId Collateral token ID.
   * @returns Collateral token balance.
   */
  async function getCollateralBalance(collateralId: number) {
    if (!isConnected.value) {
      return BigInt(0);
    }

    const token = tokensStore.getToken(collateralId);
    if (!token) {
      return BigInt(0);
    }

    const contract = await initContract(ContractType.COLLATERAL_TOKEN, token.address);
    return await contract.read.balanceOf([address.value]);
  }

  /**
   * Parses collateral token balance.
   *
   * @param fixed TO how many decimal points should the balance be parsed.
   * @returns Parsed balance.
   */
  function parseBalance(balance: bigint, decimals: number, fixed: number = 3) {
    return (Number(balance) / Math.pow(10, decimals)).toFixed(fixed);
  }

  /**
   * Refreshes collateral token.
   */
  async function refreshCollateralBalance(collateralId: number) {
    const token = tokensStore.getToken(collateralId);
    if (!token) {
      return;
    }

    token.balance = await getCollateralBalance(collateralId);
    token.parsedBalance = parseBalance(token.balance, token.decimals);
  }

  return {
    checkCollateralAllowance,
    getCollateralBalance,
    refreshCollateralBalance,
    parseBalance,
  };
}
