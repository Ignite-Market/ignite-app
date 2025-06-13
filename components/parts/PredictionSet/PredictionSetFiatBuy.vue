<script setup lang="ts">
import { useAccount } from '@wagmi/vue';

defineProps<{
  loading: boolean;
}>();

const { isConnected } = useAccount();
const { getQuote } = useThirdwebPay();
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
      @click="getQuote('0.01')"
    >
      Thirdweb Pay
    </BasicButton>
  </div>
</template>
