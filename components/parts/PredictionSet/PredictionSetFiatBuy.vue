<script setup lang="ts">
// import { useAccount } from '@wagmi/vue';
import { startThirdwebPayment } from '~/lib/thirdwebpay/dist/thirdwebpay';

defineProps<{
  loading: boolean;
}>();

const config = useRuntimeConfig();

async function startThirdweb() {
  try {
    await new Promise(resolve => {
      setTimeout(() => {
        startThirdwebPayment('#thirdwebpay', {
          clientId: config.public.THIRDWEB_CLIENT_KEY,
          amountInUsdc: '0.01',
          purchaseData: { purchaseId: 1 },
          onSuccess: (info: any) => {
            console.log(info);
          },
        });
      }, 250);

      setTimeout(resolve, 100);
    });
  } catch (e) {
    console.error(e);
  }
}
</script>

<template>
  <div>
    <!-- <BasicButton
      class="w-full"
      :btn-class="['!font-bold']"
      :size="'large'"
      :disabled="!isConnected"
      type="secondary"
      :loading="loading"
      @click="getQuote('0.01')"
    >
      Thirdweb Pay
    </BasicButton>

    <br /> -->

    <div id="thirdwebpay"></div>

    <BasicButton @click="startThirdweb">Start Thirdweb</BasicButton>
  </div>
</template>
