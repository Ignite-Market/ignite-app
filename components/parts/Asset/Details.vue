<template>
  <div v-if="asset?.id" class="flex gap-2">
    <img class="rounded-md object-cover h-20 w-20" :src="metadata?.image" :alt="metadata?.name" />

    <p>
      <strong>#{{ asset.tokenId }}&nbsp;</strong>
      <span>{{ metadata?.name }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { parseAssetMetadata } from '~/lib/misc/parsers';
import type { AssetInterface } from '~/lib/types/asset';

const props = defineProps({
  asset: { type: Object as PropType<AssetInterface>, default: {} },
});

const metadata = ref(parseAssetMetadata(props.asset.metadata));
</script>
