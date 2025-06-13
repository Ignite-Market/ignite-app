<template>
  <Dashboard :loading="loading">
    <Profile :id="+params.id" />
  </Dashboard>
</template>

<script lang="ts" setup>
const loading = ref(false);
const { params } = useRoute();
</script>
