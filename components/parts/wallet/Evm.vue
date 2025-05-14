<script lang="ts" setup>
import { useConnect } from '@wagmi/vue';

defineProps({
  loading: { type: Boolean, default: false },
});

const { connect, connectors } = useConnect();
const { strategies } = useThirdweb();
const selectConnector = ref();
const loadingStrategy = ref<string>();
const loadingConnector = ref<string>();
const currentStep = ref(1); // 1 for connector selection, 2 for strategy selection

const emit = defineEmits(['loading']);

const clickOnConnector = (connector, strategy) => {
  console.log(connector, strategy);
  if (connector.id === 'in-app-wallet') {
    if (strategy) {
      emit('loading', true);
      // do loading animation
      loadingStrategy.value = strategy.id;
      connect({ connector, strategy: strategy.id });
    } else {
      loadingConnector.value = connector.id;
      selectConnector.value = connector;
      currentStep.value = 2; // Move to strategy selection step
    }
  } else if (connector.id === 'metaMaskSDK') {
    emit('loading', true);
    // do loading animation for connector
    currentStep.value = 2; // Move to strategy selection step
    selectConnector.value = connector;
    loadingConnector.value = connector.id;
    connect({ connector });
  } else {
    selectConnector.value = connector;
    loadingConnector.value = connector.id;
    connect({ connector });
  }
};
</script>

<template>
  <div class="w-full">
    <!-- Step indicators -->
    <div class="flex flex-col mb-4">
      <div class="flex flex-col items-center py-4 border-b-1 border-b-grey-lighter font-semibold px-1 w-full">
        <div class="flex flex-row justify-between w-full items-center">
          <div>1. Select wallet</div>
          <div v-if="currentStep === 1" class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></div>
          <NuxtIcon v-if="currentStep > 1" class="text-primary text-[17px]" name="icon/complete" />
        </div>
        <div v-if="currentStep === 1" class="mt-4 w-full">
          <div class="flex flex-col gap-2 w-full">
            <!-- Wallet connectors -->
            <BasicButton
              v-for="(connector, key) in connectors"
              :key="key"
              class="flex-cc w-full"
              :class="{
                'flex items-center py-1 pl-2 pr-4 pointer-events-none': !connector,
                'border-primary': loadingConnector && loadingConnector === connector.id,
              }"
              type="outline"
              size="large"
              :disabled="loading || !!loadingConnector || currentStep > 1"
              @click="clickOnConnector(connector, null)"
            >
              <span class="flex flex-1 justify-start gap-2 items-center font-bold text-base">
                <NuxtIcon :name="`wallet/${connector.type}`" filled />
                {{ connector.name }}
                <div v-if="connector.id === loadingConnector" class="flex items-center justify-center h-3 ml-2">
                  <Spinner :size="24" color="white" style="position: relative" />
                </div>
              </span>
            </BasicButton>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center py-4 font-semibold px-1 w-full">
        <div class="flex flex-row justify-between w-full items-center">
          <div v-if="loadingConnector && loadingConnector === 'in-app-wallet'">2. Select login method</div>
          <div v-else>2. Sign this message</div>
          <div v-if="currentStep === 2" class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></div>
          <div v-if="currentStep < 2" class="w-[7px] h-[7px] bg-grey-lightest rounded-full"></div>
          <NuxtIcon v-if="currentStep > 2" class="text-primary text-[17px]" name="icon/complete" />
        </div>
        <div v-if="currentStep === 2" class="w-full">
          <div class="flex flex-col gap-2 mt-4 w-full">
            <!-- Strategies (only shown for in-app wallet) -->
            <div v-if="loadingConnector && loadingConnector === 'in-app-wallet'" class="flex flex-col gap-3 w-full">
              <BasicButton
                v-for="(strategy, key) in strategies"
                :key="key"
                class="flex-cc w-full"
                :class="{
                  'relative card flex items-center py-1 pl-2 pr-4 pointer-events-none': !loadingConnector,
                }"
                type="outline"
                size="large"
                :disabled="!!loadingStrategy"
                @click="clickOnConnector(selectConnector, strategy)"
              >
                <div class="flex flex-row justify-start gap-2 items-center font-bold text-base">
                  <NuxtIcon :name="`strategies/${strategy.id}`" filled />
                  <div>{{ strategy.name }}</div>
                  <div v-if="strategy.id === loadingStrategy" class="flex items-center justify-center h-3 ml-2">
                    <Spinner :size="24" color="white" class="relative" />
                  </div>
                </div>
              </BasicButton>

              <!-- Back button -->
              <BasicButton
                class=""
                type="outline"
                size="small"
                :disabled="!!loadingStrategy"
                @click="
                  selectConnector = null;
                  loadingConnector = undefined;
                  currentStep = 1;
                "
              >
                <div class="flex justify-center items-center py-2.5">
                  <NuxtIcon name="icon/arrow-back" class="mr-1" />
                  <div>Back to wallet selection</div>
                </div>
              </BasicButton>
            </div>
            <div v-if="loadingConnector && loadingConnector === 'metaMaskSDK'" class="flex flex-col gap-3 w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
