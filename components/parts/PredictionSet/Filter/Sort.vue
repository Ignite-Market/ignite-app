<!-- TODO: this is somehow too big? -->
<template>
  <n-select
    v-model:value="sort"
    :theme-overrides="{ peers: { InternalSelection: { color: '#292929' } } }"
    placeholder="Sort by"
    :options="options"
  >
    <template #arrow>
      <NuxtIcon name="icon/arrow-down" class="icon-auto !inline-flex flex-cc" />
    </template>
  </n-select>
</template>

<script lang="ts" setup>
import type { DataTableSortState } from 'naive-ui';

const sort = ref(null);

const options = [
  { label: 'Newest', value: 1 },
  { label: 'Oldest', value: 2 },
  { label: 'Ending Soon', value: 3 },
];

onMounted(() => {
  predictionStore.filters.search.value = null;
});
onUnmounted(() => {
  predictionStore.filters.search.value = null;
});

watchDebounced(
  () => sort.value,
  async sort => {
    console.log(sort);
    if (sort) {
      predictionStore.sorter = getSorter(sort!);
      await predictionStore.fetch();
    }
  },
  { debounce: 500 }
);
function getSorter(sort: number): DataTableSortState {
  switch (sort) {
    case 1:
      return {
        columnKey: 'createTime',
        order: 'descend',
        sorter: 'default',
      };
    case 2:
      return {
        columnKey: 'createTime',
        order: 'ascend',
        sorter: 'default',
      };
    case 3:
      return {
        columnKey: 'endTime',
        order: 'descend',
        sorter: 'default',
      };

    default:
      return {
        columnKey: 'id',
        order: 'descend',
        sorter: 'default',
      };
  }
}
const predictionStore = usePredictionStore();
</script>
