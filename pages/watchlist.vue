<template>
  <Dashboard>
    <PredictionSetListing :category="'top'" watchlist />
  </Dashboard>
</template>

<script lang="ts" setup>
const { loggedIn } = useUserStore();
const router = useRouter();

onMounted(() => {
  if (!loggedIn) router.replace('/');
});
</script>
