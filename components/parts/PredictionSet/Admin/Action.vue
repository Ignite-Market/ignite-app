<template>
  <n-dropdown :options="options" :disabled="loading" @select="handleSelect">
    <BasicButton type="gradient" :loading="loading">
      <NuxtIcon name="icon/menu" />
    </BasicButton>
  </n-dropdown>
</template>

<script lang="ts" setup>
import Endpoints from '~/lib/values/endpoints';
import {
  PredictionSetStatus,
  ResolutionType,
  type PredictionSetInterface,
  type PredictionSetResponse,
} from '~/lib/types/prediction-set';
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
  {
    label: prediction.hide ? 'Unhide' : 'Hide',
    key: 'toggleHide',
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

async function toggleHide() {
  try {
    loading.value = true;
    const newHideState = !prediction.hide;
    await $api.patch(Endpoints.predictionSetsHide(prediction.id), { hide: newHideState });
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
    try {
      loading.value = true;
      // Fetch full prediction details
      const res = await $api.get<PredictionSetResponse>(Endpoints.predictionSetsById(prediction.id));
      const fullPrediction = res.data;

      // Only fetch dataSources if resolution type is AUTOMATIC
      if (fullPrediction.resolutionType === ResolutionType.AUTOMATIC) {
        try {
          const dataSourcesRes = await $api.get<GeneralResponse<any[]>>(
            Endpoints.predictionSetDataSources(prediction.id)
          );
          const dataSources = dataSourcesRes.data || [];

          // Transform dataSources from API format to form format
          const apiProxyPrefix =
            process.env.NODE_ENV === 'development'
              ? 'https://api-proxy-dev.ignitemarket.xyz/'
              : 'https://api-proxy.ignitemarket.xyz/';

          (fullPrediction as any).dataSources = dataSources.map((ds: any) => {
            const endpoint = ds.endpoint || '';
            const endpointPath = endpoint.replace(apiProxyPrefix, '');

            return {
              endpoint: endpointPath,
              httpMethod: ds.httpMethod || 'GET',
              queryParams: ds.queryParams
                ? typeof ds.queryParams === 'string'
                  ? ds.queryParams
                  : JSON.stringify(ds.queryParams)
                : '',
              headers: ds.headers ? (typeof ds.headers === 'string' ? ds.headers : JSON.stringify(ds.headers)) : '',
              body: ds.body ? (typeof ds.body === 'string' ? ds.body : JSON.stringify(ds.body)) : '',
              jqQuery: ds.jqQuery || '',
              abi: ds.abi ? (typeof ds.abi === 'string' ? ds.abi : JSON.stringify(ds.abi)) : '',
            };
          });
        } catch (error) {
          console.error('Failed to fetch data sources:', error);
          // Continue without dataSources if fetch fails
          (fullPrediction as any).dataSources = [];
        }
      }

      // Copy prediction data to store with full details
      predictionStore.setCopiedPrediction(fullPrediction);

      // Navigate to the add page
      router.push('/admin/add');
    } catch (error) {
      console.error('Failed to fetch prediction details:', error);
      window.$message?.error('Failed to load prediction details for copying');
    } finally {
      loading.value = false;
    }
  } else if (key === 'delete') {
    // Delete prediction
    await deletePrediction();
  } else if (key === 'toggleHide') {
    await toggleHide();
  }
}
</script>
