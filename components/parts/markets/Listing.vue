<template>
  <div class="grid grid-cols-4 gap-4">
    <MarketsCard
      v-for="n in [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2,
        3, 4, 5, 6, 7, 8, 9, 10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
      ]"
    ></MarketsCard>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  category: { type: String, default: '' },
});
</script>
