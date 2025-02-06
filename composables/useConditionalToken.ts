import { useAccount } from '@wagmi/vue';
import { type Address, getAddress } from 'viem';
import { ContractType } from '~/lib/config/contracts';
import { maxUint256 } from 'viem';

export default function useCollateralToken() {
  const { address } = useAccount();
  const { ensureCorrectNetwork, initContract } = useContracts();
  const txWait = useTxWait();
  const message = useMessage();
  const userStore = useUserStore();

  /**
   *
   * @param fpmmContractAddress
   * @returns
   */
  async function checkAllowance(fpmmContractAddress: Address) {
    const contract = await initContract(ContractType.COLLATERAL_TOKEN);

    try {
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
   *
   * @returns
   */
  async function getTokenBalance() {
    const contract = await initContract(ContractType.COLLATERAL_TOKEN);
    return await contract.read.balanceOf([address.value]);
  }

  /**
   *
   * @returns
   */
  async function getSymbol(): Promise<string> {
    const contract = await initContract(ContractType.COLLATERAL_TOKEN);

    return await contract.read.symbol([]);
  }

  /**
   *
   * @returns
   */
  async function getDecimals(): Promise<number> {
    const contract = await initContract(ContractType.COLLATERAL_TOKEN);

    return await contract.read.decimals([]);
  }

  /**
   *
   * @param fixed
   * @returns
   */
  function parseBalance(fixed: number = 3) {
    const tokenStore = getTokenStore();

    const balance = Number(tokenStore.balance) / Math.pow(10, tokenStore.decimals);

    return balance.toFixed(fixed);
  }

  /**
   *
   */
  async function loadToken() {
    const tokenStore = getTokenStore();
    try {
      await ensureCorrectNetwork();

      tokenStore.loading = true;
      tokenStore.balance = await getTokenBalance();
      tokenStore.decimals = await getDecimals();
      tokenStore.symbol = await getSymbol();
      tokenStore.parsedBalance = parseBalance();
      tokenStore.loaded = true;
    } catch (e) {
      console.error(e);
      message.error(contractError(e));

      tokenStore.balance = BigInt(0);
      tokenStore.parsedBalance = '0.0';
      tokenStore.decimals = 0;
      tokenStore.symbol = '';
      tokenStore.loaded = false;
    } finally {
      tokenStore.loading = false;
    }
  }

  /**
   *
   */
  async function refreshBalance() {
    const tokenStore = getTokenStore();

    if (!tokenStore.loaded) {
      await loadToken();
    } else {
      tokenStore.loading = true;
      tokenStore.balance = await getTokenBalance();
      tokenStore.parsedBalance = parseBalance();
      tokenStore.loading = false;
    }
  }

  /**
   *
   * @returns
   */
  function getTokenStore() {
    return userStore.collateralToken;
  }

  return {
    getTokenStore,
    checkAllowance,
    getTokenBalance,
    getSymbol,
    refreshBalance,
    loadToken,
    parseBalance,
  };
}
