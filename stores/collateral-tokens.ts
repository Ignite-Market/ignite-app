import { defineStore } from 'pinia';
import { type CollateralTokenInterface, type CollateralTokensResponse } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

/**
 * Expanded collateral token interface.
 */
export interface CollateralToken extends CollateralTokenInterface {
  balance: bigint;
  parsedBalance: string;
  quickBuy: number[];
}

/**
 * Collateral tokens store.
 */
export const useTokensStore = defineStore('collateralTokens', {
  state: () => ({
    items: {} as { [id: number]: CollateralToken },
    loaded: false,
    loading: false,
    loadingPromise: null as Promise<void> | null,
  }),
  getters: {
    getToken: state => (id: number) => {
      const token = state.items[id];
      if (token?.name === 'FXRP') {
        token.quickBuy = [0.5, 1];
      } else {
        token.quickBuy = [1, 3];
      }
      return token;
    },
  },
  actions: {
    ensureLoaded(): Promise<void> {
      if (this.loaded) {
        return Promise.resolve();
      }

      // If loading, return the existing promise.
      if (this.loading && this.loadingPromise) {
        return this.loadingPromise;
      }

      // If not loaded and not loading, fetch the data.
      return this.fetch();
    },
    fetch(): Promise<void> {
      if (this.loading) {
        return this.loadingPromise!;
      }
      this.loading = true;

      this.loadingPromise = new Promise<void>((resolve, reject) => {
        $api
          .get<CollateralTokensResponse>(Endpoints.collateralTokens)
          .then(res => {
            for (const token of res.data.items) {
              this.items[token.id] = {
                ...token,
                balance: BigInt(0),
                parsedBalance: '0.0',
              };
            }
            this.loaded = true;
            resolve();
          })
          .catch(error => {
            window.$message.error(apiError(error));
            reject(error);
          })
          .finally(() => {
            this.loading = false;
            this.loadingPromise = null;
          });
      });

      return this.loadingPromise;
    },
  },
});
