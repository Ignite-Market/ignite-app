<template>
  <div class="flex-bc w-full bg-grey px-6 gap-2 sm:gap-6 xl:gap-12">
    <div class="mt-2">
      <Logo class="inline-block" />
    </div>

    <div class="xl:grow-0 grow xl:max-w-[initial] max-w-[500px]">
      <PredictionSetSearch />
    </div>

    <div v-if="$slots.default">
      <slot />
    </div>

    <div class="flex">
      <div v-if="loggedIn" class="mr-2 lg:mr-4 flex items-center">
        <Points compact />
      </div>

      <div class="hidden lg:flex">
        <div
          v-if="loggedIn"
          class="group flex flex-col items-center justify-center border-1 border-white border-opacity-[24%] rounded-lg w-[70px] h-auto mr-2 hover:bg-grey-dark cursor-pointer"
          @click="openFiatBuyModal"
        >
          <NuxtIcon class="text-[16px] text-white group-hover:text-primary" name="icon/coins" />
          <div class="text-[14px] leading-[20px] !text-white">Swap</div>
        </div>

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

        <HeaderProfile @open-fund-modal="openFiatBuyModal" />
      </div>
      <div v-else class="flex-cc gap-2">
        <WalletLogin />
        <div class="lg:hidden">
          <n-dropdown
            v-model:show="menuOpened"
            class="rounded-lg"
            placement="bottom-end"
            size="large"
            :options="options"
            style="min-width: 220px"
            :render-label="renderLabel"
            @select="handleSelect"
          >
            <div class="transition-all duration-1000 h-[24px] w-[24px] flex-cc">
              <NuxtIcon name="icon/menu" class="text-[24px]" />
            </div>
          </n-dropdown>
        </div>
      </div>
    </div>
    <FundModal ref="fundModalRef" />
  </div>
</template>

<script setup lang="ts">
import { useAccount } from '@wagmi/vue';
import FundModal from '../Fund/FundModal.vue';

const { loggedIn } = useLoggedIn();
const { address } = useAccount();
const userStore = useUserStore();
const router = useRouter();
const fundModalRef = ref();
const menuOpened = ref(false);

const openFiatBuyModal = () => {
  fundModalRef.value?.openModal();
};

watch(address, () => {
  if (userStore.loggedIn && address.value !== userStore.user.walletAddress) {
    userStore.logout();
  }
});

watch(
  () => loggedIn.value,
  _ => {
    if (loggedIn.value) {
      userStore.getUserPoints();
    }
  }
);

function openDocs() {
  window.open('https://docs.ignitemarket.xyz/', '_blank');
}

const renderLabel = option => {
  return h(
    'div',
    {
      class: ['flex items-center gap-2 group'],
      style: { width: '100%' },
    },
    [
      option.iconName
        ? h(
            'div',
            {
              class: ['text-[16px] group-hover:text-primary transition-colors'],
            },
            [h(resolveComponent('NuxtIcon'), { name: option.iconName })]
          )
        : null,
      h('span', {}, option.label),
    ]
  );
};

const options = [
  {
    key: 'earn',
    label: 'Earn',
    iconName: 'icon/points',
  },
  {
    key: 'learn',
    label: 'Learn',
    iconName: 'icon/book',
  },
  {
    key: 'activity',
    label: 'Activity',
    iconName: 'icon/activity',
  },
  {
    key: 'ranks',
    label: 'Ranks',
    iconName: 'icon/trophy',
  },
];

function handleSelect(key: string | number) {
  if (key === 'learn') {
    window.open('https://docs.ignitemarket.xyz/', '_blank');
  } else if (key) {
    router.push({ name: `${key}` });
  }
}
</script>
