<template>
  <n-auto-complete
    v-model:value="search"
    :options="options"
    :clear-after-select="true"
    show-empty
    placeholder="Search markets"
    size="large"
    class="md:min-w-[200px] xl:min-w-[30vw]"
    :render-option="renderOption"
  >
    <template #prefix>
      <NuxtIcon name="icon/search" />
    </template>

    <template #empty>
      <div v-if="loading" class="w-full">
        <n-skeleton height="40px" width="100%" class="rounded-[8px]" />
      </div>
      <div v-else>No results</div>
    </template>
  </n-auto-complete>
</template>

<script lang="ts" setup>
import type { SelectOption } from 'naive-ui';
import type { PredictionSetInterface, PredictionSetsResponse } from '../../../../lib/types/prediction-set';
import Endpoints from '../../../../lib/values/endpoints';

const search = ref('');

const predictions = ref([] as PredictionSetInterface[]);
const loading = ref(true);
const options = computed(() => predictions.value.map(x => ({ label: x.question, value: x.id }))) as any;

watchDebounced(
  () => search.value,
  async search => {
    await searchPredictions(search);
  },
  { debounce: 1000 }
);

function renderOption(info: { node: VNode; option: SelectOption; selected: boolean }) {
  return h(resolveComponent('PredictionSetSearchItem'), {
    item: predictions.value?.find(x => x.id === info.option.value),
  });
}

async function searchPredictions(search: string): Promise<PredictionSetInterface[]> {
  loading.value = true;

  try {
    const res = await $api.get<PredictionSetsResponse>(Endpoints.predictionSets, { search });

    // predictions.value = [...predictions.value, ...res.data.items];
    predictions.value = res.data.items;

    loading.value = false;
    return predictions.value;
  } catch (error) {
    predictions.value = [];
    loading.value = false;
    return [];
  }
}
</script>
