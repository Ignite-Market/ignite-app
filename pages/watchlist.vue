<template>
  <Dashboard>
    <PredictionSetListing :category="'watchlist'" watchlist />
  </Dashboard>
</template>

<script lang="ts" setup>
const { loggedIn } = useLoggedIn();
const router = useRouter();

onMounted(() => {
  if (!loggedIn.value) router.replace('/');
});
</script>
