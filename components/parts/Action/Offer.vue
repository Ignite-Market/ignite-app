<script lang="ts" setup>
import type { TimeValidator } from 'naive-ui/es/date-picker/src/interface';
import { OfferStatus, type AnyOfferRequest } from '~/lib/types/offer';
import { WEEK_IN_MS } from '~/lib/values/general.values';

const emit = defineEmits(['done']);
const props = defineProps({
  offerRequest: { type: Object as PropType<AnyOfferRequest>, required: true },
});

const router = useRouter();
const message = useMessage();
const { labelInfo } = useContent();
const { getTokenBalance, getTokenStore } = useToken();
const { checkAllowance, selectOfferRequest } = useOffer();

const tokenStore = getTokenStore();
const enoughFunds = ref<boolean>(false);
const offerExpiration = ref<number>(Date.now() + WEEK_IN_MS);
const loading = reactive({
  balance: true,
  allowance: false,
  confirm: false,
});

const amount = computed(() => Math.round(Number(props.offerRequest.loanAmount) * 1.01));
const enoughBalance = computed(() => bigIntToNum(tokenStore.balance) > amount.value);

onMounted(async () => {
  try {
    tokenStore.balance = await getTokenBalance();
  } catch (e) {
    console.error(e);
    tokenStore.balance = BigInt(0);
  }

  if (enoughBalance.value) {
    checkIfEnoughFunds();
  }
  loading.balance = false;
});

async function checkIfEnoughFunds() {
  loading.allowance = true;
  try {
    enoughFunds.value = await checkAllowance(numToBigInt(amount.value));
  } catch (e) {
    console.error(e);
    message.warning('Failed to increase allowance. Please try later or contact support');
  }
  loading.allowance = false;
}

async function confirm() {
  if (!offerExpiration.value) {
    message.warning('Please select date');
    return;
  } else if (offerExpiration.value < Date.now()) {
    message.warning('Please select a future date');
    return;
  }
  loading.confirm = true;

  try {
    const offer = await selectOfferRequest(props.offerRequest, Math.floor(offerExpiration.value / 1000));

    if (offer) {
      message.success('Offer created');
      emit('done');
      router.push({ name: 'offers', query: { status: OfferStatus.PUBLISHED } });
    } else {
      message.warning('Failed to create offer. Please try later or contact support');
    }
  } catch (e) {
    console.error(e);
    message.error('Failed to create offer. Please try later or contact support');
  }

  loading.confirm = false;
}

function disablePastDate(ts: number) {
  return ts < new Date().setHours(0, 0, 0, 0);
}

function disablePastTime(ts: number): TimeValidator {
  return {
    isHourDisabled: (hour: number) => ts < Date.now(),
    isMinuteDisabled: (minute: number, hour: number | null) => ts < Date.now(),
    isSecondDisabled: (second: number, minute: number | null, hour: number | null) => ts < Date.now(),
  };
}
</script>

<template>
  <div v-if="loading.balance" class="min-h-20">
    <Spinner />
  </div>
  <div v-else class="mb-8">
    <div class="mb-6 text-center font-serif uppercase">
      <h3 class="mb-1 text-xl font-semibold">Select offer request</h3>
    </div>
    <ProcessStep
      v-if="enoughBalance"
      :loading="loading.allowance"
      :done="enoughFunds"
      :step="1"
      title="Allowance"
      description="You'll be asked to increase allowance if needed."
      text-action="Allowance"
      text-done="Enough funds"
      class="mb-6"
      @action="checkIfEnoughFunds()"
    />
    <ProcessStep
      v-else
      :loading="loading.allowance"
      :disabled="true"
      :step="1"
      title="Balance"
      description="Your balance is too low."
      text-action="Balance"
      class="mb-6"
    />
    <ProcessStep
      :disabled="!enoughFunds"
      :loading="loading.confirm"
      :loading-action="loading.confirm"
      :step="2"
      title="Create Offer"
      text-action="Confirm"
      @action="confirm()"
    >
      <n-form label-placement="left" @submit.prevent="">
        <n-form-item
          path="offerExpiration"
          :label="labelInfo('offerExpiration') as string"
          :label-props="{ for: 'offerExpiration' }"
          :show-feedback="false"
        >
          <n-date-picker
            v-model:value="offerExpiration"
            type="datetime"
            :input-props="{ id: 'offerExpiration' }"
            :placeholder="$t('form.placeholder.date')"
            :is-date-disabled="disablePastDate"
            :is-time-disabled="disablePastTime"
            clearable
          />
        </n-form-item>
      </n-form>
    </ProcessStep>
  </div>
</template>
