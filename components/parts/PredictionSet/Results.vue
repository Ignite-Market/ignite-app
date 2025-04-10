<template>
  <div class="border-1 border-grey-lighter bg-grey-light rounded-lg p-8 flex flex-col justify-center items-center">
    <div class="font-normal text-[16px] leading-[24px] text-white/80">Outcome winner</div>
    <div class="w-[64px] h-[64px] flex-shrink-0 mt-5">
      <Image :src="outcome.imgUrl" class="rounded-[48px] w-full h-full object-cover" />
    </div>

    <div class="font-bold text-[16px] leading-[24px] mt-2">{{ outcome.name }}</div>
    <div v-if="canClaim" class="w-[70%] border-b-1 border-grey-lighter pt-5"></div>

    <div class="flex flex-col">
      <div v-if="canClaim" class="flex items-center justify-center mt-5">
        <NuxtIcon name="icon/points" class="text-primary text-[17px]" />
        <div class="ml-[4px] text-[14px] leading-[20px] font-medium mr-5 text-white/60">
          {{ formatCollateralAmount(claimBalance, tokenStore.decimals, 2) }} {{ tokenStore.symbol }}
        </div>
        <BasicButton :loading="loading" size="small" class="py-[6px] px-[10px]" @click="claimWinnings">
          Claim
        </BasicButton>
      </div>

      <!-- TODO: we should probably show the funding value? -->
      <div v-if="canWithdrawFunding" class="flex items-center justify-center mt-5 w-full">
        <BasicButton
          :loading="loading"
          :class="['bg-statusBlue hover:bg-statusBlue-hover']"
          class="py-[6px] px-[10px] w-full"
          size="small"
          @click="withdrawFunding"
        >
          Withdraw Funding
        </BasicButton>
      </div>
    </div>
  </div>

  <!-- CONFIRM TRANSACTION MODAL -->
  <n-modal
    v-model:show="showTransactionModal"
    preset="card"
    class="w-[400px] border-none"
    :mask-closable="false"
    :close-on-esc="false"
    :closable="false"
  >
    <div v-if="selectedAction === SelectedAction.WITHDRAW_FUNDING" class="flex flex-col mt-4">
      <div class="flex w-full items-center justify-center mb-2">
        <NuxtIcon name="icon/coins" class="text-primary text-[56px]" />
      </div>
      <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Withdraw funding</div>
    </div>

    <div v-else class="flex flex-col mt-4">
      <div class="flex w-full items-center justify-center mb-4">
        <div class="w-[56px] h-[56px] flex-shrink-0">
          <Image :src="outcome.imgUrl" class="rounded-[78px] w-full h-full object-cover" />
        </div>
      </div>
      <div class="flex items-center justify-center text-[14px] leading-[20px]">
        Claim winnings for outcome&nbsp;
        <span class="font-extrabold"> {{ outcome.name }} </span>:
      </div>
      <span class="flex items-center justify-center text-[14px] leading-[20px] font-bold text-statusGreen mt-3">
        {{ formatCollateralAmount(claimBalance, tokenStore.decimals, 2) }} {{ tokenStore.symbol }}
      </span>
    </div>

    <div class="flex items-center py-4 pb-0 mt-4 font-semibold px-1 border-t-1 border-t-grey-lighter">
      Confirm transaction

      <div class="ml-auto">
        <div class="w-[17px] h-[17px] flex justify-center items-center ml-auto">
          <div class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </n-modal>

  <!-- TRANSACTION SUCCESS MODAL -->
  <Modal v-model:show="showSuccessModal" class="w-[320px] border-none">
    <div class="flex flex-col items-center">
      <ConfettiExplosion
        :stage-width="1000"
        :stage-height="1500"
        :duration="3000"
        :force="0.3"
        :particle-count="100"
        :colors="[
          colors.primary.DEFAULT,
          colors.primary.bright,
          colors.primary.dark,
          colors.primary.light,
          colors.primary.hover,
        ]"
      />

      <div class="flex w-full items-center justify-center mb-2">
        <NuxtIcon name="icon/check" class="text-primary text-[40px]" />
      </div>
      <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Congratulations!</div>

      <div v-if="selectedAction === SelectedAction.CLAIM" class="flex flex-col items-center justify-center mt-5">
        <div class="text-center">You have claimed your reward of:</div>
        <span class="flex items-center justify-center text-[14px] leading-[20px] font-bold text-statusGreen mt-3">
          {{ obtainedAmount }} {{ tokenStore.symbol }}
        </span>
      </div>

      <div v-else class="flex flex-col items-center justify-center mt-5">
        <div class="text-center">You have removed your funding and obtained a reward of:</div>
        <span class="flex items-center justify-center text-[14px] leading-[20px] font-bold text-statusGreen my-3">
          {{ obtainedFeeReward }} {{ tokenStore.symbol }}
        </span>
        <div class="text-center">You can now also claim your remaining funding of:</div>
        <span class="flex items-center justify-center text-[14px] leading-[20px] font-bold text-statusGreen my-3">
          {{ obtainedAmount }} {{ tokenStore.symbol }}
        </span>
      </div>

      <BasicButton class="w-full font-bold mt-5" type="primary" :size="'large'" @click="showSuccessModal = false">
        Close
      </BasicButton>

      <BasicButton
        v-if="transactionHash"
        class="w-full font-bold mt-3"
        type="secondary"
        :size="'medium'"
        @click="openExplorer(transactionHash)"
      >
        Transaction
      </BasicButton>
    </div>
  </Modal>
</template>

<script lang="ts" setup>
import type { Address } from 'viem';
import { useAccount } from '@wagmi/vue';
import ConfettiExplosion from 'vue-confetti-explosion';
import type { OutcomeInterface } from '~/lib/types/prediction-set';
import { colors } from '~/tailwind.config';

enum SelectedAction {
  CLAIM = 1,
  WITHDRAW_FUNDING = 2,
}

const { getConditionalBalance, claim } = useConditionalToken();
const { getFundingBalance, removeFunding } = useFixedMarketMaker();
const { ensureCorrectNetwork } = useContracts();
const { getTokenStore } = useCollateralToken();
const { address } = useAccount();
const tokenStore = getTokenStore();
const userStore = useUserStore();
const message = useMessage();
const txWait = useTxWait();

const props = defineProps({
  contractAddress: { type: String as PropType<Address>, default: null, required: true },
  conditionId: { type: String, default: null, required: true },
  outcome: { type: Object as PropType<OutcomeInterface>, default: () => {}, required: true },
});

const claimBalance = ref(BigInt(0));
const fundingBalance = ref(BigInt(0));

const showTransactionModal = ref(false);
const showSuccessModal = ref(false);
const selectedAction = ref();
const loading = ref(false);

const obtainedAmount = ref();
const obtainedFeeReward = ref();
const transactionHash = ref('');

onMounted(async () => {
  await updateClaimBalance();
  await updateFundingBalance();
});

watch(
  () => userStore.loggedIn,
  async _ => {
    await updateClaimBalance();
    await updateFundingBalance();
  },
  { immediate: true }
);

const canClaim = computed(() => {
  return claimBalance.value > BigInt(0);
});

const canWithdrawFunding = computed(() => {
  return fundingBalance.value > BigInt(0);
});

async function updateClaimBalance() {
  claimBalance.value = await getConditionalBalance(props.outcome.positionId);
}

async function updateFundingBalance() {
  fundingBalance.value = await getFundingBalance(props.contractAddress);
}

/**
 * Claim winnings.
 */
async function claimWinnings() {
  obtainedAmount.value = '';

  await updateClaimBalance();

  if (!claimBalance.value || !canClaim.value) {
    return;
  }

  selectedAction.value = SelectedAction.CLAIM;
  showTransactionModal.value = true;
  loading.value = true;
  try {
    await ensureCorrectNetwork();

    txWait.hash.value = await claim(props.conditionId, props.outcome.outcomeIndex);
    const receipt = await txWait.wait();

    if (receipt.status === 'success') {
      const parsed = parseTransfersERC20(receipt);
      if (parsed.length) {
        const event = parsed.find((e: any) => e.to === address.value);
        obtainedAmount.value = formatCollateralAmount(event.amount, tokenStore.decimals, 2);
      }

      showSuccessModal.value = true;
      transactionHash.value = receipt?.data?.transactionHash || '';
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }

    await updateClaimBalance();
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
    showTransactionModal.value = false;
  }
}

/**
 * Withdraw funding.
 */
async function withdrawFunding() {
  obtainedFeeReward.value = '';
  obtainedAmount.value = '';

  await updateFundingBalance();

  if (!fundingBalance.value || !canWithdrawFunding.value) {
    return;
  }

  selectedAction.value = SelectedAction.WITHDRAW_FUNDING;
  showTransactionModal.value = true;
  loading.value = true;
  try {
    await ensureCorrectNetwork();

    txWait.hash.value = await removeFunding(props.contractAddress, fundingBalance.value);
    const receipt = await txWait.wait();

    if (receipt.status === 'success') {
      const parsed = parseTransfersERC20(receipt);
      if (parsed.length) {
        const event = parsed.find((e: any) => e.to === address.value);
        if (event) {
          obtainedFeeReward.value = formatCollateralAmount(event.amount, tokenStore.decimals, 2);
        }
      }

      const parsedBatchTransfer = parseBatchTransfer1155(receipt);
      if (parsedBatchTransfer.length) {
        const event = parsedBatchTransfer.find((e: any) => e.to === address.value);
        if (event) {
          const index = event?.ids?.findIndex((id: string) => id === props.outcome.positionId) || 0;
          const amount = event.values[index] || 0;
          obtainedAmount.value = formatCollateralAmount(amount, tokenStore.decimals, 2);
        }
      }

      showSuccessModal.value = true;
      transactionHash.value = receipt?.data?.transactionHash || '';
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }

    await updateFundingBalance();
    await updateClaimBalance();
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
    showTransactionModal.value = false;
  }
}

function openExplorer(txHash: string) {
  const explorer = getExplorer();

  window.open(`${explorer}/tx/${txHash}`, '_blank');
}
</script>
