<template>
  <Dashboard>
    <div v-if="userStore.loggedIn">
      <Heading
        title="Use your digital assets to borrow cryptocurrency"
        content="Select the NFT you would like to use as collateral, set your loan details, publish, and receive your loan offers!"
        reversed
      />
      <Assets open />
    </div>
    <div v-else>Please login</div>
    <template #bottom> </template>
  </Dashboard>
</template>

<script lang="ts" setup>
const userStore = useUserStore();
</script>
