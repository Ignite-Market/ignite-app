<template>
  <div class="flex-bc w-full bg-grey px-6 gap-2">
    <div class="mt-2">
      <Logo class="inline-block" />
    </div>

    <div>
      <PredictionSetSearch />
    </div>

    <div>
      <slot />
    </div>

    <div class="flex">
      <div v-if="isConnected && userStore.loggedIn" class="flex-cc text-white">
        <!-- <HeaderNotifications /> -->
        <HeaderProfile />
      </div>
      <WalletLogin v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue';

const userStore = useUserStore();
const { isConnected } = useAccount();
</script>
