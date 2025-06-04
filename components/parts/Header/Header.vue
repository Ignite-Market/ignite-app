<template>
  <div class="flex-bc w-full bg-grey px-6 gap-2 sm:gap-6">
    <div class="mt-2">
      <Logo class="inline-block" />
    </div>

    <div class="lg:grow-0 grow">
      <PredictionSetSearch />
    </div>

    <div v-if="$slots.default">
      <slot />
    </div>

    <div class="flex">
      <div class="hidden lg:flex">
        <div
          class="group flex flex-col items-center justify-center border-1 border-white border-opacity-[24%] rounded-lg w-[70px] h-auto mr-2 hover:bg-grey-dark cursor-pointer"
          @click="router.push('/earn')"
        >
          <NuxtIcon class="text-[16px] text-white group-hover:text-primary" name="icon/points" />
          <div class="text-[14px] leading-[20px] !text-white">Earn</div>
        </div>

        <div
          class="group flex flex-col items-center justify-center border-1 border-white border-opacity-[24%] rounded-lg w-[70px] h-auto mr-2 hover:bg-grey-dark cursor-pointer"
          @click="openDocs()"
        >
          <NuxtIcon class="text-[16px] text-white group-hover:text-primary" name="icon/book" />
          <div class="text-[14px] leading-[20px] !text-white">Learn</div>
        </div>

        <div
          class="group flex flex-col items-center justify-center border-1 border-white border-opacity-[24%] rounded-lg w-[70px] h-auto mr-2 hover:bg-grey-dark cursor-pointer"
          @click="router.push('/activity')"
        >
          <NuxtIcon class="text-[16px] text-white group-hover:text-primary" name="icon/activity" />
          <div class="text-[14px] leading-[20px] !text-white">Activity</div>
        </div>

        <div
          class="group flex flex-col items-center justify-center border-1 border-white border-opacity-[24%] rounded-lg w-[70px] h-auto mr-2 hover:bg-grey-dark cursor-pointer"
          @click="router.push('/ranks')"
        >
          <NuxtIcon class="text-[16px] text-white group-hover:text-primary" name="icon/trophy" />
          <div class="text-[14px] leading-[20px] !text-white">Ranks</div>
        </div>
      </div>

      <div v-if="loggedIn" class="flex-cc text-white">
        <!-- <HeaderNotifications /> -->

        <HeaderProfile />
      </div>
      <WalletLogin v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
const { loggedIn } = useLoggedIn();
const router = useRouter();

function openDocs() {
  window.open('https://docs.ignitemarket.xyz/', '_blank');
}
</script>
