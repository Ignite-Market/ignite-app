<template>
  <Btn :loading="loading" @click="approveNfts()">Approve all NFTs</Btn>
</template>

<script lang="ts" setup>
const { setApprovalForAll } = useNft();

const loading = ref<boolean>(false);

async function approveNfts() {
  loading.value = true;
  try {
    await setApprovalForAll();
  } catch (error) {
    console.error(error);
  }
  loading.value = false;
}
</script>
