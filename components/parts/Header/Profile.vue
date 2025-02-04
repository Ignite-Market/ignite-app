<template>
  <n-dropdown
    v-if="userStore.loggedIn"
    class="rounded-lg"
    placement="bottom-end"
    trigger="click"
    size="large"
    :options="options"
    style="min-width: 220px"
    @select="handleSelect"
  >
    <jazzicon class="cursor-pointer rounded-[50%]" :address="address" :diameter="40" />
  </n-dropdown>
</template>

<script lang="ts" setup>
import { useAccount } from '@wagmi/vue';

const { t } = useI18n();
const router = useRouter();
const { address } = useAccount();
const userStore = useUserStore();

const renderNuxtIcon = (iconName: string) => {
  return () => {
    return h(resolveComponent('NuxtIcon'), { name: iconName, class: 'text' }, '');
  };
};

const options = computed(() => [
  {
    key: 'index',
    label: t('profile.account'),
  },
  {
    key: 'profile',
    label: t('profile.profile'),
  },
  {
    key: 'logout',
    label: t('profile.logout'),
  },
]);

function handleSelect(key: string | number) {
  if (key === 'logout') {
    userStore.logout();
    router.push('/');
  } else if (key) {
    router.push({ name: `${key}` });
  }
}
</script>
