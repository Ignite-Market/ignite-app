<template>
  <div
    class="grid xl:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(270px,1fr))] grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 justify-items-center mb-4"
  >
    <PredictionSetCard
      v-for="predictionSet in predictionSets"
      :key="predictionSet.id"
      :prediction-set="predictionSet"
    />
  </div>
  <div
    v-if="loading"
    class="grid xl:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(270px,1fr))] grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 justify-items-center"
  >
    <n-skeleton
      v-for="i in 12"
      :key="i"
      height="158px"
      width="100%"
      class="rounded-[8px] max-w-[360px] max-h-[220px]"
    />
  </div>
</template>

<script lang="ts" setup>
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  category: { type: String, default: '' },
  watchlist: { type: Boolean, default: false },
});

const message = useMessage();

const predictionSets = ref<any[]>([]);
const loading = ref(false);
const page = ref(1);
const limit = ref(20);
const total = ref(0);

onMounted(async () => {
  await getPredictionSets();
});

function canLoadMore() {
  console.log(!!total.value && total.value > predictionSets.value.length);
  return !!total.value && total.value > predictionSets.value.length;
}

async function onInfiniteLoad() {
  if (canLoadMore() && !loading.value) {
    await getPredictionSets();
  }
}

async function getPredictionSets() {
  loading.value = true;
  try {
    const res = await $api.get<any>(Endpoints.predictionSets, {
      category: props.category,
      orderBy: 'id',
      limit: limit.value,
      desc: 'true',
      page: page.value,
      watchlist: props.watchlist,
    });
    if (res.data) {
      // const ar = new Array(20).fill(res.data.items[0]);
      // predictionSets.value.push(...ar);
      predictionSets.value.push(...(res.data.items as any[]));
    }

    page.value += 1;
    total.value = res?.data?.total || 0;
  } catch (error) {
    message.error(apiError(error));
  } finally {
    loading.value = false;
  }
}

defineExpose({ onInfiniteLoad });
</script>
