import { defineStore } from 'pinia';
import type { TableFilters } from '~/lib/types/config';
import type {
  OfferRequestInterface,
  OfferRequestListInterface,
  OfferRequestResponse,
  OfferRequestsResponse,
} from '~/lib/types/offer';
import Endpoints from '~/lib/values/endpoints';

export const useOfferRequestStore = defineStore('offerRequest', {
  state: () => ({
    active: {} as OfferRequestInterface,
    items: [] as OfferRequestListInterface[],
    loading: false,
    pagination: createPagination(),
    sorter: null,
    filters: {
      asset_id: {
        show: false,
        value: null,
      },
      search: {
        show: true,
        value: null,
      },
    } as TableFilters,
  }),
  actions: {
    resetFilters() {
      this.filters.asset_id.value = null;
      this.filters.search.value = null;
    },

    async fetch(args: FetchParams = {}) {
      syncFilters(this.filters, args);
      this.loading = true;

      try {
        const params = parseArguments(args);
        const res = await $api.get<OfferRequestsResponse>(Endpoints.offerRequests(), params);
        this.loading = false;
        this.items = res.data.items;
        this.pagination.itemCount = res.data.total;

        return res;
      } catch (error) {
        this.items = [];
        this.loading = false;
        this.pagination.itemCount = 0;
        window.$message.error(apiError(error));
      }
      return this.items;
    },

    /**
     * Get single offerRequest by ID
     */
    async getOfferRequest(id: string) {
      try {
        const res = await $api.get<OfferRequestResponse>(Endpoints.offerRequests(id));
        this.active = res.data;

        return res.data;
      } catch (error) {
        window.$message.error(apiError(error));
        return null;
      }
    },

    async updateOfferRequest(id: number, data: any) {
      try {
        const res = await $api.put<any>(Endpoints.offerRequests(id), data);

        Object.assign(this.active, res, data);
        this.items.forEach(item => {
          if (item.id === id) {
            Object.assign(item, res, data);
          }
        });
      } catch (error) {
        return null;
      }
    },
  },
});
