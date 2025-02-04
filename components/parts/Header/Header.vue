<template>
  <div class="flex-bc w-full bg-grey-light px-6">
    <div class="mt-2">
      <Logo class="inline-block" />
    </div>

    <div>
      <n-input placeholder="Search markets" size="large">
        <template #prefix>
          <NuxtIcon name="icon/search" />
        </template>
      </n-input>
    </div>

    <div>
      <slot />
    </div>

    <div class="flex">
      <button>test</button>
      <button>test</button>
      <button>test</button>
      <button>test</button>
      <div v-if="isConnected && userStore.loggedIn" class="flex-cc text-white">
        <HeaderNotifications />
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
