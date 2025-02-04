import { defineStore } from 'pinia';
import { Chains } from '~/lib/types/asset';
import { ALL_ITEMS_KEY, WebStorageKeys } from '~/lib/values/general.values';
import type { ContractEvent, ContractEventItems, ContractEventResponse } from '~/lib/types/contractEvent';

const queryEvents = `
  query contractEvents() {
    contractEvents() {
        block
        address
        event
        id
        loanHash
        timestamp
        type
        data
    }
  }
`;
const queryEventsByLoanHash = `
  query contractEvents($loanHash: String!) {
    contractEvents(where: {loanHash_eq: $loanHash}) {
        block
        address
        event
        id
        loanHash
        timestamp
        type
        data
    }
  }
`;

export const useContractEventStore = defineStore('contractEvent', {
  state: () => ({
    items: enumValues(Chains).reduce((acc, chainId) => (acc[chainId] = {} as ContractEventItems), {}),
    loading: false,
  }),

  getters: {},

  actions: {
    hasEvents(key: string, networkId: number) {
      return networkId in this.items && key in this.items[networkId] && this.items[networkId][key].length;
    },

    /** Fetch events */
    async fetchEvents(chainId: number): Promise<ContractEvent[]> {
      this.loading = true;
      if (!(chainId in this.items)) {
        this.items[chainId] = {} as ContractEventItems;
      }

      try {
        const res = await $graphQLClient.request<ContractEventResponse>(queryEvents, {}, chainId);
        this.items[chainId][ALL_ITEMS_KEY] = res.contractEvents || [];
      } catch (error) {
        window.$message.error(apiError(error));
      }

      this.loading = false;
      return this.items[chainId][ALL_ITEMS_KEY];
    },

    async fetchEventsByLoanHash(loanHash: string, chainId: number): Promise<ContractEvent[]> {
      this.loading = true;
      if (!(chainId in this.items)) {
        this.items[chainId] = {} as ContractEventItems;
      }

      try {
        const variables = { loanHash };
        const res = await $graphQLClient.request<ContractEventResponse>(queryEventsByLoanHash, variables, chainId);
        this.items[chainId][loanHash] = res.contractEvents || [];
      } catch (error) {
        window.$message.error(apiError(error));
      }

      this.loading = false;
      return this.items[chainId][loanHash];
    },
  },
  persist: {
    key: WebStorageKeys.CONTRACT_EVENT_STORE,
    storage: sessionStorage,
    pick: ['items'],
  },
});
