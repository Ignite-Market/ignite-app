<template>
  <BasicButton
    class="sm:py-[17px] py-[14px] px-[4px] sm:px-[16px] min-w-[55px]"
    v-bind="$attrs"
    size="large"
    @click="btnAction()"
  >
    <span v-if="address">
      Disconnect
      <small>({{ truncateWallet(address) }})</small>
    </span>
    <span v-else class="font-bold text-[14px] leading-[20px]">Log In</span>
  </BasicButton>

  <!-- Modal - Wallet select -->
  <modal
    v-model:show="modalWalletSelectVisible"
    class="w-[300px] border-none"
    :mask-closable="!loadingWallet"
    :closable="!loadingWallet"
  >
    <WalletEvm :loading="loadingWallet" :step="step" @step="step = step + 1" @loading="loading => (loadingWallet = loading)" />
  </modal>
</template>

<script lang="ts" setup>
import { useAccount, useAccountEffect, useDisconnect, type Config } from '@wagmi/vue';
import { signMessage } from '@wagmi/vue/actions';
import Endpoints from '~/lib/values/endpoints';
import { truncateWallet } from '~/lib/misc/strings';
import BasicButton from '~/components/general/BasicButton.vue';

const { resetContracts, ensureCorrectNetwork } = useContracts();
const { $wagmiConfig } = useNuxtApp();

const messageProvider = useMessage();
const userStore = useUserStore();

/** Evm wallet - wagmi */
const { disconnect } = useDisconnect();
const { address } = useAccount();

useAccountEffect({
  onConnect: data => evmWalletLogin(data),
});

const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);
const step = ref(0); // 0 - captcha, 1 - connect wallet, 2 - sign message

// TODO: handle wallet switch - user needs to sign the message again!

onBeforeMount(() => {
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
    } else if (address && !loadingWallet.value) {
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
  console.log('On wallet login');
  await sleep(200);

  if (!address) {
    messageProvider.error('A wallet account must be connected.');
    return;
  } else if (loadingWallet.value && Object.keys(data).length === 0) {
    // loadingWallet.value = false;
    return;
  }

  loadingWallet.value = true;
  try {
    await ensureCorrectNetwork();
  } catch (error) {
    console.log('Error while switching network: ');
    console.log(error);
  }

  step.value = 2;

  try {
    const resMessage = await $api.get<WalletMessageResponse>(Endpoints.walletMessage);
    const message = resMessage.data.message;
    const timestamp = resMessage.data.timestamp;
    const signature = await signMessage($wagmiConfig as Config, { message });

    const res = await $api.post<WalletLoginResponse>(Endpoints.walletLogin, {
      address: data?.address || address.value,
      signature,
      timestamp,
    });

    userStore.saveUser(res.data);

    messageProvider.success('Wallet has been successfully connected.');
  } catch (error) {
    console.error(error);

    messageProvider.error(contractError(error));
    userStore.logout();
    disconnect();

    modalWalletSelectVisible.value = false;
  }
  loadingWallet.value = false;
}
</script>
