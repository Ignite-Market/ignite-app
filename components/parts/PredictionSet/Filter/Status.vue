<!-- TODO: this is somehow too big? -->
<template>
  <n-select
    v-model:value="status"
    :theme-overrides="{ peers: { InternalSelection: { color: '#292929' } } }"
    placeholder="Status"
    :options="options"
  >
    <template #arrow>
      <NuxtIcon name="icon/arrow-down" class="icon-auto !inline-flex flex-cc" />
    </template>
  </n-select>
</template>

<script lang="ts" setup>
const status = ref(null);

const options = [
  { label: 'All', value: 1 },
  { label: 'Active', value: 2 },
  { label: 'Resolved', value: 3 },
];

onMounted(() => {
  predictionStore.filters.search.value = null;
});
onUnmounted(() => {
  predictionStore.filters.search.value = null;
});

watchDebounced(
  () => status.value,
  async status => {
    predictionStore.filters.status.value = status;
    await predictionStore.fetch();
  },
  { debounce: 1000 }
);

const predictionStore = usePredictionStore();
</script>
