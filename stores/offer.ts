import { defineStore } from 'pinia';
import type { TableFilters } from '~/lib/types/config';
import { OfferStatus } from '~/lib/types/offer';
import type { OfferInterface, OfferListInterface, OffersResponse } from '~/lib/types/offer';
import Endpoints from '~/lib/values/endpoints';

export const useOfferStore = defineStore('offer', {
  state: () => ({
    active: {} as OfferInterface,
    items: [] as OfferListInterface[],
    loading: false,
    pagination: createPagination(),
    sorter: null,
    filters: {
      asset_id: {
        show: false,
        value: null,
      },
      borrowerAddress: {
        show: false,
        value: null,
      },
      search: {
        show: true,
        value: null,
      },
      senderAddress: {
        show: false,
        value: null,
      },
      status: {
        show: true,
        value: null,
        options: enumKeyValues(OfferStatus),
      },
    } as TableFilters,
  }),
  actions: {
    resetFilters() {
      this.filters.asset_id.value = null;
      this.filters.borrowerAddress.value = null;
      this.filters.search.value = null;
      this.filters.senderAddress.value = null;
      this.filters.status.value = null;
      this.filters.status.options = enumKeyValues(OfferStatus);
    },

    updateOfferStatusByLoanHash(loanHash: string, status: number) {
      if (loanHash === this.active.loanHash) {
        this.active.status = status;
      }
      this.items.forEach(offer => {
        if (loanHash === offer.loanHash) {
          offer.status = status;
        }
      });
    },

    async fetch(args: FetchParams = {}): Promise<OfferListInterface[]> {
      syncFilters(this.filters, args);
      this.loading = true;

      try {
        const res = await $api.get<OffersResponse>(Endpoints.offers(), parseArguments(args));
        this.loading = false;
        this.items = res.data.items;
        this.pagination.itemCount = res.data.total;

        return this.items;
      } catch (error) {
        this.items = [];
        this.loading = false;
        this.pagination.itemCount = 0;
        window.$message.error(apiError(error));
        return [];
      }
    },

    /**
     * Get single offer by ID
     */
    async getOffer(id: string) {
      try {
        const res = await $api.get<any>(Endpoints.offers(id));
        return res.data;
      } catch (error) {
        window.$message.error(apiError(error));
        return null;
      }
    },
  },
});
