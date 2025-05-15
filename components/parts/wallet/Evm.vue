<script lang="ts" setup>
import { useConnect } from '@wagmi/vue';
import { ProcaptchaComponent } from "@prosopo/vue-procaptcha-wrapper";

defineProps({
  loading: { type: Boolean, default: false },
  step: { type: Number, default: 0 },
});

const showStrategies = ref(false);
const { connectAsync, connectors } = useConnect();
const { strategies } = useThirdweb();
const selectConnector = ref();
const loadingStrategy = ref<string>();
const loadingConnector = ref<string>();

const finalSteps = ref(false);

const emit = defineEmits(['loading', 'step']);

const siteKey = useRuntimeConfig().public.PROSOPO_CAPTCHA_SITEKEY as string;

const clickOnConnector = (connector, strategy) => {
  console.log('clickOnConnector', connector, strategy);
  if (!strategy && connector.id === 'in-app-wallet') {
    console.log('show strategy');
    showStrategies.value = true;
    selectConnector.value = connector;
  } else if (strategy && connector.id === 'in-app-wallet') {
    console.log('loading connector w/ strategy');
    emit('loading', true);
    // do loading animation
    loadingStrategy.value = strategy.id;
    connectAsync({ connector, strategy: strategy.id } as any).catch(() => {
      console.log('Connection canceled or failed');
      loadingStrategy.value = undefined;
      emit('loading', false);
    });
  } else {
    console.log('loading connector');
    if (connector.id !== 'in-app-wallet') {
      finalSteps.value = true;
    }
    emit('loading', true);
    // do loading animation for connector
    loadingConnector.value = connector.id;
    connectAsync({ connector }).catch(() => {
      console.log('Connection canceled or failed');
      loadingStrategy.value = undefined;
      loadingConnector.value = undefined;
      selectConnector.value = undefined;
      finalSteps.value = false;
      emit('loading', false);
    });
  }
};

const callbacks = (token: string) => {
  emit('step');
};
</script>

<template>
  <div>
    <div v-if="!finalSteps" class="flex flex-col">
      <!--      <div class="flex w-full items-center justify-center mb-2">-->
      <!--        <NuxtIcon name="wallet/injected" class="text-primary text-[40px]" />-->
      <!--      </div>-->
      <div class="flex h-8 items-center justify-center text-[14px] leading-[20px] font-bold relative">
        <div class="absolute left-0 top-0">
          <BasicButton
            v-if="showStrategies"
            size="small"
            type="gradient"
            inner-class="flex justify-center items-center bg-grey-lightest/20 hover:bg-grey-lightest/30 p-2"
            btn-class="!m-0 !p-0 overflow-hidden"
            @click="showStrategies = false"
          >
            <NuxtIcon :name="'icon/arrow-back'" color="white" />
          </BasicButton>
        </div>
        {{ !!showStrategies ? 'Log in with account' : 'Connect wallet' }}
      </div>
      <div class="flex items-center justify-center text-center text-[12px] leading-[20px] my-3">
        {{
          !!showStrategies ? 'Select account you want to use' : 'To log in, simply connect your wallet to Ignitemarket.'
        }}
      </div>

      <ProcaptchaComponent :siteKey="siteKey" :callback="callbacks" class="mt-4" />

      <div class="flex flex-col items-center justify-center mt-5">
        <n-space v-if="showStrategies" :size="8" vertical class="w-full">
          <BasicButton
            v-for="(strategy, key) in strategies"
            :key="key"
            class="flex-cc w-full"
            :class="{
              'relative card flex items-center py-1 pl-2 pr-4 pointer-events-none': !selectConnector,
            }"
            type="outline"
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
            type="outline"
            size="large"
            :disabled="loading || !!loadingConnector || step < 1"
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
      </div>
    </div>

    <div v-if="finalSteps">
      <div class="flex flex-col mt-4">
        <div class="flex w-full items-center justify-center mb-2">
          <NuxtIcon name="icon/book" class="text-primary text-[56px]" />
        </div>
        <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Connect wallet</div>
      </div>

      <div class="flex items-center py-4 border-b-1 border-b-grey-lighter mt-4 font-semibold px-1">
        1. Connect wallet

        <div class="ml-auto">
          <div v-if="step === 1" class="w-[17px] h-[17px] flex justify-center items-center ml-auto">
            <div class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></div>
          </div>
          <NuxtIcon v-else class="text-primary text-[17px]" name="icon/complete" />
        </div>
      </div>

      <div class="flex items-center pt-4 font-semibold px-1">
        2. Sign message

        <div class="ml-auto">
          <div v-if="step === 2" class="w-[17px] h-[17px] flex justify-center items-center ml-auto">
            <div class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
