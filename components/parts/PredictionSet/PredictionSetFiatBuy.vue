<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
import { startThirdwebPayment } from '~/lib/thirdwebpay/dist/thirdwebpay';

const props = defineProps<{
  defaultAmount?: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'success', amount: number): void;
}>();

const config = useRuntimeConfig();
const { connector, isConnected, address } = useAccount();
const isOpen = ref(false);
const isThirdweb = ref(false); // Is thirdweb step currently displayed
const amount = ref<number | undefined>(props.defaultAmount || undefined);

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

function onNextStep() {
  if (!amount.value) {
    return;
  }

  startThirdweb();
  isThirdweb.value = true;
}

// Expose methods and state for parent component
defineExpose({
  isOpen,
  openModal: () => {
    isOpen.value = true;
    isThirdweb.value = false;
    amount.value = props.defaultAmount || undefined;
  },
  closeModal: () => {
    isOpen.value = false;
    isThirdweb.value = false;
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
      <div id="thirdwebpay" class="[&>div]:mx-auto [&>div]:!border-none" :style="{ margin: '-57px -24px -20px' }"></div>

      <!-- <div class="mt-4 -mb-2">
          <BasicButton type="link" size="small" class="w-full" @click="isThirdweb = false"> Cancel </BasicButton>
        </div> -->
    </div>
  </Modal>
</template>
