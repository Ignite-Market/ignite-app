<template>
  <n-select
    v-model:value="status"
    :theme-overrides="{
      peers: {
        InternalSelection: { color: '#292929', clearColor: '#C56AC6' },
      },
    }"
    placeholder="Status"
    :options="options"
    clearable
  >
    <template #arrow>
      <NuxtIcon name="icon/arrow-down" class="icon-auto !inline-flex flex-cc" />
    </template>
  </n-select>
</template>

<script lang="ts" setup>
import { PredictionSetStatus } from '~/lib/types/prediction-set';

const predictionStore = usePredictionStore();

const status = ref(null);

const options = [
  { label: 'Active', value: PredictionSetStatus.ACTIVE },
  { label: 'Resolved', value: PredictionSetStatus.PENDING },
  { label: 'Funding', value: PredictionSetStatus.FUNDING },
];

onMounted(() => {
  predictionStore.filters.status.value = null;
});
onUnmounted(() => {
  predictionStore.filters.status.value = null;
});

watch(
  () => status.value,
  async status => {
    predictionStore.filters.status.value = status;
    await predictionStore.fetch();
  }
);
</script>
