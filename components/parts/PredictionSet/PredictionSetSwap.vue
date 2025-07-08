<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
const props = defineProps<{
  defaultAmount?: number;
  loading?: boolean;
}>();

async function getQuote(amount: number) {
  const query = new URLSearchParams();
  query.set('amount', amount.toFixed(18));
  query.set('tokenIn', '0x0000000000000000000000000000000000000000');
  query.set('tokenOut', '0xe7cd86e13AC4309349F30B3435a9d337750fC82D');
  query.set('slippage', '30');
  query.set('gasPrice', '100.00');
  query.set('chainId', '14');
  const quote = await fetch('https://router.sparkdex.ai/quote?' + query.toString(), {
    method: 'GET',
  });
  const data = await quote.json();
  console.log(data);
}

onMounted(() => {
  getQuote(10);
});
</script>

<template><div></div></template>
