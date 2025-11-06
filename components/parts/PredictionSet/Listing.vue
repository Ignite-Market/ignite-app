<template>
  <div
    class="grid xl:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(270px,1fr))] grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 justify-items-center mb-4"
  >
    <template
      v-if="!predictionStore.loading || (predictionStore.pagination.page && predictionStore.pagination.page > 1)"
    >
      <PredictionSetCard
        v-for="predictionSet in predictionStore.data"
        :key="predictionSet.id"
        :prediction-set="predictionSet"
      />
    </template>
    <template v-if="predictionStore.loading">
      <n-skeleton
        v-for="i in 12"
        :key="i"
        height="100%"
        width="100%"
        class="rounded-[8px] max-w-[360px] max-h-[220px] min-h-[200px]"
      />
    </template>
  </div>
  <div v-if="!predictionStore.loading && !predictionStore.data?.length" class="text-center mt-8">Coming soon...</div>
</template>

<script lang="ts" setup>
import { PAGINATION_LIMIT } from '../../../lib/values/general.values';

const props = defineProps({
  category: { type: String, default: null },
  watchlist: { type: Boolean, default: false },
});

const message = useMessage();

const predictionStore = usePredictionStore();
const page = ref(1);
const limit = ref(PAGINATION_LIMIT);
const total = ref(0);

onMounted(async () => {
  predictionStore.category = props.category;
  await getPredictionSets();
});

function canLoadMore() {
  return !!total.value && total.value > predictionStore.data.length;
}

async function onInfiniteLoad() {
  if (canLoadMore() && !predictionStore.loading) {
    await getPredictionSets(true);
  }
}

async function getPredictionSets(force = false) {
  try {
    predictionStore.pagination.page = page.value;
    predictionStore.pagination.pageSize = limit.value;

    await predictionStore.fetch(
      {
        category: props.category || undefined,
        orderBy: 'id',
        limit: limit.value,
        desc: 'true',
        page: page.value,
        watchlist: props.watchlist,
      },
      force
    );

    page.value += 1;
    total.value = predictionStore.pagination.itemCount || 0;
  } catch (error) {
    message.error(apiError(error));
  }
}

defineExpose({ onInfiniteLoad });
</script>
