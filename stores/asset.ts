import { defineStore } from 'pinia';
import type { Address } from 'viem';
import { equalsIgnoreCase } from '~/lib/misc/strings';
import type {
  AssetInterface,
  AssetResponse,
  AssetsResponse,
  MoralisNFT,
  MoralisNftsResponse,
  NFT,
} from '~/lib/types/asset';
import Endpoints from '~/lib/values/endpoints';
import { WebStorageKeys } from '~/lib/values/general.values';

export const useAssetStore = defineStore('asset', {
  state: () => ({
    items: {} as Record<number, AssetInterface>,
    nftsData: {} as Record<string, NFT>,
    nftIDs: new Set<number>(),
    nftList: [] as MoralisNFT[],
    loading: false,
    loadingNfts: false,
    pagination: createPagination(),
  }),

  getters: {
    nfts(state) {
      return Object.values(state.nftsData).filter(nft => !!nft && state.nftIDs.has(nft.id));
    },
  },

  actions: {
    nftById(nftId) {
      return Object.values(this.nftsData).find(nft => nft.id === nftId);
    },
    /**
     * Get single asset by ID
     */
    async getNfts(walletAddress: Address, force = false) {
      if (this.nfts.length && !force) {
        return this.nfts;
      }
      try {
        // const resGoldRush = await $api.get<AssetsResponse>(Endpoints.assetsByWallet(walletAddress));
        const res = await $api.get<MoralisNftsResponse>(Endpoints.assetsByWallet2(walletAddress));
        this.nftList = res.data.result;
      } catch (error) {
        window.$message.error(apiError(error));
        return null;
      }
      return this.nfts;
    },
    /**
     * Get single asset by ID
     */
    async getAsset(id: number) {
      if (id in this.items) {
        return this.items[id];
      }
      try {
        const res = await $api.get<AssetResponse>(Endpoints.asset(id));
        this.items[id] = res.data;
      } catch (error) {
        window.$message.error(apiError(error));
        return null;
      }
      return this.items[id];
    },

    async getAssetByContractAndId(chainId: number, contractAddress: string, tokenId: number) {
      const asset = Object.values(this.items).find(
        a => a.chainId === chainId && equalsIgnoreCase(a.contractAddress, contractAddress) && a.tokenId === tokenId
      );
      if (asset) {
        return asset;
      }
      try {
        const res = await $api.get<AssetResponse>(Endpoints.assetByTokenId(chainId, contractAddress, tokenId));
        this.items[res.data.id] = res.data;

        return res.data;
      } catch (error) {
        window.$message.error(apiError(error));
        return null;
      }
    },
  },
  persist: {
    key: WebStorageKeys.ASSET_STORE,
    storage: sessionStorage,
    pick: ['items', 'nftsData', 'nftList'],
  },
});
