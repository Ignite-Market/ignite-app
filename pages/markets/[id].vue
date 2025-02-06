<template>
  <Dashboard :loading="loading">
    <div v-if="predictionSet">
      <PredictionSetAction
        :contract-address="predictionSet.chainData.contractAddress"
        :outcome="selectedOutcome"
      ></PredictionSetAction>
    </div>
  </Dashboard>
</template>

<script lang="ts" setup>
import type { PredictionSetInterface, PredictionSetResponse } from '~/lib/types/prediction-set';
import Endpoints from '~/lib/values/endpoints';

const { params } = useRoute();
const router = useRouter();

const loading = ref<boolean>(true);

const predictionSet = ref<PredictionSetInterface | null>();
const selectedOutcome = ref();

onMounted(async () => {
  loading.value = true;

  await sleep(10);

  try {
    const res = await $api.get<PredictionSetResponse>(Endpoints.predictionSetsById(Number(params?.id)));

    predictionSet.value = res.data;

    // TODO: look at url if another outcome is selected.
    selectedOutcome.value = predictionSet.value.outcomes[0];
  } catch (error) {
    router.push({ name: 'index' });
  } finally {
    loading.value = false;
  }
});
</script>
