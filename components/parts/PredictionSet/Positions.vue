<template>
  <div class="border-1 border-grey-lighter rounded-lg mt-10 flex-col p-6 text-wrap break-words">
    <div class="font-bold text-[14px] leading-[20px] mb-4 text-white">Positions</div>
    <div class="font-medium text-[14px] leading-[20px] mb-4 text-white/80">{{ positions }}</div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  positions: { type: Array<any>, default: [], required: true },
});
</script>
