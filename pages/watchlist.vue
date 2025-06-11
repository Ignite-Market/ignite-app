<template>
  <Dashboard>
    <PredictionSetListing :category="'watchlist'" watchlist />
  </Dashboard>
</template>

<script lang="ts" setup>
useLoggedIn(onInit);
const router = useRouter();

function onInit(loggedIn: boolean) {
  if (!loggedIn) {
    router.replace('/');
  }
}
</script>
