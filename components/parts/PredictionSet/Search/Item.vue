<template>
  <NuxtLink
    :to="{ name: 'markets-id', params: { id: item.id } }"
    class="flex flex-row flex-grow p-2 gap-2 md:gap-4 sm:px-4 group items-center max-h-[64px] hover:!bg-white/5 sm:mx-2"
  >
    <div class="w-[32px] h-[32px] md:w-[40px] md:h-[40px] flex-shrink-0">
      <img class="rounded-[8px] w-full h-full object-cover" src="https://app-dev.ignitemarket.xyz/favicon.png" />
    </div>
    <div class="flex relative items-center justify-between flex-grow text-[14px] sm:text-[16px]">
      <div class="text-white/80 font-bold text-ellipsis line-clamp-2">
        {{ item.question }}
      </div>
    </div>
  </NuxtLink>
</template>

<script lang="ts" setup>
import { type PredictionSetInterface } from '~/lib/types/prediction-set';

defineProps({
  item: { type: Object as PropType<PredictionSetInterface>, default: () => {}, required: true },
});
</script>

<style scoped></style>
