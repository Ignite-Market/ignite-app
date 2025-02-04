export default function useAsset() {
  const assetStore = useAssetStore();
  const { getBalance, getTokenOfOwner, getNftById } = useNft();

  async function loadNftsFromContract() {
    if (assetStore.loadingNfts) return;

    assetStore.loadingNfts = true;
    try {
      const balance = await getBalance();
      assetStore.nftIDs.clear();

      Array.from({ length: Number(balance) }, async (_, i) => {
        const tokenId = Number(await getTokenOfOwner(i));
        assetStore.nftIDs.add(tokenId);

        if (!(tokenId in assetStore.nftsData)) {
          assetStore.nftsData[tokenId] = await getNftById(tokenId);
        }
      });
    } catch (error) {
      console.error(error);
    }
    assetStore.loadingNfts = false;
  }

  return {
    loadNftsFromContract,
  };
}
