<template>
  <Modal
    v-model:show="isOpen"
    display-directive="show"
    class="w-[320px] border-none !bg-grey-dark"
    @update:show="onModalUpdate"
  >
    <h2 class="text-xl font-bold text-center mb-6">Send Funds</h2>
    <SelectOptions
      class="w-full mb-6"
      :options="tokenOptions"
      value-field="key"
      :default-value="selectedToken?.key"
      :render-label="renderTokenLabel"
      @update:value="value => (selectedToken = props.tokenOptions.find(token => token.key === value))"
    />
    <div v-if="selectedToken" class="flex flex-col items-center gap-4 w-full">
      <div class="flex flex-col gap-3 w-full">
        <n-input
          v-model:value="recipient"
          type="text"
          placeholder="Recipient address"
          class="min-w-full text-center"
          required
        />
        <n-input-number
          v-model:value="amount"
          placeholder="0"
          min="0"
          class="min-w-full text-center"
          type="number"
          :max="+selectedToken.parsedBalance"
          button-placement="both"
        />
        <BasicButton class="w-full mt-2" :loading="loading" :disabled="!amount || !recipient" @click="sendTransaction">
          Send
        </BasicButton>
      </div>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import { useAccount, useBalance, useSendTransaction } from '@wagmi/vue';
import { isAddress } from 'viem';
import { useMessage } from 'naive-ui';
import useContracts from '~/composables/useContracts';
import useTxWait from '~/composables/useTxWait';
import { numToBigInt } from '~/lib/utils/numbers';
import { ContractType } from '~/lib/config/contracts';
import { contractError } from '~/lib/utils/errors';
import useCollateralToken from '~/composables/useCollateralToken';

const props = defineProps({
  tokenOptions: { type: Array as PropType<any[]>, default: () => [] },
});

const { sendTransactionAsync } = useSendTransaction();
const { isConnected, address } = useAccount();
const tokenStore = useTokensStore();
const isOpen = ref(false);
const selectedToken = ref<any>(null);
const recipient = ref('');
const amount = ref(0);
const loading = ref(false);

// Composables and helpers
const { ensureCorrectNetwork, initContract } = useContracts();
const txWait = useTxWait();
const message = useMessage();

const { refreshAllCollateralBalances } = useCollateralToken();
const { refetch: refetchNativeBalance } = useBalance({
  address: computed(() => address.value),
});

watch(
  () => [isConnected.value, tokenStore.loaded],
  async () => {
    await refreshAllCollateralBalances();
    await refetchNativeBalance();
  }
);

const onModalUpdate = (show: boolean) => {
  isOpen.value = show;
  if (!show) {
    resetSendModal();
  }
};

// Expose methods and state for parent component
defineExpose({
  isOpen,
  openModal: (tokenId: number) => {
    selectedToken.value = props.tokenOptions.find(token => token.key === tokenId);

    isOpen.value = true;
  },
  closeModal: () => {
    isOpen.value = false;
    resetSendModal();
  },
});

// Send token to recipient
const sendTransaction = async () => {
  if (!isAddress(recipient.value)) {
    message.error('Invalid recipient address');
    return;
  }

  loading.value = true;
  try {
    if (selectedToken.value.key === 'native') {
      await sendNativeToken();
    } else {
      await sendToken();
    }
  } finally {
    loading.value = false;
  }
};

/**
 * Send native FLR token
 */
async function sendNativeToken() {
  try {
    await ensureCorrectNetwork();

    const value = numToBigInt(+amount.value, 18); // FLR has 18 decimals

    txWait.hash.value = await sendTransactionAsync({
      to: recipient.value as `0x${string}`,
      value,
    });

    await txWait.wait();

    // Refresh balances after successful transaction
    await refetchNativeBalance();
    message.success('Transaction sent successfully');
    resetSendModal();
  } catch (e) {
    console.error(e);
    message.error(contractError(e));
  }
}

/**
 * Send ERC20 collateral token
 */
async function sendToken() {
  try {
    const token = tokenStore.getToken(selectedToken.value.id);
    if (!token) {
      message.error('Token not found');
      return;
    }

    await ensureCorrectNetwork();

    const contract = await initContract(ContractType.COLLATERAL_TOKEN, token.address);

    const amountBigInt = numToBigInt(+amount.value, token.decimals);

    txWait.hash.value = await contract.write.transfer([recipient.value as `0x${string}`, amountBigInt]);

    await txWait.wait();

    await refreshAllCollateralBalances();
    message.success('Transaction sent successfully');
    resetSendModal();
  } catch (e) {
    console.error(e);
    message.error(contractError(e));
  }
}

function resetSendModal() {
  recipient.value = '';
  amount.value = 0;
}

const renderTokenLabel = (option: any) => {
  return [
    h(
      'div',
      {
        class: 'flex items-center',
      },
      [
        option.imgUrl
          ? h(resolveComponent('Image'), {
              src: option.imgUrl,
              class: 'rounded-full w-5 h-5 object-cover mr-1',
            })
          : h(resolveComponent('NuxtIcon'), {
              name: option.iconName,
              filled: true,
              class: 'text-[20px] h-5 mr-1',
            }),
        h('div', option.name),
        h('div', { class: ['text-xs text-grey-lightest ml-3'] }, 'Balance: ' + option.parsedBalance),
      ]
    ),
  ];
};
</script>
