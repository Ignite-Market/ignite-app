<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
import { startThirdwebPayment } from '~/lib/thirdwebpay/dist/thirdwebpay';

const props = defineProps<{
  amount?: number;
  loading: boolean;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const config = useRuntimeConfig();
const { connector, isConnected } = useAccount();
const isOpen = ref(false);

function startThirdweb() {
  if (!props.amount) return;

  try {
    isOpen.value = true;

    setTimeout(() => {
      if (!props.amount) return;

      /**
       * Method from thirdwebpay package (nested react app)
       */
      startThirdwebPayment('#thirdwebpay', {
        clientId: config.public.THIRDWEB_CLIENT_KEY,
        amountInUsdc: props.amount.toString(),
        purchaseData: { purchaseId: 1 },
        connectorId: connector.value?.id,
        testMode: true,
        onSuccess: (info: any) => {
          console.log(info);
          /**
           * @TODO Handle success in <PredictionSetAction />
           */
          emit('success');
        },
      });
    }, 50);
  } catch (e) {
    console.error(e);
  }
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
      @click="startThirdweb"
    >
      Other Payment Options
    </BasicButton>

    <Modal
      v-model:show="isOpen"
      display-directive="show"
      class="!max-w-[402px] !bg-[#131418] [&>.n-card-header]:z-1"
      @update:show="isOpen = $event"
    >
      <div id="thirdwebpay" class="[&>div]:mx-auto [&>div]:!border-none" :style="{ margin: '-57px -24px -20px' }"></div>
    </Modal>
  </div>
</template>
