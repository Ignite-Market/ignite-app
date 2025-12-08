import { useChainId, useChains, useConnectorClient, useSwitchChain } from '@wagmi/vue';
import type { Address } from 'viem';
import { createPublicClient, getContract, http } from 'viem';
import { ContractType, getContractAbi } from '~/lib/config/contracts';

const contracts = reactive<{ [key: string]: any }>({});
const readContracts = reactive<{ [key: string]: any }>({});

export default function useContracts() {
  const { switchChain } = useSwitchChain();
  const { data: walletClient, refetch } = useConnectorClient();
  const config = useRuntimeConfig();
  const chainId = useChainId();
  const chains = useChains();

  const activeChain = computed(() => chains.value.find(chain => chain.id === chainId.value)) || chains[0];
  const publicClient = createPublicClient({
    chain: activeChain.value,
    transport: http(),
  });

  /**
   * Initialize a read contract.
   *
   * @param contractType The type of contract to initialize.
   * @param contractAddress The address of the contract to initialize.
   * @returns The read contract.
   */
  function initReadContract(contractType: ContractType, contractAddress?: Address) {
    if ((contractType === ContractType.FPMM || contractType === ContractType.COLLATERAL_TOKEN) && !contractAddress) {
      throw new Error('FPMM contract address must be provided!');
    }

    const address = contractAddress || getContractAddress(contractType);
    if (!address) {
      throw new Error('Address not valid!');
    }

    if (!(address in readContracts)) {
      readContracts[address] = getContract({
        address,
        abi: getContractAbi(contractType),
        client: publicClient,
      });
    }

    return readContracts[address];
  }

  /**
   * Initialize a write contract.
   *
   * @param contractType The type of contract to initialize.
   * @param contractAddress The address of the contract to initialize.
   * @returns The write contract.
   */
  async function initContract(contractType: ContractType, contractAddress?: Address) {
    if ((contractType === ContractType.FPMM || contractType === ContractType.COLLATERAL_TOKEN) && !contractAddress) {
      throw new Error('FPMM contract address must be provided!');
    }

    if (!walletClient.value) {
      await refetch();
      await sleep(200);
    }

    if (!walletClient.value) {
      throw new Error('Wallet client not available!');
    }

    const address = contractAddress || getContractAddress(contractType);
    if (!address) {
      throw new Error('Address not valid!');
    }

    if (!(address in contracts)) {
      contracts[address] = getContract({
        address,
        abi: getContractAbi(contractType),
        client: {
          wallet: walletClient.value,
          public: publicClient,
        },
      });
    }

    return contracts[address];
  }

  /**
   * Ensure the correct network is selected.
   *
   * @param retry The number of times to retry.
   */
  async function ensureCorrectNetwork(retry: number = 0) {
    const desiredChainId = chains.value[0].id;

    switchChain({ chainId: desiredChainId });
    await sleep(100);
    await refetch();
    await sleep(100);

    if (desiredChainId !== chainId.value) {
      if (retry > 5) {
        throw new Error('Failed to switch chain!');
      }
      await sleep(100);
      await ensureCorrectNetwork(retry + 1);
    }
  }

  /**
   * Reset the contracts.
   */
  function resetContracts() {
    Object.keys(contracts).forEach(key => {
      delete contracts[key];
    });
  }

  /**
   * Get the contract address.
   *
   * @param type The type of contract.
   * @returns The contract address.
   */
  function getContractAddress(type: ContractType): Address | undefined {
    switch (type) {
      case ContractType.CONDITIONAL_TOKEN:
        return config.public.CONDITIONAL_TOKEN_CONTRACT as Address;
      case ContractType.ORACLE:
        return config.public.ORACLE_CONTRACT as Address;
    }

    return undefined;
  }

  return {
    contracts,
    activeChain,
    initContract,
    ensureCorrectNetwork,
    getContractAddress,
    initReadContract,
    resetContracts,
  };
}
