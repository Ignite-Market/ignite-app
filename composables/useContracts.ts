import { useChainId, useChains, useClient, useConnectorClient, useSwitchChain } from '@wagmi/vue';
import type { Address, Client, Transport, Chain, Account } from 'viem';
import { createPublicClient, getContract, http } from 'viem';
import { Chains } from '~/lib/types/asset';
import { ContractType, getContractAbi } from '~/lib/config/contracts';

const contracts = reactive<{ [key: string]: any }>({});
const readContracts = reactive<{ [key: string]: any }>({});
const publicClients = reactive<Record<number, Client<Transport, Chain | undefined, Account | undefined>>>({});

export default function useContracts() {
  const config = useRuntimeConfig();
  const chainId = useChainId();
  const chains = useChains();
  const { switchChain } = useSwitchChain();
  const publicClient = useClient();
  const { data: walletClient, refetch } = useConnectorClient();

  const activeChain = computed(() => chains.value.find(chain => chain.id === chainId.value)) || chains[0];

  function initPublicClients() {
    chains.value.forEach(chain => {
      if (!(chain.id in publicClients)) {
        publicClients[chain.id] = createPublicClient({
          chain,
          transport: http(),
        });
      }
    });
  }
  function getPublicClient(id: number) {
    if (!(id in publicClients)) {
      initPublicClients();
    }
    return publicClients[id];
  }

  async function getReadContract(contractType: ContractType, chainId: number, contractAddress?: Address) {
    const address = contractAddress || getContractAddressByChain(contractType);
    if (!(address in contracts)) {
      readContracts[address] = getContract({
        address,
        abi: getContractAbi(contractType),
        client: getPublicClient(chainId),
      });
    }

    return readContracts[address];
  }

  /**
   *
   * @param contractType
   * @param contractAddress
   * @returns
   */
  async function initContract(contractType: ContractType, contractAddress?: Address) {
    if (!walletClient.value) {
      await refetch();
      await sleep(200);
    }

    const address = contractAddress || getContractAddressByChain(contractType);
    const key = `${address}_${chainId.value}`;

    if (!(key in contracts)) {
      contracts[key] = getContract({
        address,
        abi: getContractAbi(contractType),
        client: walletClient.value,
        publicClient: publicClient.value,
      });
    }

    return contracts[key];
  }

  // Helpers
  async function ensureCorrectNetwork(id: number, retry = 0) {
    if (id !== chainId.value) {
      await switchChain({ chainId: id });
      await sleep(100);
      await refetch();
      await sleep(100);

      if (id !== chainId.value) {
        if (retry > 5) {
          throw new Error('Failed to switch chain');
        }
        await sleep(100);
        await ensureCorrectNetwork(id, retry + 1);
      }
    }
  }

  function resetContracts() {
    Object.keys(contracts).forEach(key => {
      delete contracts[key];
    });
  }

  function getContractAddress(type: ContractType): Address | null {
    switch (type) {
      case ContractType.FPMM:

      default:
        return null;
    }
  }

  return {
    contracts,
    activeChain,
    initContract,
    ensureCorrectNetwork,
    getContractAddress,
    getPublicClient,
    getReadContract,
    resetContracts,
  };
}
