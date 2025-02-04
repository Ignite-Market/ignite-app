import { useChainId } from '@wagmi/vue';
import type { Chains } from '~/lib/types/asset';
import { WormholeMessageReceived, type ContractEvent, type ContractEventItems } from '~/lib/types/contractEvent';
import { ALL_ITEMS_KEY } from '~/lib/values/general.values';

export default function useContractEvent() {
  const message = useMessage();
  const chainId = useChainId();
  const contractEventStore = useContractEventStore();

  let contractEventInterval = null as any;

  const isLoanCreated = (status: number = 0) => {
    return status === WormholeMessageReceived.LOAN_CRATED;
  };
  const isLoanRepayed = (status: number = 0) => {
    return status === WormholeMessageReceived.REPAYMENT_COMPLETED;
  };
  const isLoanDefaulted = (status: number = 0) => {
    return status === WormholeMessageReceived.DEFAULT_COMPLETED;
  };
  const isTransactionFinished = (status: number = 0) => {
    return (
      status === WormholeMessageReceived.LOAN_CRATED ||
      status === WormholeMessageReceived.REPAYMENT_COMPLETED ||
      status === WormholeMessageReceived.DEFAULT_COMPLETED
    );
  };

  function getAllEvents(loanHash: string): ContractEvent[] {
    return (Object.values(contractEventStore.items) as ContractEventItems[])
      .reduce(
        (acc, items) => (loanHash in items ? [...acc, ...items[loanHash].map(e => ({ ...e }))] : acc),
        [] as ContractEvent[]
      )
      .sort((a, b) => (b.timestamp > a.timestamp ? -1 : 0));
  }

  async function getEvents(loanHash?: string, chain?: number): Promise<ContractEvent[]> {
    const networkId = chain || chainId.value;
    const key = loanHash || ALL_ITEMS_KEY;

    if (contractEventStore.hasEvents(key, networkId)) {
      return contractEventStore.items[networkId][key];
    }
    return loanHash
      ? await contractEventStore.fetchEventsByLoanHash(loanHash, networkId)
      : await contractEventStore.fetchEvents(networkId);
  }

  function getLoanStatus(loanHash: string): number {
    return (
      getAllEvents(loanHash).findLast(e => !!e.data.messageType)?.data.messageType ||
      WormholeMessageReceived.LOAN_CRATE_STARTED
    );
  }

  async function getLoanStatusByChain(loanHash: string, chain?: number) {
    const networkId = chain || chainId.value;

    const events = await getEvents(loanHash, networkId);
    return events.findLast(e => !!e.data.messageType)?.data.messageType;
  }

  /** Events pooling, wait on repay */
  async function waitForTransaction(loanHash: string, chain?: Chains) {
    clearInterval(contractEventInterval);

    const networkId = chain || chainId.value;
    const events = await contractEventStore.fetchEventsByLoanHash(loanHash, networkId);
    if (events.length && events.some(event => isTransactionFinished(event.data?.messageType))) {
      clearInterval(contractEventInterval);
      return;
    }

    contractEventInterval = setInterval(async () => {
      const events = await contractEventStore.fetchEventsByLoanHash(loanHash, networkId);

      if (events.some(event => isTransactionFinished(event.data?.messageType))) {
        clearInterval(contractEventInterval);

        if (isLoanRepayed(getLoanStatus(loanHash))) {
          message.success('Repay completed');
        } else {
          message.success('Loan default completed');
        }
        return;
      }
    }, 10000);
  }

  return { getAllEvents, getEvents, getLoanStatus, getLoanStatusByChain, waitForTransaction };
}
