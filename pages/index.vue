<template>
  <Dashboard>
    <MarketsListing :category="'top'"></MarketsListing>
  </Dashboard>
</template>

<script lang="ts" setup>
const userStore = useUserStore();

onMounted(() => {});

async function getMarkets() {}
</script>
