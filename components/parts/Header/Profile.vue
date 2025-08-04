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
      <jazzicon
        class="cursor-pointer rounded-[50%] size-[30px] md:size-[40px]"
        :address="address"
        :diameter="isMd ? 40 : 30"
      />

      <div class="ml-2 font-medium text-[14px] leading-[20px] md:block hidden lg:hidden xl:block">
        {{ truncateWallet(address as string) }}
      </div>

      <NuxtIcon
        name="icon/arrow-down"
        class="ml-2 text-[24pxy] transition-all transform"
        :class="{ 'rotate-180': isOpened }"
      />
    </div>
  </n-dropdown>
  <HeaderTokensModal ref="tokensModal" :token-options="tokenOptions" />
</template>

<script lang="ts" setup>
import { useAccount, useBalance } from '@wagmi/vue';
import { truncateWallet } from '~/lib/misc/strings';
import { formatCollateralAmount } from '~/lib/utils/numbers';
import useCollateralToken from '~/composables/useCollateralToken';

const emit = defineEmits(['openFundModal']);

const router = useRouter();
const { isConnected, address, connector } = useAccount();
const userStore = useUserStore();
const { loggedIn } = useLoggedIn();
const { isLg, isMd } = useScreen();
const tokenStore = useTokensStore();
const tokensModal = ref<any>(null);
const isOpened = ref(false);

const { refreshAllCollateralBalances } = useCollateralToken();
const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({
  address: computed(() => address.value),
});

const isInAppWallet = computed(() => connector.value?.id === 'in-app-wallet');

watch(
  () => [isConnected.value, tokenStore.loaded],
  async () => {
    await refreshAllCollateralBalances();
    await refetchNativeBalance();
  }
);

const openSendModal = (option: any) => {
  tokensModal.value.openModal(option.key);
};

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

const tokenOptions = computed(() => {
  const tokens = [
    {
      type: 'token',
      key: 'native',
      name: 'FLR',
      label: 'FLR',
      symbol: 'FLR',
      balance: nativeBalance.value?.value,
      parsedBalance: formatCollateralAmount(nativeBalance.value?.value || 0n, 18),
      iconName: 'icon/flare',
    },
  ] as any;
  tokens.push(
    ...Object.values(tokenStore.items).map(token => ({
      type: 'token',
      key: token.id,
      label: token.name,
      ...token,
    }))
  );

  return tokens;
});

const renderTokens = () => {
  const tokens = tokenOptions.value.map(option =>
    h(
      'div',
      {
        class: ['flex items-center gap-2 group justify-between'],
        style: { width: '100%' },
      },
      [
        h(
          'div',
          {
            class: ['flex items-center gap-2 group'],
          },
          [
            option.imgUrl
              ? h(resolveComponent('Image'), { src: option.imgUrl, class: ['w-4 h-4'] })
              : h(resolveComponent('NuxtIcon'), { name: option.iconName, filled: true }),
            h('div', {}, [
              h('span', { class: ['text-[14px]'] }, option.parsedBalance),
              h('span', { class: ['text-[12px]'] }, ' ' + option.symbol),
            ]),
          ]
        ),

        isInAppWallet.value
          ? h(
              'div',
              {
                class: [
                  'text-[10px] cursor-pointer flex items-center gap-2 transition-colors hover:text-primary-bright px-2',
                ],
                onClick: () => {
                  openSendModal(option);
                },
              },
              [
                'Send',
                h(resolveComponent('NuxtIcon'), {
                  name: 'icon/send',
                  class: ['text-[12px] transition-colors hover:text-primary-bright rotate-[-15deg]'],
                }),
              ]
            )
          : null,
      ]
    )
  );

  return h('div', { class: ['flex flex-col gap-2 px-4 py-2'] }, tokens);
};

const options = computed(() => [
  {
    key: 'tokens',
    type: 'render',
    render: renderTokens,
  },
  {
    type: 'divider',
    key: 'divider-2',
  },
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
          key: 'fund',
          label: 'Fund',
          iconName: 'icon/coins',
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
  ...(userStore.isAdmin
    ? [
        {
          key: 'admin',
          label: 'Admin',
          iconName: 'icon/settings',
        },
        {
          type: 'divider',
          key: 'divider-2',
        },
      ]
    : []),
  {
    key: 'logout',
    label: 'Logout',
    iconName: 'icon/logout',
  },
]);

function handleSelect(key: string | number) {
  if (key === 'logout') {
    userStore.logout();
  } else if (key === 'learn') {
    window.open('https://docs.ignitemarket.xyz/', '_blank');
  } else if (key === 'fund') {
    emit('openFundModal');
  } else if (key) {
    router.push({ name: `${key}` });
  }
}
</script>
