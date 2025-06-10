<template>
  <n-select
    v-model:value="collateralToken"
    :theme-overrides="{
      peers: {
        InternalSelection: {
          color: '#292929',
          clearColor: '#C56AC6',
        },
      },
    }"
    placeholder="Currency"
    :options="options"
    clearable
  >
    <template #arrow>
      <NuxtIcon name="icon/arrow-down" class="icon-auto !inline-flex flex-cc" />
    </template>
  </n-select>
</template>

<script lang="ts" setup>
import { useTokensStore } from '~/stores/collateral-tokens';

const predictionStore = usePredictionStore();
const tokensStore = useTokensStore();

const collateralToken = ref(null);
const options = ref<{ label: string; value: number }[]>([]);

onMounted(async () => {
  await tokensStore.ensureLoaded();

  predictionStore.filters.collateralTokenId.value = null;
  options.value = Object.values(tokensStore.items).map(token => ({
    label: token.symbol,
    value: token.id,
  }));
});

onUnmounted(() => {
  predictionStore.filters.collateralTokenId.value = null;
});

watch(
  () => collateralToken.value,
  async value => {
    predictionStore.filters.collateralTokenId.value = value;
    await predictionStore.fetch();
  }
);
</script>
