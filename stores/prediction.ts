import type { DataTableSortState } from 'naive-ui';
import { defineStore } from 'pinia';
import { type PredictionSetInterface, type PredictionSetsResponse } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

export const usePredictionStore = defineStore('prediction', {
  state: () => ({
    items: {} as { [category: string]: { items: PredictionSetInterface[]; ttl: number } },
    category: null as string | null,
    loading: false,
    pagination: createPagination(),
    sorter: null as DataTableSortState | null,
    filters: {
      search: {
        value: null as string | null,
      },
      status: {
        value: null as string | null,
      },
      sort: {
        value: null as string | null,
      },
      collateralTokenId: {
        value: null as number | null,
      },
    },
  }),
  getters: {
    data(state) {
      return state.items[state.category ?? 'all']?.items;
    },
    ttl(state) {
      return state.items[state.category ?? 'all']?.ttl;
    },
  },
  actions: {
    resetFilters() {
      this.filters.search.value = null;
    },

    async fetch(args: FetchParams = {}, force = true): Promise<PredictionSetInterface[]> {
      syncFilters(this.filters, args);

      if (args.category === 'all') {
        delete args.category;
      }

      if (args.category) {
        this.category = args.category;
      }

      if (this.sorter && !args?.sorter) {
        args.sorter = this.sorter;
      }

      if (this.data?.length && !force && this.ttl) {
        // If is not expired, return existing data
        if (this.ttl > new Date().getTime()) {
          return this.data;
        }
      }

      this.loading = true;

      try {
        const res = await $api.get<PredictionSetsResponse>(Endpoints.predictionSets, parseArguments(args));
        this.loading = false;

        // Set ttl to 1 minute
        const ttl = new Date().getTime() + 1000 * 60;

        !args?.page || args.page === 1
          ? (this.items[this.category ?? 'all'] = { items: res.data.items, ttl })
          : (this.items[this.category ?? 'all'] = {
              items: [...this.items[this.category ?? 'all'].items, ...res.data.items],
              ttl,
            });

        this.pagination.itemCount = res.data.total;

        if (args.page) {
          this.pagination.page = args.page;
        }

        if (args.limit) {
          this.pagination.pageSize = args.limit;
        }

        return this.items[this.category ?? 'all']?.items;
      } catch (error) {
        this.items[this.category ?? 'all'] = { items: [], ttl: 0 };
        this.loading = false;
        this.pagination.itemCount = 0;
        window.$message.error(apiError(error));
        return [];
      }
    },
  },
});
