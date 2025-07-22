<script setup lang="ts">
import { useAccount, useBalance } from '@wagmi/vue';
import { colors } from '../../../tailwind.config';
import { startThirdwebPayment } from '~/lib/thirdwebpay/dist/thirdwebpay';
import { useSwap } from '~/composables/useSwap';

const props = defineProps<{
  collateralToken?: CollateralToken;
}>();

enum Steps {
  LANDING = 0,
  THIRDWEB = 1,
  SWAP = 2,
  ENTER_AMOUNT = 3,
}

const config = useRuntimeConfig();
const { connector, address } = useAccount();
const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({
  address: computed(() => address.value),
});
const { refreshCollateralBalance } = useCollateralToken();
const tokenStore = useTokensStore();
const { getQuote } = useSwap();

const isOpen = ref(false);
const step = ref(Steps.LANDING);
const amount = ref(0);
const selectedCollateralToken = ref<CollateralToken | undefined>(props?.collateralToken);
const collateralNeeded = ref(0);
const nativeNeeded = ref(0); // FLR required for the swap to USDT
const loading = ref(true);
const gasBuffer = 1; // Estimated FLR reserved for gas – tweak as needed
const closeDisabled = ref(false);

const totalNativeNeeded = computed(() => gasBuffer + nativeNeeded.value);
const nativeMissing = computed(() =>
  Math.max(0, Math.ceil((totalNativeNeeded.value - bigIntToNum(nativeBalance?.value?.value || 0n, 18)) * 10000) / 10000)
);

const isCustom = computed(() => amount.value > 0);
const quoteError = ref(false);

const collateralMissing = computed(
  () =>
    collateralNeeded.value -
    (isCustom.value
      ? 0
      : selectedCollateralToken.value
        ? bigIntToNum(selectedCollateralToken.value.balance, selectedCollateralToken.value.decimals)
        : 0)
);

const tokenOptions = computed(() => {
  return Object.values(tokenStore.items).map(token => ({
    label: token.name,
    value: token.id,
  }));
});

const renderTokenLabel = (option: any) => {
  const token = tokenStore.items[option.value];
  return [
    h(
      'div',
      {
        class: 'flex items-center',
      },
      [
        h(resolveComponent('Image'), {
          src: token.imgUrl,
          class: 'rounded-full w-6 h-6 object-cover mr-1',
        }),
        h('div', token.name),
      ]
    ),
  ];
};

watch(collateralMissing, async () => {
  loading.value = true;
  if (collateralMissing.value > 0) {
    const result = (
      await getQuote(
        collateralMissing.value,
        selectedCollateralToken.value?.address,
        selectedCollateralToken.value?.decimals
      )
    )?.result;
    if (!result) {
      quoteError.value = true;
      loading.value = false;
      return;
    }
    nativeNeeded.value = bigIntToNum(result[0], 18) * 1.03;
  }
  loading.value = false;
});

onMounted(async () => {
  if (props.collateralToken) {
    selectedCollateralToken.value = props.collateralToken;
  } else {
    if (!tokenStore.loaded) {
      await tokenStore.fetch();
    }
    const tokens = Object.values(tokenStore.items);
    if (tokens.length === 1) {
      selectedCollateralToken.value = tokens[0];
    }
  }
});

watch(address, async () => {
  await refetchNativeBalance();
});

function openThirdweb() {
  setTimeout(() => {
    /**
     * Method from thirdwebpay package (nested react app)
     */
    startThirdwebPayment('#thirdwebpay', {
      clientId: config.public.THIRDWEB_CLIENT_KEY,
      paymentReceiverAddress: address.value,
      amount: nativeMissing.value,
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
  refetchNativeBalance();
  refreshCollateralBalance(selectedCollateralToken.value?.id || 1);
}

const closeModal = () => {
  isOpen.value = false;
  step.value = Steps.LANDING;
};

const enterAmount = () => {
  collateralNeeded.value = amount.value;
  step.value = Steps.LANDING;
};

const onBack = () => {
  if (isCustom.value && step.value === Steps.LANDING) {
    step.value = Steps.ENTER_AMOUNT;
  } else {
    step.value = Steps.LANDING;
  }
};

// Expose methods and state for parent component
defineExpose({
  isOpen,
  openModal: (amount?: number) => {
    collateralNeeded.value = amount || 0;
    isOpen.value = true;
    if (amount) {
      step.value = Steps.LANDING;
    } else {
      step.value = Steps.ENTER_AMOUNT;
    }
  },
  closeModal,
});
</script>

<template>
  <Modal
    v-model:show="isOpen"
    display-directive="show"
    :mask-closable="!closeDisabled"
    class="!max-w-[402px] !bg-grey-dark [&>.n-card-header>button]:z-1 border-none"
    @update:show="isOpen = $event"
  >
    <div v-if="step === Steps.ENTER_AMOUNT">
      <h2 class="text-xl font-bold text-center mb-2">Fund your wallet</h2>

      <p class="text-sm text-grey-lightest text-center mb-4">
        Select the token you want to buy with your card or crypto assets.
      </p>
      <SelectOptions
        class="w-full mb-4"
        :options="tokenOptions"
        :default-value="selectedCollateralToken?.id"
        :render-label="renderTokenLabel"
        @update:value="value => (selectedCollateralToken = tokenStore.items[value])"
      />
      <div v-if="selectedCollateralToken">
        <p class="text-sm text-grey-lightest text-center mb-4">Enter the amount you want to buy.</p>
        <n-input-number
          v-model:value="amount"
          placeholder="0"
          min="0"
          size="large"
          class="min-w-full text-center"
          type="number"
          :show-button="true"
          button-placement="both"
        >
          <template #suffix>
            <div class="absolute right-10 top-1/2 -translate-y-1/2 text-grey-lightest text-sm">
              {{ selectedCollateralToken?.symbol }}
            </div>
          </template>
          <template #minus-icon>
            <div
              class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
            >
              <NuxtIcon class="hover:text-white text-white" name="icon/minus" />
            </div>
          </template>

          <template #add-icon>
            <div
              class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
            >
              <NuxtIcon class="hover:text-white text-white" name="icon/plus" />
            </div>
          </template>
        </n-input-number>

        <BasicButton
          class="w-full mt-3"
          :btn-class="['!font-bold']"
          :size="'large'"
          :disabled="amount <= 0"
          @click="enterAmount()"
        >
          Buy
        </BasicButton>
      </div>
    </div>

    <div v-if="step === Steps.LANDING">
      <h2 class="text-lg font-bold mb-4 text-center">{{ isCustom ? 'Add funds' : 'Insufficient funds' }}</h2>
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
          v-if="selectedCollateralToken"
          class="flex items-center p-3 rounded-[8px]"
          :class="collateralMissing > 0 ? 'bg-statusRed/10' : 'bg-statusGreen/10'"
        >
          <Image
            :src="selectedCollateralToken.imgUrl"
            :title="selectedCollateralToken.name"
            class="rounded-full w-6 h-6 object-cover mr-1"
          />
          <div class="ml-3 flex-1">
            <div class="text-sm font-medium">Collateral ({{ selectedCollateralToken.name }})</div>
            <div class="text-xs text-grey-lightest">
              Balance
              {{ bigIntToNum(selectedCollateralToken?.balance || 0n, selectedCollateralToken.decimals).toFixed(2) }} /
              Needed
              {{ collateralNeeded.toFixed(2) }}
            </div>
          </div>

          <NuxtIcon v-if="collateralMissing <= 0" name="icon/check" class="text-statusGreen" />
          <n-tooltip
            v-else-if="!quoteError"
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
            You need more FLR to swap to {{ selectedCollateralToken.name }}
          </n-tooltip>
          <div v-else class="text-statusRed text-xs">Swap unavailable</div>
        </div>
      </div>
      <BasicButton class="w-full mt-6" type="primary" @click="closeModal">Close</BasicButton>
    </div>
    <!-- Thirdweb iframe slot -->
    <div v-show="step === Steps.THIRDWEB">
      <div id="thirdwebpay" class="[&>div]:mx-auto [&>div]:!border-none" :style="{ margin: '-20px -24px -20px' }"></div>
    </div>
    <FundSwap
      v-if="step === Steps.SWAP && selectedCollateralToken"
      :amount="collateralMissing"
      :collateral-token="selectedCollateralToken"
      @disable-close="closeDisabled = true"
      @enable-close="closeDisabled = false"
      @back="step = Steps.LANDING"
      @success="handleSwapSuccess"
    />
    <template #header>
      <BasicButton
        v-show="(step != Steps.LANDING || isCustom) && step != Steps.ENTER_AMOUNT"
        type="gradient"
        inner-class="flex justify-center items-center bg-grey-lightest/20 hover:bg-grey-lightest/30 p-2"
        btn-class="!m-0 !p-0 overflow-hidden mt-4"
        class="mt-2"
        :disabled="closeDisabled"
        @click="onBack"
      >
        <NuxtIcon :name="'icon/arrow-back'" color="white" />
      </BasicButton>
    </template>
  </Modal>
</template>
