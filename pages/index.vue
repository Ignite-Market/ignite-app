<template>
  <Dashboard @load-more="loadMore">
    <BannerListing />
    <PredictionSetListing ref="predictionSetListing" :category="'top'" />
  </Dashboard>
</template>

<script lang="ts" setup>
const predictionSetListing = ref(null as any);
const loadMore = async () => {
  await predictionSetListing.value?.onInfiniteLoad();
};
</script>
