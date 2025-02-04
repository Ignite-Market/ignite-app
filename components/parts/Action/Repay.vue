<script lang="ts" setup>
import { parseAssetFromOffer } from '~/lib/misc/parsers';
import { OfferStatus, type AnyOffer } from '~/lib/types/offer';
import { calcLoanDuration } from '~/lib/utils/helpers';

const emit = defineEmits(['repayed']);
const props = defineProps({
  loan: { type: Object as PropType<AnyOffer>, required: true },
});

const message = useMessage();
const offerStore = useOfferStore();
const txWait = useTxWait();
const { ensureCorrectNetwork } = useContracts();
const { repayLoan } = useLendeeFi();
const { checkAllowance } = useOffer();
const { getTokenBalance, getTokenStore } = useToken();
const { calcCosts } = useWormhole();

const tokenStore = getTokenStore();
const enoughFunds = ref<boolean>(false);
const modalRepayVisible = ref<boolean>(false);
const loading = reactive({
  allowance: false,
  repay: false,
});

const repayAmount = ref(
  calcRepayAmount(Number(props.loan.loanAmount), props.loan.interestRate, calcLoanDuration(props.loan))
);
const enoughBalance = computed(() => bigIntToNum(tokenStore.balance) > bigIntToNum(repayAmount.value));

async function openModal() {
  modalRepayVisible.value = true;

  await ensureCorrectNetwork(props.loan.loanChainId);

  if (enoughBalance.value) {
    checkIfEnoughFunds();
  }
}

async function checkIfEnoughFunds() {
  loading.allowance = true;
  try {
    enoughFunds.value = await checkAllowance(BigInt(repayAmount.value));
  } catch (e) {
    console.error(e);
    message.warning('Failed to increase allowance. Please try later or contact support');
  }
  loading.allowance = false;
}

async function repay() {
  loading.repay = true;
  try {
    const asset = parseAssetFromOffer(props.loan);
    const costs = await calcCosts(props.loan.loanChainId, asset.chainId);

    console.debug(props.loan.loanHash, costs);
    txWait.hash.value = await repayLoan(props.loan.loanHash, costs);

    const receipt = await txWait.wait();
    console.debug(receipt);
    if (receipt) {
      message.success('Loan successfully repaid');
      offerStore.updateOfferStatusByLoanHash(props.loan.loanHash, OfferStatus.LOAN_REPAID);

      tokenStore.balance = await getTokenBalance();
      console.log(tokenStore.balance);

      emit('repayed');
    }

    modalRepayVisible.value = false;
  } catch (e) {
    console.error(e);
    message.error(contractError(e));
  } finally {
    loading.repay = false;
  }
}
</script>

<template>
  <Btn @click="openModal">Repay</Btn>

  <modal v-model:show="modalRepayVisible">
    <div class="mb-8">
      <div class="mb-6 text-center font-serif uppercase">
        <h3 class="mb-1 text-xl font-semibold">Repay loan</h3>
      </div>

      <ProcessStep
        :loading="loading.allowance"
        :disabled="!enoughBalance"
        :done="enoughFunds"
        :step="1"
        :title="enoughBalance ? 'Allowance' : 'Balance'"
        :description="enoughBalance ? 'You\'ll be asked to increase allowance if needed.' : 'Your balance is too low.'"
        :text-action="enoughBalance ? 'Allowance' : 'Balance'"
        text-done="Enough funds"
        class="mb-6"
        @action="checkIfEnoughFunds()"
      />

      <ProcessStep
        :disabled="!enoughFunds"
        :loading="loading.repay"
        :loading-action="loading.repay"
        :step="2"
        title="Repay loan"
        text-action="Confirm"
        @action="repay()"
      />
    </div>
  </modal>
</template>
