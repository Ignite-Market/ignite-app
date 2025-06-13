<template>
  <Dashboard :loading="loading">
    <Profile />
  </Dashboard>
</template>

<script lang="ts" setup>
const loading = ref(false);
</script>
