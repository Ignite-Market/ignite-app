<script setup lang="ts">
import { useAccount, useBalance } from '@wagmi/vue';

const { address } = useAccount();

const { data: nativeBalance, refetch } = useBalance({ address: address.value });

watch(address, () => refetch());

const hasEnoughNativeBalance = computed(() => {
  if (!nativeBalance.value) {
    return false;
  }

  // Need atleast 1 unit of native token
  return nativeBalance.value?.value && nativeBalance.value.value >= Math.pow(10, nativeBalance.value.decimals - 1);
});
</script>

<template>
  <slot v-if="hasEnoughNativeBalance" />

  <div v-else>
    <p>You need a small amount (~0.01) of native token to perform this action.</p>
  </div>
</template>
