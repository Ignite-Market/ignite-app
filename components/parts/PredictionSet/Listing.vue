<template>
  <div
    ref="grid"
    class="grid xl:grid-cols-4 lg:grid-cols-[repeat(auto-fill,minmax(270px,1fr))] grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4 justify-items-center"
  >
    <PredictionSetCard :predictionSet="predictionSet" v-for="predictionSet in predictionSets"></PredictionSetCard>
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
import { useInfiniteScroll } from '@vueuse/core';
import Endpoints from '~/lib/values/endpoints';

const props = defineProps({
  category: { type: String, default: '' },
  watchlist: { type: Boolean, default: false },
});

const message = useMessage();

const grid = ref();
const predictionSets = ref(<any[]>[]);
const loading = ref(false);
const page = ref(1);
const limit = ref(20);
const total = ref(0);

onMounted(async () => {
  await getPredictionSets();
});

const {} = useInfiniteScroll(
  grid,
  async () => {
    if (!loading.value) {
      await getPredictionSets();
    }
  },
  {
    distance: 10,
    canLoadMore: () => {
      return !!total.value && total.value > predictionSets.value.length;
    },
  }
);

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
    await sleep(5000);
    if (res.data) {
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
</script>
