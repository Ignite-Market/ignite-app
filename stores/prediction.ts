import type { DataTableSortState } from 'naive-ui';
import { defineStore } from 'pinia';
import { type PredictionSetInterface, type PredictionSetsResponse } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

export const usePredictionStore = defineStore('prediction', {
  state: () => ({
    active: {} as PredictionSetInterface,
    items: {} as { [category: string]: PredictionSetInterface[] },
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
    },
  }),
  getters: {
    data(state) {
      return state.items[state.category ?? 'all'];
    },
  },
  actions: {
    resetFilters() {
      this.filters.search.value = null;
    },

    async fetch(args: FetchParams = {}, force = true): Promise<PredictionSetInterface[]> {
      syncFilters(this.filters, args);
      if (args.category === 'all') {
        args.category = null;
      }
      if (args.category) {
        this.category = args.category;
      }
      if (this.data?.length && !force) {
        return this.data;
      }
      this.loading = true;

      try {
        const res = await $api.get<PredictionSetsResponse>(Endpoints.predictionSets, parseArguments(args));
        this.loading = false;

        !args?.page || args.page === 1
          ? (this.items[this.category ?? 'all'] = res.data.items)
          : this.items[this.category ?? 'all'].push(...(res.data.items as any[]));
        this.pagination.itemCount = res.data.total;
        if (args.page) {
          this.pagination.page = args.page;
        }
        if (args.limit) {
          this.pagination.pageSize = args.limit;
        }

        return this.items[this.category ?? 'all'];
      } catch (error) {
        this.items[this.category ?? 'all'] = [];
        this.loading = false;
        this.pagination.itemCount = 0;
        window.$message.error(apiError(error));
        return [];
      }
    },
  },
});
