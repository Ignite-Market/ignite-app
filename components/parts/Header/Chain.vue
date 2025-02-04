<template>
  <n-dropdown
    v-if="userStore.loggedIn"
    class="rounded-lg"
    placement="bottom-end"
    trigger="click"
    size="large"
    :loading="loading"
    :options="options"
    style="min-width: 220px"
    @select="handleSelect"
  >
    <div class="h-10 p-[6px] flex-cc gap-2 bg-bg rounded-3xl cursor-pointer">
      <span class="flex-cc h-7 w-7 bg-bg-box rounded-full">
        <NuxtIcon :name="`logo/${activeChain?.name}`" class="text-2xl text-black" filled />
      </span>

      <div class="relative">
        <Spinner v-if="loading" :size="24" />
        <span class="inline-block mr-2" :class="{ 'text-transparent': loading }">
          {{ bigIntToNum(tokenStore.balance) }}
          {{ activeChain?.nativeCurrency?.symbol }}
        </span>
      </div>
    </div>
  </n-dropdown>
</template>

<script lang="ts" setup>
import { useAccount, useChains } from '@wagmi/vue';

const { t } = useI18n();
const userStore = useUserStore();
const chains = useChains();
const { address, isConnected } = useAccount();
const { activeChain, ensureCorrectNetwork, resetContracts } = useContracts();
const { syncBalance, getTokenStore } = useToken();

const loading = ref<boolean>(true);
const tokenStore = ref(getTokenStore());

const options = computed(() => chains.value.map(chain => ({ key: chain.id, label: chain.name })));

onMounted(async () => {
  if (!tokenStore.value.symbol && address.value) {
    await reloadBalance();
  }
  loading.value = false;
});

watch(
  () => userStore.loggedIn,
  loggedIn => {
    if (loggedIn && isConnected.value) {
      reloadBalance();
    }
  }
);

async function reloadBalance(chain?: number) {
  loading.value = true;
  await sleep(100);
  await syncBalance(chain);
  loading.value = false;
}

async function handleSelect(key: number) {
  loading.value = true;
  resetContracts();
  await ensureCorrectNetwork(key);
  await reloadBalance(key);

  tokenStore.value = getTokenStore();
}
</script>
