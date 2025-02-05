<template>
  <div class="flex items-center justify-center">
    <div :class="getStatusClass(status, endTime)" class="font-bold rounded-[20px] py-[2px] px-[6px]">
      {{ getStatusName(status, endTime) }}
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  status: { type: Number, default: null, required: true },
  endTime: { type: String, default: null, required: true },
});
</script>
