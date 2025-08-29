<template>
  <n-dropdown :options="options" :disabled="loading" @select="handleSelect">
    <BasicButton type="gradient" :loading="loading">
      <NuxtIcon name="icon/menu" />
    </BasicButton>
  </n-dropdown>
</template>

<script lang="ts" setup>
import Endpoints from '~/lib/values/endpoints';
import { PredictionSetStatus, type PredictionSetInterface } from '~/lib/types/prediction-set';
import { usePredictionStore } from '~/stores/prediction';

const { prediction } = defineProps<{ prediction: PredictionSetInterface }>();

const emit = defineEmits(['refresh']);

const router = useRouter();
const predictionStore = usePredictionStore();

const loading = ref(false);

const options = [
  {
    label: 'Copy',
    key: 'copy',
  },
  ...(prediction.setStatus === PredictionSetStatus.INITIALIZED || prediction.setStatus === PredictionSetStatus.ERROR
    ? [
        {
          label: 'Process',
          key: 'process',
        },
        {
          label: 'Delete',
          key: 'delete',
        },
      ]
    : [
        {
          label: 'Open',
          key: 'open',
        },
      ]),
];

async function triggerProcess() {
  try {
    loading.value = true;
    await $api.patch(Endpoints.predictionSetsProcess(prediction.id));
    emit('refresh');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function deletePrediction() {
  try {
    loading.value = true;
    await $api.delete(Endpoints.predictionSetsById(prediction.id));
    emit('refresh');
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

async function handleSelect(key: string | number) {
  if (key === 'open') {
    router.push({ path: `/markets/${prediction.id}` });
  } else if (key === 'process') {
    await triggerProcess();
  } else if (key === 'copy') {
    // Copy prediction data to store
    predictionStore.setCopiedPrediction(prediction);

    // Navigate to the add page
    router.push('/admin/add');
  } else if (key === 'delete') {
    // Delete prediction
    await deletePrediction();
  }
}
</script>
