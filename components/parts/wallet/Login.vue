<template>
  <Btn v-bind="$attrs" @click="btnAction()">
    <span v-if="address">
      {{ $t('wallet.disconnect') }} <small class="tracking-wide">({{ truncateWallet(address) }})</small>
    </span>
    <span v-else>{{ $t('wallet.connect') }}</span>
  </Btn>
  <!-- Modal - Wallet select -->
  <modal v-model:show="modalWalletSelectVisible" :title="$t('wallet.info')">
    <WalletEvm :loading="loadingWallet" />
  </modal>
</template>

<script lang="ts" setup>
import { useAccount, useAccountEffect, useDisconnect, type Config } from '@wagmi/vue';
import { signMessage } from '@wagmi/vue/actions';
import Endpoints from '~/lib/values/endpoints';
import { truncateWallet } from '~/lib/misc/strings';

const { t } = useI18n();
const { $wagmiConfig } = useNuxtApp();
const { error, success } = useMessage();
const userStore = useUserStore();
const assetStore = useAssetStore();
const { resetContracts } = useContracts();

/** Evm wallet - wagmi */
const { disconnect } = useDisconnect();
const { address, isConnected } = useAccount();

useAccountEffect({
  onConnect: data => evmWalletLogin(data),
});

const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);

onBeforeMount(() => {
  if (!isConnected.value) {
    try {
      assetStore.$reset();
    } catch (e) {
      console.error(e);
    }
  }
  if (!userStore.loggedIn) {
    disconnect();
    resetContracts();
  }
});

watch(
  () => address.value,
  address => {
    if (address && !userStore.loggedIn) {
      evmWalletLogin({});
    } else if (address) {
      modalWalletSelectVisible.value = false;
    }
  }
);

function btnAction() {
  if (address.value) {
    disconnect();
    resetContracts();
  } else {
    modalWalletSelectVisible.value = true;
  }
}

/** Login with EVM wallet */
async function evmWalletLogin(data: Record<string, any>) {
  await sleep(200);

  if (!address) {
    error(t('wallet.login.walletAccountNotConnected'));
    return;
  } else if (loadingWallet.value) {
    return;
  }

  loadingWallet.value = true;

  try {
    const message = `Login with wallet ${address.value}`;
    const signature = await signMessage($wagmiConfig as Config, { message });

    const res = await $api.post<WalletLoginResponse>(Endpoints.walletLogin, {
      address: data?.address || address.value,
      signature,
    });

    userStore.saveUser(res.data);

    /** Show success message */
    success(t('wallet.login.success'));
  } catch (e) {
    console.error(e);
    error(apiError(e));
  }
  loadingWallet.value = false;
}
</script>
