<script lang="ts" setup>
import { useAccount, useAccountEffect, useDisconnect, type Config } from '@wagmi/vue';
import { signMessage } from '@wagmi/vue/actions';
import Endpoints from '~/lib/values/endpoints';
import { truncateWallet } from '~/lib/misc/strings';
import BasicButton from '~/components/general/BasicButton.vue';

const { resetContracts, ensureCorrectNetwork } = useContracts();
const { disconnect } = useDisconnect();
const { $wagmiConfig } = useNuxtApp();
const { address, connector } = useAccount();
const messageProvider = useMessage();
const userStore = useUserStore();
const { connectExternalWallet } = useThirdweb();
// const { signMessageAsync } = useSignMessage();

const loadingWallet = ref<boolean>(false);
const modalWalletSelectVisible = ref<boolean>(false);
const step = ref(0); // 0 - captcha, 1 - connect wallet, 2 - sign message

useAccountEffect({
  onConnect: data => evmWalletLogin(data),
});

onBeforeMount(() => {
  if (!userStore.loggedIn) {
    disconnect();
    resetContracts();
  }
});

watch(address, address => {
  if (address && !userStore.loggedIn) {
    evmWalletLogin({});
  } else if (address && !loadingWallet.value) {
    modalWalletSelectVisible.value = false;
  }
});

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

  if (!address.value && !data?.address) {
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
    console.error('Error while switching network: ', error);
    messageProvider.error('Error while switching network.');
    return;
  }

  step.value = 2;

  try {
    const resMessage = await $api.get<WalletMessageResponse>(Endpoints.walletMessage);
    const message = resMessage.data.message;
    const timestamp = resMessage.data.timestamp;
    const signature = await signMessage($wagmiConfig as Config, { message });

    const body = {
      address: data?.address || address.value,
      signature,
      timestamp,
      referralId: undefined as string | undefined,
    };

    if (localStorage.getItem('referralCode')) {
      body.referralId = localStorage.getItem('referralCode') || undefined;
      localStorage.removeItem('referralCode');
    }

    const res = await $api.post<WalletLoginResponse>(Endpoints.walletLogin, body);

    // Connect wallet with thirdweb to make it available for Thirdweb PayEmbed
    connectExternalWallet(connector.value?.id || data?.connector?.id || '');

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
    <WalletConnectors :loading="loadingWallet" :step="step" @step="step = $event" @loading="loadingWallet = $event" />
  </modal>
</template>
