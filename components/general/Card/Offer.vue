<template>
  <Card
    :title="`${offer.name} #${offer.id}`"
    :content="offer.description"
    :image="offer.image"
    class="inline-block"
    :class="{ 'border-5 border-blue': verified }"
  >
    <div class="flex flex-col gap-2 lg:min-w-96">
      <div v-for="property in offer.properties">
        <label>{{ property.label }}</label>
        <p class="text-blue text-xs">{{ property.value }}</p>
      </div>

      <div class="mt-4 flex justify-end">
        <Btn>Get offers</Btn>
      </div>
    </div>

    <div class="absolute top-0 left-2 flex gap-2 -translate-y-1/2">
      <IconBadge v-if="activeLoad" class="relative bg-green-darker" :border="true">
        <NuxtIcon name="icon/list-bullet" class="icon-auto text-black" filled />
      </IconBadge>
      <IconBadge v-else-if="listed" class="relative bg-grey-light" :border="true">
        <NuxtIcon name="icon/list-bullet" class="icon-auto text-black" filled />
      </IconBadge>
      <IconBadge v-if="offers" class="relative bg-yellow-dark" :border="true">
        <NuxtIcon name="icon/dollar" class="icon-auto text-black" filled />
      </IconBadge>
    </div>

    <IconBadge v-if="verified" class="top-0 right-2 bg-blue -translate-y-1/2">
      <NuxtIcon name="icon/check" class="icon-auto" filled />
    </IconBadge>

    <div class="absolute bottom-0 left-2 flex gap-2 translate-y-1/2">
      <IconBadge
        class="relative"
        :class="[
          { 'bg-chain-ethereum': offer.chainId === base.id || offer.chainId === baseSepolia.id },
          { 'bg-chain-moonbeam': offer.chainId === moonbeam.id || offer.chainId === moonbaseAlpha.id },
          { 'bg-chain-bnb': offer.chainId === bsc.id || offer.chainId === bscTestnet.id },
        ]"
        :border="true"
      >
        <NuxtIcon :name="`logo/chain/${offer.chainId}`.trim()" class="text-[34px] text-black" filled />
      </IconBadge>
      <IconTag v-if="activeLoad" class="relative bg-blue" :border="true"><span>DA</span></IconTag>
      <IconTag v-if="listed" class="relative bg-purple" :border="true"><span>RWA</span></IconTag>
    </div>
  </Card>
</template>

<script lang="ts" setup>
import type { ImageProps } from 'naive-ui';
import { base, baseSepolia, moonbaseAlpha, moonbeam, bsc, bscTestnet } from 'viem/chains';

export type Property = {
  label: string;
  value: string;
};
export type CardOffer = {
  id: number;
  chainId: number;
  name: string;
  description: string;
  image: ImageProps;
  properties: Property[];
};

defineProps({
  offer: { type: Object as PropType<CardOffer>, default: {} },
  activeLoad: { type: Boolean, default: false },
  listed: { type: Boolean, default: false },
  offers: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
});
</script>
