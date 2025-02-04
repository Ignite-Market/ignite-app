<template>
  <Btn :loading="loading" @click="addAllowance()">Add allowance</Btn>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
const { getTokenBalance, increaseAllowance, getTokenStore } = useToken();

const loading = ref<boolean>(false);

async function addAllowance() {
  loading.value = true;

  await increaseAllowance();

  const tokenStore = getTokenStore();
  tokenStore.balance = await getTokenBalance();

  loading.value = false;
}
</script>
