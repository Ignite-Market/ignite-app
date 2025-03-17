<!-- TODO: this is somehow too big? -->
<template>
  <n-input v-model:value="search" placeholder="Search" size="large">
    <template #prefix>
      <NuxtIcon name="icon/search" />
    </template>
  </n-input>
</template>

<script lang="ts" setup>
const search = ref('');

onMounted(() => {
  predictionStore.filters.search.value = null;
});
onUnmounted(() => {
  predictionStore.filters.search.value = null;
});

watchDebounced(
  () => search.value,
  async search => {
    predictionStore.filters.search.value = search;
    await predictionStore.fetch();
  },
  { debounce: 1000 }
);

const predictionStore = usePredictionStore();
</script>
