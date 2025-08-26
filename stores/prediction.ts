import type { DataTableSortState } from 'naive-ui';
import { defineStore } from 'pinia';
import { WebStorageKeys } from '../lib/values/general.values';
import { type PredictionSetInterface, type PredictionSetsResponse } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

interface CopiedPredictionData {
  question: string;
  outcomeResolutionDef: string;
  imgUrl: string;
  predictionOutcomes: Array<{ name: string; imgUrl: string }>;
  startTime: number;
  endTime: number;
  resolutionTime: number;
  collateral_token_id: number;
  categories: string[];
}

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
    suggestions: [] as any[],
    copiedPrediction: null as CopiedPredictionData | null,
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

      if (args.category) {
        this.category = args.category;
      } else if (this.category) {
        args.category = this.category;
      }

      if (args.category === 'all') {
        delete args.category;
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

    async generateSuggestions(prompt: string): Promise<any[]> {
      const res = await $api.post<any>(Endpoints.predictionSetsSuggestions, { prompt });
      // const res = await Promise.resolve({
      //   data: [
      //     {
      //       question: 'Will the winner of the 2025 Tour de France complete the race in under 85 hours?',
      //       outcomeResolutionDef:
      //         "This market will resolve to 'Yes' if the official total time of the 2025 Tour de France winner, as reported by the official Tour de France website or another reputable sports news source, is less than 85 hours. Otherwise, it will resolve to 'No'.",
      //       startTime: '2023-10-07T00:00:00',
      //       endTime: '2025-07-27T00:00:00',
      //       resolutionTime: '2025-07-28T00:00:00',
      //       predictionOutcomes: [
      //         {
      //           name: 'Yes',
      //         },
      //         {
      //           name: 'No',
      //         },
      //       ],
      //     },
      //     {
      //       question: 'Will a rider from France win the 2025 Tour de France?',
      //       outcomeResolutionDef:
      //         "This market will resolve to 'Yes' if the official winner of the 2025 Tour de France is a French national, as reported by the official Tour de France website or another reputable sports news source. Otherwise, it will resolve to 'No'.",
      //       startTime: '2023-10-07T00:00:00',
      //       endTime: '2025-07-27T00:00:00',
      //       resolutionTime: '2025-07-28T00:00:00',
      //       predictionOutcomes: [
      //         {
      //           name: 'Yes',
      //         },
      //         {
      //           name: 'No',
      //         },
      //       ],
      //     },
      //     {
      //       question: 'Will the 2025 Tour de France have a stage canceled due to weather?',
      //       outcomeResolutionDef:
      //         "This market will resolve to 'Yes' if any stage of the 2025 Tour de France is canceled due to weather conditions, as reported by the official Tour de France website or another reputable sports news source. Otherwise, it will resolve to 'No'.",
      //       startTime: '2023-10-07T00:00:00',
      //       endTime: '2025-07-27T00:00:00',
      //       resolutionTime: '2025-07-28T00:00:00',
      //       predictionOutcomes: [
      //         {
      //           name: 'Yes',
      //         },
      //         {
      //           name: 'No',
      //         },
      //       ],
      //     },
      //   ],
      // });
      this.suggestions = res.data;
      console.log(this.suggestions);
      return this.suggestions;
    },

    setCopiedPrediction(prediction: PredictionSetInterface) {
      this.copiedPrediction = {
        question: prediction.question,
        outcomeResolutionDef: prediction.outcomeResolutionDef,
        imgUrl: prediction.imgUrl,
        predictionOutcomes: prediction.outcomes.map(outcome => ({
          name: outcome.name,
          imgUrl: outcome.imgUrl,
        })),
        startTime: new Date(prediction.startTime).getTime(),
        endTime: new Date(prediction.endTime).getTime(),
        resolutionTime: new Date(prediction.resolutionTime).getTime(),
        collateral_token_id: prediction.collateral_token_id,
        categories: [],
      };
    },

    clearCopiedPrediction() {
      this.copiedPrediction = null;
    },
  },
  persist: {
    key: WebStorageKeys.PREDICTION_STORE,
    storage: localStorage,
    pick: ['suggestions'],
  },
});
