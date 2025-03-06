<template>
  <Dashboard>
    <PredictionSetListing :category="'top'" watchlist></PredictionSetListing>
  </Dashboard>
</template>

<script lang="ts" setup>
const { loggedIn } = useUserStore();
const router = useRouter();

onMounted(() => {
  if (!loggedIn) router.replace('/');
});
</script>
