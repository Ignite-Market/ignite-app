<template>
  <div class="grid grid-cols-billing gap-6 mt-2 mb-8">
    <Spinner v-if="pageLoading || assetStore.loadingNfts" />
    <h4 v-else-if="!userStore.loggedIn">Please connect your wallet</h4>
    <h4 v-else-if="assetStore.nfts.length === 0">You don't have any NFTs</h4>
    <CardNft v-else v-for="asset in assetStore.nfts" :nft="asset" :open="open" @loan-created="loadNftsFromContract" />
  </div>
</template>

<script lang="ts" setup>
import { useAccount, useChainId } from '@wagmi/vue';

defineProps({
  open: { type: Boolean, default: false },
});
const chainId = useChainId();
const { address, isConnected } = useAccount();
const userStore = useUserStore();
const assetStore = useAssetStore();
const { loadNftsFromContract } = useAssets();

const pageLoading = ref<boolean>(true);

onMounted(async () => {
  await loadNfts();
  pageLoading.value = false;
});

watch(
  () => userStore.loggedIn,
  _ => {
    loadNfts();
  }
);
watch(
  () => address.value,
  _ => {
    loadNfts();
  }
);

watch(
  () => chainId.value,
  _ => {
    if (userStore.loggedIn && isConnected.value) {
      loadNftsFromContract();
    }
  }
);

async function loadNfts() {
  if (!userStore.loggedIn || !address.value) {
    return;
  }
  await loadNftsFromContract();
}
</script>
