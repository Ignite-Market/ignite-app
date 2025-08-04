<template>
  <CollateralSelect
    :default-value="collateralToken || undefined"
    placeholder="Currency"
    clearable
    @update:value="value => (collateralToken = value || null)"
  />
</template>

<script lang="ts" setup>
import { useTokensStore } from '~/stores/collateral-tokens';

const predictionStore = usePredictionStore();
const tokensStore = useTokensStore();

const collateralToken = ref<number | null>(null);

onMounted(async () => {
  await tokensStore.ensureLoaded();

  predictionStore.filters.collateralTokenId.value = null;
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
