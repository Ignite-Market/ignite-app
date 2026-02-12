<script lang="ts" setup>
import VLazyImage from 'v-lazy-image';

const props = defineProps({
  eager: { type: Boolean, default: false },
});
</script>

<template>
  <img v-if="props.eager" v-bind="$attrs" :src="$attrs.src as string" />
  <VLazyImage
    v-else
    v-bind="$attrs"
    :src-placeholder="
      $attrs['src-placeholder'] || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='
    "
  />
</template>

<style scoped>
.v-lazy-image {
  filter: blur(4px);
  transition: filter 0.6s;
  will-change: filter;
}

.v-lazy-image-loaded {
  filter: blur(0);
}
</style>
