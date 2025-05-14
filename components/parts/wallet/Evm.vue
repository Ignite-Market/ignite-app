<template>
  <n-space v-if="showStrategies" :size="22" vertical>
    <BasicButton
      v-for="(strategy, key) in strategies"
      :key="key"
      class="flex-cc w-full"
      :class="{
        'relative card flex items-center py-3 pl-2 pr-4 pointer-events-none': !selectConnector,
      }"
      type="secondary"
      size="large"
      @click="clickOnConnector(selectConnector, strategy)"
    >
      <span class="flex flex-1 justify-start gap-2 items-center">
        <NuxtIcon :name="`strategies/${strategy.id}`" filled />
        {{ strategy.name }}
      </span>
    </BasicButton>
  </n-space>

  <n-space v-else :size="22" vertical>
    <BasicButton
      v-for="(connector, key) in connectors"
      :key="key"
      class="flex-cc w-full"
      :class="{
        'relative card flex items-center py-3 pl-2 pr-4 pointer-events-none': !connector,
      }"
      type="secondary"
      size="large"
      @click="clickOnConnector(connector, null)"
    >
      <span class="flex flex-1 justify-start gap-2 items-center">
        <NuxtIcon :name="`wallet/${connector.type}`" filled />
        {{ connector.name }}
      </span>
    </BasicButton>
  </n-space>
</template>

<script lang="ts" setup>
import { useConnect } from '@wagmi/vue';

defineProps({
  loading: { type: Boolean, default: false },
});

const showStrategies = ref(false);
const { connect, connectors } = useConnect();
const { strategies } = useThirdweb();
const selectConnector = ref();

const clickOnConnector = (connector, strategy) => {
  if (!strategy && connector.id === 'in-app-wallet') {
    showStrategies.value = true;
    selectConnector.value = connector;
  } else if (strategy && connector.id === 'in-app-wallet') {
    connect({ connector, strategy: strategy.id } as any);
  } else {
    connect({ connector });
  }
};
</script>
