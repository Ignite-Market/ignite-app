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

const { prediction } = defineProps<{ prediction: PredictionSetInterface }>();

const emit = defineEmits(['refresh']);

const router = useRouter();

const loading = ref(false);

const options = [
  ...(prediction.setStatus === PredictionSetStatus.INITIALIZED || prediction.setStatus === PredictionSetStatus.ERROR
    ? [
        {
          label: 'Process',
          key: 'process',
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

function handleSelect(key: string | number) {
  if (key === 'open') {
    router.push({ path: `/markets/${prediction.id}` });
  } else if (key === 'process') {
    triggerProcess();
  }
}
</script>
