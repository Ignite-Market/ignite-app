<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
import { startThirdwebPayment } from '~/lib/thirdwebpay/dist/thirdwebpay';

const props = defineProps<{
  defaultAmount?: number;
  loading: boolean;
  buyFundLimit: number;
}>();

const emit = defineEmits<{
  (e: 'success', amount: number): void;
}>();

const config = useRuntimeConfig();
const { connector, isConnected, address } = useAccount();
const isOpen = ref(false);
const isThirdweb = ref(false); // Is thirdweb step currently displayed
const amount = ref<number | undefined>(props.defaultAmount || undefined);
const buyError = ref<string | undefined>(undefined);

function startThirdweb() {
  if (!address.value) {
    return;
  }

  try {
    isOpen.value = true;

    setTimeout(() => {
      /**
       * Method from thirdwebpay package (nested react app)
       */
      startThirdwebPayment('#thirdwebpay', {
        clientId: config.public.THIRDWEB_CLIENT_KEY,
        paymentReceiverAddress: address.value,
        amountInUsdc: amount.value?.toString() || '1',
        // purchaseData: { purchaseId: 1 },
        connectorId: connector.value?.id,
        onSuccess: (_info: any) => {
          /**
           * Handle success in <PredictionSetAction />
           */
          emit('success', amount.value || 0);
        },
      });
    }, 50);
  } catch (e) {
    console.error(e);
  }
}

const buyValidator = (x: number) => {
  if (x > props.buyFundLimit) {
    // Because input is calling -1 +1 for buttons
    if (amount.value !== x - 1) {
      buyError.value = `Amount can not exceed 10% of total liquidity.`;
    }
  } else {
    buyError.value = '';
  }

  return x >= 0 && x <= props.buyFundLimit;
};

const onBuyBlur = () => {
  if (buyError.value) {
    amount.value = props.buyFundLimit;
    buyError.value = '';
  }
};

function onNextStep() {
  if (!amount.value) {
    return;
  }

  startThirdweb();
  isThirdweb.value = true;
}
</script>

<template>
  <div>
    <BasicButton
      class="w-full"
      :btn-class="['!font-bold']"
      :size="'large'"
      :disabled="!isConnected"
      type="secondary"
      :loading="loading"
      @click="
        isThirdweb = false;
        amount = defaultAmount;
        startThirdweb();
      "
    >
      Other Payment Options
    </BasicButton>

    <Modal
      v-model:show="isOpen"
      display-directive="show"
      class="!max-w-[402px] !bg-[#131418] [&>.n-card-header>button]:z-1"
      @update:show="isOpen = $event"
    >
      <div v-show="!isThirdweb" :style="{ marginTop: '-24px' }">
        <h2 class="text-xl font-bold text-center mb-2">Other payment options</h2>

        <p class="text-sm text-grey-lightest text-center mb-4">
          Enter the amount you want to buy with your card or crypto assets.
        </p>

        <div>
          <n-input-number
            v-model:value="amount"
            placeholder="0"
            min="0"
            size="large"
            class="min-w-full text-center"
            type="number"
            :show-button="true"
            button-placement="both"
            :disabled="loading"
            :validator="buyValidator"
            @blur="onBuyBlur"
          >
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

          <div v-if="buyError" class="text-statusRed mt-1">
            {{ buyError }}
          </div>

          <BasicButton
            class="w-full mt-3"
            :btn-class="['!font-bold']"
            :size="'large'"
            :disabled="!isConnected"
            :loading="loading"
            @click="onNextStep()"
          >
            Buy
          </BasicButton>
        </div>
      </div>

      <div v-show="isThirdweb">
        <div
          id="thirdwebpay"
          class="[&>div]:mx-auto [&>div]:!border-none"
          :style="{ margin: '-57px -24px -20px' }"
        ></div>

        <!-- <div class="mt-4 -mb-2">
          <BasicButton type="link" size="small" class="w-full" @click="isThirdweb = false"> Cancel </BasicButton>
        </div> -->
      </div>
    </Modal>
  </div>
</template>
