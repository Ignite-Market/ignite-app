<template>
  <Dashboard :loading="loading">
    <PredictionSetAction></PredictionSetAction>
  </Dashboard>
</template>

<script lang="ts" setup>
const { params } = useRoute();
const router = useRouter();

const loading = ref<boolean>(true);

onMounted(async () => {
  await sleep(10);

  try {
  } catch (error) {
    router.push({ name: 'index' });
  } finally {
    loading.value = false;
  }
});
</script>
