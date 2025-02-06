import { useAccount, useChainId } from '@wagmi/vue';
import { ContractType } from '~/lib/config/contracts';
import { Chains } from '~/lib/types/asset';

export default function useLendeeFi() {
  const message = useMessage();
  const chainId = useChainId();
  const userStore = useUserStore();
  const { address } = useAccount();
  const { ensureCorrectNetwork, initContract, getContractAddressByChain } = useContracts();

  /**
   * Read actions
   */
  async function getName(): Promise<string> {
    const contract = await initContract(ContractType.TOKEN);
    return await contract.read.name([]);
  }
  async function getSymbol(): Promise<string> {
    const contract = await initContract(ContractType.TOKEN);
    return await contract.read.symbol([]);
  }
  async function allowance(): Promise<bigint> {
    const lendeeFiAddress = getContractAddressByChain();
    const contract = await initContract(ContractType.TOKEN);
    return await contract.read.allowance([address.value, lendeeFiAddress]);
  }
  async function getTokenBalance(): Promise<bigint> {
    const contract = await initContract(ContractType.TOKEN);
    return await contract.read.balanceOf([address.value]);
  }

  /**
   * Write actions
   */
  async function increaseAllowance(addedValue: bigint = BigInt(1) * 10n ** 18n) {
    const lendeeFiAddress = getContractAddressByChain();
    const contract = await initContract(ContractType.TOKEN);
    return await contract.write.approve([lendeeFiAddress, addedValue]);
  }

  /**
   * Actions
   */
  async function syncBalance(id?: number) {
    try {
      await ensureCorrectNetwork(id || chainId.value);

      const tokenStore = getTokenStore();
      tokenStore.balance = await getTokenBalance();
      tokenStore.symbol = await getSymbol();
      tokenStore.allowance = await allowance();
    } catch (e) {
      console.error(e);
      message.error(contractError(e));

      const tokenStore = getTokenStore();
      tokenStore.allowance = BigInt(0);
      tokenStore.balance = BigInt(0);
      tokenStore.symbol = '';
    }
  }

  function getTokenStore() {
    switch (chainId.value) {
      case Chains.BASE:
        return userStore.token.base;
      case Chains.BSC:
        return userStore.token.bsc;
      default:
        return userStore.token.moonbeam;
    }
  }

  return {
    allowance,
    getName,
    getTokenBalance,
    getSymbol,
    getTokenStore,
    increaseAllowance,
    syncBalance,
  };
}
