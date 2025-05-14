<template>
  <n-dropdown
    v-if="loggedIn"
    v-model:show="isOpened"
    class="rounded-lg"
    placement="bottom-end"
    size="large"
    :options="options"
    style="min-width: 220px"
    :render-label="renderLabel"
    @select="handleSelect"
  >
    <div class="flex items-center bg-grey-light py-2 px-[6px] cursor-pointer rounded-lg">
      <jazzicon class="cursor-pointer rounded-[50%] w-[40px] h-[40px]" :address="address" :diameter="40" />
      <div class="ml-2 font-medium text-[14px] leading-[20px] md:block hidden">
        {{ truncateWallet(address as string) }}
      </div>
      <NuxtIcon
        name="icon/arrow-down"
        class="ml-2 text-[24pxy] transition-all transform"
        :class="{ 'rotate-180': isOpened }"
      />
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { h, resolveComponent } from 'vue';
import { useAccount } from '@wagmi/vue';
import { truncateWallet } from '~/lib/misc/strings';

const router = useRouter();
const { address } = useAccount();
const userStore = useUserStore();
const { loggedIn } = useLoggedIn();
const { isLg } = useScreen();

const isOpened = ref(false);

const renderLabel = option => {
  if (option.type === 'divider') return null;

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

const options = computed(() => [
  {
    key: 'profile',
    label: 'My Profile',
    iconName: 'icon/user',
  },
  {
    key: 'watchlist',
    label: 'Watchlist',
    iconName: 'icon/star',
  },
  ...(!isLg.value
    ? [
        {
          type: 'divider',
          key: 'divider-1',
        },
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
      ]
    : []),
  {
    type: 'divider',
    key: 'divider-2',
  },
  {
    key: 'logout',
    label: 'Logout',
    iconName: 'icon/logout',
  },
]);

function handleSelect(key: string | number) {
  if (key === 'logout') {
    userStore.logout();
    router.push('/');
  } else if (key === 'learn') {
    window.open('https://docs.ignitemarket.xyz/', '_blank');
  } else if (key) {
    router.push({ name: `${key}` });
  }
}
</script>
