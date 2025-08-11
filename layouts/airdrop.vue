<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script lang="ts" setup>
/** Global messages */
const message = useMessage();
window.$message = message;
</script>
