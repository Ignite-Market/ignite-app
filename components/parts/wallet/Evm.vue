<script lang="ts" setup>
import { useConnect } from '@wagmi/vue';

defineProps({
  loading: { type: Boolean, default: false },
});

const { connect, connectors } = useConnect();
console.log(connectors);
</script>

<template>
  <n-space :size="24" vertical>
    <Btn
      v-for="(connector, key) in connectors"
      :key="key"
      class="flex-cc"
      :class="{
        'relative card flex items-center py-3 pl-2 pr-4 pointer-events-none': !connector,
      }"
      type="secondary"
      size="large"
      @click="connect({ connector })"
    >
      <span class="flex flex-1 justify-start gap-2 items-center">
        <NuxtIcon :name="`wallet/${connector.type}`" filled />
        {{ connector.name }}
      </span>

      <!-- <Btn
        v-if="!isAuthorized"
        class="inline-block relative pointer-events-auto z-1"
        type="link"
        :href="`https://metamask.app.link/dapp/${config.public.url}${fullPath}`"
        target="_blank"
      >
        {{ $t('general.install') }}
      </Btn> -->
    </Btn>
  </n-space>
</template>
