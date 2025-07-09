<script setup lang="ts">
import { useAccount, useBalance } from '@wagmi/vue';
import { colors } from '../../../tailwind.config';
import { startThirdwebPayment } from '~/lib/thirdwebpay/dist/thirdwebpay';
import { useSwap } from '~/composables/useSwap';

const props = defineProps<{
  collateralToken: CollateralToken;
}>();

enum Steps {
  LANDING = 0,
  THIRDWEB = 1,
  SWAP = 2,
}

const config = useRuntimeConfig();
const { connector, address } = useAccount();
const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({ address: address.value });
const { getQuote } = useSwap();
const isOpen = ref(false);
const step = ref(Steps.LANDING);
const collateralNeeded = ref(0);
const nativeNeeded = ref(0); // FLR required for the swap to USDT
const loading = ref(true);
const gasBuffer = 0.02; // Estimated FLR reserved for gas – tweak as needed
const totalNativeNeeded = computed(() => gasBuffer + nativeNeeded.value);
const nativeMissing = computed(() =>
  Math.max(0, Math.ceil((totalNativeNeeded.value - bigIntToNum(nativeBalance?.value?.value || 0n, 18)) * 10000) / 10000)
);
const collateralMissing = computed(
  () =>
    collateralNeeded.value -
    bigIntToNum(
      // props.collateralToken.balance
      0n,
      props.collateralToken.decimals
    )
);

watch(collateralMissing, async () => {
  loading.value = true;
  console.log('collateralMissing', collateralMissing.value);

  if (collateralMissing.value > 0) {
    // const result = await getQuote(collateralMissing.value);
    const result = (await getQuote(collateralMissing.value)).result;
    nativeNeeded.value = bigIntToNum(result[0], 18) * 1.03;
  }
  console.log('collateralMissing', collateralMissing.value);
  console.log('nativeNeeded', nativeNeeded.value);
  console.log('totalNativeNeeded', totalNativeNeeded.value);
  console.log('nativeMissing', nativeMissing.value);
  loading.value = false;
});

onMounted(async () => {
  await refetchNativeBalance();
});

function openThirdweb() {
  console.log('nativeMissingPassed', nativeMissing.value);
  setTimeout(() => {
    /**
     * Method from thirdwebpay package (nested react app)
     */
    startThirdwebPayment('#thirdwebpay', {
      clientId: config.public.THIRDWEB_CLIENT_KEY,
      paymentReceiverAddress: address.value,
      amount: numToBigInt(nativeMissing.value),
      // purchaseData: { purchaseId: 1 },
      connectorId: connector.value?.id,
      onSuccess: (_info: any) => {
        /**
         * Handle success in <PredictionSetAction />
         */
        // emit('success', collateralNeeded.value || 0);
        step.value = Steps.LANDING;
      },
    });
  }, 50);
  setTimeout(() => {
    step.value = Steps.THIRDWEB;
  }, 100);
}

function openSwap() {
  step.value = Steps.SWAP;
}

function handleSwapSuccess() {
  // Reset step to LANDING
  step.value = Steps.LANDING;
}

// Expose methods and state for parent component
defineExpose({
  isOpen,
  openModal: (amount: number) => {
    collateralNeeded.value = amount;
    isOpen.value = true;
    step.value = Steps.LANDING;
  },
  closeModal: () => {
    isOpen.value = false;
    step.value = Steps.LANDING;
  },
});
</script>

<template>
  <Modal
    v-model:show="isOpen"
    display-directive="show"
    class="!max-w-[402px] !bg-[#131418] [&>.n-card-header>button]:z-1"
    @update:show="isOpen = $event"
  >
    <div v-show="step === Steps.LANDING">
      <h2 class="text-lg font-bold mb-4 text-center">Insufficient funds</h2>
      <div v-if="loading" class="flex justify-center items-center h-full">
        <Spinner :size="24" color="#000" />
      </div>
      <div v-else class="space-y-3">
        <!-- Native token row -->
        <div
          class="flex items-center p-3 rounded-[8px]"
          :class="nativeMissing > 0 ? 'bg-statusRed/10' : 'bg-statusGreen/10'"
        >
          <NuxtIcon class="text-[24px]" name="icon/flare" filled />
          <div class="ml-3 flex-1">
            <div class="text-sm font-medium">FLR (gas + swap)</div>
            <div class="text-xs text-grey-lightest">
              Balance {{ bigIntToNum(nativeBalance?.value || 0n, 18).toFixed(4) }} / Needed ≈
              {{ totalNativeNeeded.toFixed(4) }}
              <span class="block text-[10px] leading-4">
                swap = {{ nativeNeeded.toFixed(4) }}, gas ≈ {{ gasBuffer.toFixed(2) }}
              </span>
            </div>
          </div>

          <BasicButton v-if="nativeMissing > 0" size="small" class="!px-3" @click="openThirdweb"> Buy FLR </BasicButton>
          <NuxtIcon v-else name="icon/check" class="text-statusGreen" />
        </div>

        <!-- USDT row -->
        <div
          class="flex items-center p-3 rounded-[8px]"
          :class="collateralMissing > 0 ? 'bg-statusRed/10' : 'bg-statusGreen/10'"
        >
          <Image
            :src="collateralToken.imgUrl"
            :title="collateralToken.name"
            class="rounded-full w-6 h-6 object-cover mr-1"
          />
          <div class="ml-3 flex-1">
            <div class="text-sm font-medium">Collateral ({{ collateralToken.name }})</div>
            <div class="text-xs text-grey-lightest">
              Balance {{ bigIntToNum(collateralToken?.balance || 0n, collateralToken.decimals).toFixed(2) }} / Needed
              {{ collateralNeeded.toFixed(2) }}
            </div>
          </div>

          <n-tooltip
            :disabled="nativeMissing <= 0"
            trigger="hover"
            placement="top"
            :theme-overrides="{
              borderRadius: '8px',
              color: colors.grey.light,
            }"
            :style="{
              maxWidth: '60vw',
            }"
          >
            <template #trigger>
              <div>
                <BasicButton
                  v-if="collateralMissing > 0"
                  size="small"
                  class="!px-3"
                  :disabled="nativeMissing > 0"
                  @click="openSwap"
                >
                  Swap
                </BasicButton>
              </div>
            </template>
            You need more FLR to swap to {{ collateralToken.name }}
          </n-tooltip>
          <NuxtIcon v-if="collateralMissing <= 0" name="icon/check" class="text-statusGreen" />
        </div>
      </div>
      <BasicButton class="w-full mt-6" type="primary" :disabled="collateralMissing > 0 || nativeMissing > 0">
        Done
      </BasicButton>
    </div>
    <!-- Thirdweb iframe slot -->
    <div v-show="step === Steps.THIRDWEB">
      <div id="thirdwebpay" class="[&>div]:mx-auto [&>div]:!border-none" :style="{ margin: '-20px -24px -20px' }"></div>
    </div>
    <PredictionSetSwap
      v-if="step === Steps.SWAP"
      :amount="collateralMissing"
      @back="step = Steps.LANDING"
      @success="handleSwapSuccess"
    />
    <template #header>
      <BasicButton v-show="step === Steps.THIRDWEB" class="" type="primary" @click="step = Steps.LANDING">
        Back
      </BasicButton>
    </template>
  </Modal>
</template>
