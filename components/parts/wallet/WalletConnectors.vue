<script lang="ts" setup>
import { useConnect } from '@wagmi/vue';
// import { ProcaptchaComponent } from '@prosopo/vue-procaptcha-wrapper';

defineProps({
  loading: { type: Boolean, default: false },
  step: { type: Number, default: 1 },
});

const showStrategies = ref(false);
const { connectAsync, connectors } = useConnect();
const { strategies } = useThirdweb();
const selectConnector = ref<(typeof connectors)[number]>();
const loadingStrategy = ref<string>();
const loadingConnector = ref<string>();

const finalSteps = ref(false);

const emit = defineEmits<{
  (e: 'loading', value: boolean): void;
  (e: 'step', value: number): void;
}>();

// const siteKey = useRuntimeConfig().public.PROSOPO_CAPTCHA_SITEKEY as string;

function clickOnConnector(connector: (typeof connectors)[number], strategy?: { id: string; name: string }) {
  if (connector.id === 'in-app-wallet') {
    if (!strategy) {
      // Show In-App Wallet options (thirdweb)
      showStrategies.value = true;
      selectConnector.value = connector;
    } else {
      // Connect in-app wallet (thirdweb)
      emit('loading', true);
      loadingStrategy.value = strategy.id;

      connectAsync({ connector, strategy: strategy.id } as any).catch(e => {
        console.error('Connection canceled or failed', e);
        loadingStrategy.value = undefined;
        emit('loading', false);
      });
    }
  } else {
    // Connect with external wallet (metamask, coinbase, etc)
    finalSteps.value = true;

    emit('loading', true);

    loadingConnector.value = connector.id;

    connectAsync({ connector }).catch(e => {
      console.error('Connection canceled or failed', e);
      loadingStrategy.value = undefined;
      loadingConnector.value = undefined;
      selectConnector.value = undefined;
      finalSteps.value = false;
      emit('loading', false);
    });
  }
}

// Must be defined here, not in the template. Otherwise the captcha fails first time
// const callbacks = (token: string) => {
//   emit('step', token ? 1 : 0);
// };
</script>

<template>
  <div>
    <div v-if="!finalSteps" class="flex flex-col">
      <!-- Back button -->
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

      <!-- Instructions -->
      <div class="flex items-center justify-center text-center text-[12px] leading-[20px] my-3">
        {{
          !!showStrategies
            ? 'Select account you want to use'
            : 'To log in, simply connect your wallet to Ignite Market.'
        }}
      </div>

      <div class="flex flex-col items-center justify-center">
        <!-- Wallets (metamask, coinbase, etc) -->
        <n-space v-if="!showStrategies" :size="8" vertical class="w-full">
          <!-- <form @submit.prevent>
            <ProcaptchaComponent :site-key="siteKey" :callback="callbacks" theme="dark" />
          </form> -->

          <BasicButton
            v-for="(connector, key) in connectors"
            :key="key"
            class="flex-cc w-full"
            :class="{
              'relative card flex items-center py-1 pl-2 pr-4 pointer-events-none': !connector,
            }"
            btn-class="py-2"
            type="outline"
            size="large"
            :disabled="loading || !!loadingConnector || step < 1"
            @click="clickOnConnector(connector)"
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

        <!-- In-App options (thirdweb) -->
        <n-space v-else :size="8" vertical class="w-full mt-4">
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
            @click="clickOnConnector(connectors.find(c => c.id === 'in-app-wallet')!, strategy)"
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
      </div>
    </div>

    <!-- Wallet connection steps -->
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
