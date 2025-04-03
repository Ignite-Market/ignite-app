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
  <modal v-model:show="modalWalletSelectVisible" class="w-[270px] border-none">
    <div class="flex flex-col">
      <div class="flex w-full items-center justify-center mb-2">
        <NuxtIcon name="wallet/injected" class="text-primary text-[40px]" />
      </div>
      <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Connect wallet</div>

      <div class="flex flex-col items-center justify-center mt-5 mb-3">
        <WalletEvm :loading="loadingWallet" />
      </div>
    </div>
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
const { loadToken } = useCollateralToken();

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

// TODO: Disconnect user if he doesn't sign the message!
// TODO: handle wallet switch - user needs to sign the message again!

onBeforeMount(() => {
  // if (!isConnected.value) {
  //   userStore.logout();
  // }

  if (!userStore.loggedIn) {
    disconnect();
    resetContracts();
  }

  loadToken(false);
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
    messageProvider.error('A wallet account must be connected.');
    return;
  } else if (loadingWallet.value) {
    return;
  }

  loadingWallet.value = true;
  try {
    await ensureCorrectNetwork();
  } catch (error) {
    console.log('Error while switching network: ');
    console.log(error);
  }

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
  }
  loadingWallet.value = false;
}
</script>
