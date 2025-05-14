<script lang="ts" setup>
import { useConnect } from '@wagmi/vue';

defineProps({
  loading: { type: Boolean, default: false },
});

const showStrategies = ref(false);
const { connect, connectors } = useConnect();
const { strategies } = useThirdweb();
const selectConnector = ref();
const loadingStrategy = ref<string>();
const loadingConnector = ref<string>();

const emit = defineEmits(['loading']);

const clickOnConnector = (connector, strategy) => {
  if (!strategy && connector.id === 'in-app-wallet') {
    showStrategies.value = true;
    selectConnector.value = connector;
  } else if (strategy && connector.id === 'in-app-wallet') {
    emit('loading', true);
    // do loading animation
    loadingStrategy.value = strategy.id;
    connect({ connector, strategy: strategy.id } as any);
  } else {
    emit('loading', true);
    // do loading animation for connector
    loadingConnector.value = connector.id;
    connect({ connector });
  }
};
</script>

<template>
  <n-space v-if="showStrategies" :size="8" vertical class="w-full">
    <BasicButton
      v-for="(strategy, key) in strategies"
      :key="key"
      class="flex-cc w-full"
      :class="{
        'relative card flex items-center py-1 pl-2 pr-4 pointer-events-none': !selectConnector,
      }"
      type="secondary"
      size="large"
      :disabled="!!loadingStrategy"
      @click="clickOnConnector(selectConnector, strategy)"
    >
      <div class="flex flex-row justify-start gap-2 items-center">
        <NuxtIcon :name="`strategies/${strategy.id}`" filled />
        <div>{{ strategy.name }}</div>
        <div v-if="strategy.id === loadingStrategy" class="flex items-center justify-center h-3 ml-2">
          <Spinner :size="24" color="white" style="position: relative" />
        </div>
      </div>
    </BasicButton>
  </n-space>

  <n-space v-else :size="8" vertical class="w-full">
    <BasicButton
      v-for="(connector, key) in connectors"
      :key="key"
      class="flex-cc w-full"
      :class="{
        'relative card flex items-center py-1 pl-2 pr-4 pointer-events-none': !connector,
      }"
      type="secondary"
      size="large"
      :disabled="loading || !!loadingConnector"
      @click="clickOnConnector(connector, null)"
    >
      <span class="flex flex-1 justify-start gap-2 items-center">
        <NuxtIcon :name="`wallet/${connector.type}`" filled />
        {{ connector.name }}
        <div v-if="connector.id === loadingConnector" class="flex items-center justify-center h-3 ml-2">
          <Spinner :size="24" color="white" style="position: relative" />
        </div>
      </span>
    </BasicButton>
  </n-space>
</template>
