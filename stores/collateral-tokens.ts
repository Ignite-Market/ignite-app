import { defineStore } from 'pinia';
import { type CollateralTokenInterface, type CollateralTokensResponse } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

/**
 * Expanded collateral token interface.
 */
export interface CollateralToken extends CollateralTokenInterface {
  balance: bigint;
  parsedBalance: string;
}

/**
 * Collateral tokens store.
 */
export const useTokensStore = defineStore('collateralTokens', {
  state: () => ({
    items: {} as { [id: number]: CollateralToken },
    loaded: false,
    loading: false,
  }),
  getters: {
    getToken: state => (id: number) => {
      return state.items[id];
    },
  },
  actions: {
    async ensureLoaded(): Promise<void> {
      if (!this.loaded && !this.loading) {
        await this.fetch();
      }
    },
    async fetch(): Promise<void> {
      this.loading = true;

      try {
        const res = await $api.get<CollateralTokensResponse>(Endpoints.collateralTokens);
        for (const token of res.data.items) {
          this.items[token.id] = {
            ...token,
            balance: BigInt(0),
            parsedBalance: '0.0',
          };
        }

        this.loaded = true;
      } catch (error) {
        window.$message.error(apiError(error));
      } finally {
        this.loading = false;
      }
    },
  },
});
