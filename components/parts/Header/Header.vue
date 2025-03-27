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
      <div
        class="group flex flex-col items-center justify-center border-1 border-white border-opacity-[24%] rounded-lg w-[70px] h-auto mr-2 hover:bg-grey-dark cursor-pointer"
      >
        <NuxtIcon class="text-[16px] text-white group-hover:text-primary" name="icon/book" />
        <div class="text-[14px] leading-[20px] !text-white">Learn</div>
      </div>

      <div
        class="group flex flex-col items-center justify-center border-1 border-white border-opacity-[24%] rounded-lg w-[70px] h-auto mr-2 hover:bg-grey-dark cursor-pointer"
      >
        <NuxtIcon class="text-[16px] text-white group-hover:text-primary" name="icon/activity" />
        <div class="text-[14px] leading-[20px] !text-white">Activity</div>
      </div>

      <div
        class="group flex flex-col items-center justify-center border-1 border-white border-opacity-[24%] rounded-lg w-[70px] h-auto mr-2 hover:bg-grey-dark cursor-pointer"
      >
        <NuxtIcon class="text-[16px] text-white group-hover:text-primary" name="icon/trophy" />
        <div class="text-[14px] leading-[20px] !text-white">Ranks</div>
      </div>

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
