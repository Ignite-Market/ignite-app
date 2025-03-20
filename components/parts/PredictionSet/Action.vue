<template>
  <n-card
    class="bg-grey border-1 !border-grey-lighter"
    :content-class="'!py-5 !pb-5 !pt-4 !rounded-[8px]'"
    :header-class="'!py-5 !px-6 bg-grey-dark !rounded-t-[8px]'"
  >
    <template #header>
      <div v-if="selectedTab === TransactionType.FUND" class="flex items-center justify-center">
        <div class="text-[12px] leading-[16px] pt-[19px] pb-[19px]">Fund this market</div>
      </div>
      <div v-else class="bg-grey-light rounded-[8px] p-3 flex flex-row items-center justify-center">
        <div class="w-[30px] h-[30px] flex-shrink-0">
          <img class="rounded-[48px] w-full h-full object-cover" src="https://app-dev.ignitemarket.xyz/favicon.png" />
        </div>
        <div class="ml-2 text-[12px] leading-[16px] font-bold">{{ outcome.name }}</div>
        <div class="text-[12px] leading-[16px] font-bold ml-auto">
          {{ pricePerShare ? (pricePerShare * 100).toFixed(0) : 0.0 }} %
        </div>

        <div
          class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-dark ml-[10px] cursor-pointer"
          @click="refreshBalances"
        >
          <NuxtIcon class="opacity-[24%] hover:opacity-[100%] text-white" name="icon/refresh" />
        </div>

        <n-popover trigger="hover" raw :show-arrow="false" placement="bottom-end">
          <template #trigger>
            <div
              class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-dark ml-[10px] cursor-pointer"
            >
              <NuxtIcon class="hover:text-white text-white" name="icon/settings" />
            </div>
          </template>
          <div class="flex flex-col bg-grey-dark border-1 !border-grey-lighter px-4 pt-2 pb-4 rounded-[8px]">
            <div class="mb-2">Slippage</div>
            <div class="flex gap-x-2">
              <BasicButton
                class=""
                size="large"
                type="secondary"
                :btn-class="['w-[70px] flex justify-center items-center']"
                :selected="slippage === 0.5"
                :selected-class="['!bg-primary !border-primary']"
                @click="slippage = 0.5"
              >
                0.5%
              </BasicButton>

              <BasicButton
                size="large"
                type="secondary"
                :btn-class="['w-[70px] flex justify-center items-center']"
                :selected="slippage === 1"
                :selected-class="['!bg-primary !border-primary']"
                @click="slippage = 1"
              >
                1%
              </BasicButton>

              <BasicButton
                class=""
                size="large"
                type="secondary"
                :btn-class="['w-[70px] flex justify-center items-center']"
                :selected="slippage === 3"
                :selected-class="['!bg-primary !border-primary']"
                @click="slippage = 3"
              >
                3%
              </BasicButton>

              <n-input-number v-model:value="slippage" :show-button="false" :max="100" :min="0" class="w-[70px]">
                <template #suffix>%</template>
              </n-input-number>
            </div>
          </div>
        </n-popover>
      </div>
    </template>
    <div class="tabs-wrapper">
      <n-tabs
        v-model:value="selectedTab"
        type="line"
        animated
        :theme-overrides="{
          tabTextColorActiveLine: '#F5F5F5',
        }"
      >
        <!-- BUY PANE -->
        <n-tab-pane
          :disabled="!tradeEnabled(status, endTime) || loading"
          :name="TransactionType.BUY"
          class="!pt-[33px]"
          tab="Buy"
        >
          <div class="mb-3">
            <div class="flex flex-row text-[12px] leading-[16px] mb-2">
              <div class="font-bold">Amount</div>
              <div class="ml-auto flex font-medium">
                <div class="text-grey-lightest">Balance:</div>
                <div class="text-white/80 ml-1">{{ tokenStore.parsedBalance }} {{ tokenStore.symbol }}</div>
              </div>
            </div>

            <n-input-number
              v-model:value="amount"
              placeholder="0"
              size="large"
              class="min-w-full text-center"
              type="number"
              :show-button="true"
              :max="tokenStore.parsedBalance"
              button-placement="both"
              :disabled="loading"
              :validator="buyValidator"
              @blur="onBuyBlur"
            >
              <template #minus-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/minus" />
                </div>
              </template>

              <template #add-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/plus" />
                </div>
              </template>
            </n-input-number>
            <div v-if="buyError" class="text-statusRed mt-1">
              {{ buyError }}
            </div>
          </div>

          <BasicButton
            class="w-full"
            :btn-class="[' !font-bold']"
            :size="'large'"
            :disabled="!isConnected || !enoughCollateralBalance"
            :loading="loading"
            @click="buyOutcome"
          >
            Buy
          </BasicButton>

          <div class="text-[16px] leading-[24px] text-grey-lightest font-normal mt-6">
            <div class="flex items-center justify-center">
              <div>Avg price</div>
              <div class="ml-auto text-primary">
                {{ pricePerShare ? pricePerShare.toFixed(3) : 0.0 }} {{ tokenStore.symbol }}
              </div>
            </div>
            <div class="flex items-center justify-center mt-2">
              <div>Shares (receive at least)</div>
              <div class="ml-auto text-white/80">{{ returnAmount }}</div>
            </div>
            <div class="flex items-center justify-center mt-2">
              <div>Potential return</div>
              <div class="ml-auto text-statusGreen">{{ potentialReturn }} {{ tokenStore.symbol }}</div>
            </div>
          </div>
        </n-tab-pane>

        <!-- SELL PANE -->
        <n-tab-pane
          :disabled="!tradeEnabled(status, endTime) || loading"
          :name="TransactionType.SELL"
          class="!pt-[33px]"
          tab="Sell"
        >
          <div class="mb-3">
            <div class="flex flex-row text-[12px] leading-[16px] mb-2">
              <div class="font-bold">Amount</div>
              <div class="ml-auto flex font-medium">
                <div class="text-grey-lightest">Balance:</div>
                <div class="text-white/80 ml-1">{{ parseConditionalBalance(conditionalBalance) }}</div>
              </div>
            </div>

            <n-input-number
              v-model:value="amount"
              placeholder="0"
              min="0"
              size="large"
              class="min-w-full text-center"
              type="number"
              :show-button="true"
              button-placement="both"
              :max="parseConditionalBalance(conditionalBalance)"
              :disabled="loading"
            >
              <template #minus-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/minus" />
                </div>
              </template>

              <template #add-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/plus" />
                </div>
              </template>
            </n-input-number>
          </div>

          <BasicButton
            :disabled="!isConnected || !enoughConditionalBalance"
            class="w-full"
            :btn-class="[' !font-bold']"
            :size="'large'"
            :loading="loading"
            @click="sellOutcome"
          >
            Sell
          </BasicButton>

          <div class="text-[16px] leading-[24px] text-grey-lightest font-normal mt-6">
            <div class="flex items-center justify-center">
              <div>Avg price</div>
              <div class="ml-auto text-primary">
                {{ pricePerShare ? pricePerShare.toFixed(3) : 0.0 }} {{ tokenStore.symbol }}
              </div>
            </div>
            <div class="flex items-center justify-center mt-2">
              <div>Potential return</div>
              <div class="ml-auto text-statusGreen">{{ potentialReturn }} {{ tokenStore.symbol }}</div>
            </div>
          </div>
        </n-tab-pane>

        <!-- FUNDING PANE -->
        <n-tab-pane :disabled="!isFundEnabled || loading" :name="TransactionType.FUND" class="!pt-[33px]" tab="Fund">
          <div class="mb-3">
            <div class="flex flex-row text-[12px] leading-[16px] mb-2">
              <div class="font-bold">Amount</div>
              <div class="ml-auto flex font-medium">
                <div class="text-grey-lightest">Balance:</div>
                <div class="text-white/80 ml-1">{{ tokenStore.parsedBalance }} {{ tokenStore.symbol }}</div>
              </div>
            </div>

            <n-input-number
              v-model:value="amount"
              placeholder="0"
              min="0"
              size="large"
              class="min-w-full text-center"
              type="number"
              :show-button="true"
              button-placement="both"
              :max="tokenStore.parsedBalance"
              :disabled="loading"
            >
              <template #minus-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/minus" />
                </div>
              </template>

              <template #add-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/plus" />
                </div>
              </template>
            </n-input-number>
          </div>

          <BasicButton
            class="w-full"
            :btn-class="['bg-statusBlue hover:bg-statusBlue-hover !font-bold']"
            :size="'large'"
            :disabled="!isConnected || !enoughCollateralBalance || !isFundEnabled"
            :loading="loading"
            @click="fund"
          >
            Fund
          </BasicButton>
        </n-tab-pane>
      </n-tabs>
    </div>
  </n-card>

  <Modal v-model:show="showSuccessModal" class="w-[320px] border-none">
    <div class="flex flex-col">
      <div class="flex w-full items-center justify-center mb-2">
        <NuxtIcon name="icon/check" class="text-primary text-[40px]" />
      </div>
      <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Success!</div>

      <div class="flex flex-col items-center justify-center mt-5">
        <div v-if="selectedTab === TransactionType.FUND" class="text-center">
          You have successfully funded this market.
        </div>
        <div v-else class="flex flex-col items-center justify-center text-center">
          <div>You have successfully {{ selectedTab === TransactionType.BUY ? 'bought' : 'sold' }} outcome:</div>
          <div class="my-4 uppercase font-extrabold text-[18px]">{{ outcome.name }}</div>
        </div>
      </div>

      <BasicButton
        v-if="transactionHash"
        class="w-full font-bold mt-5"
        :size="'large'"
        @click="openExplorer(transactionHash)"
      >
        Transaction
      </BasicButton>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import type { Address } from 'viem';
import { useAccount } from '@wagmi/vue';
import type { OutcomeInterface } from '~/lib/types/prediction-set';
import { PredictionSetStatus, TransactionType } from '~/lib/types/prediction-set';

const props = defineProps({
  contractAddress: { type: String as PropType<Address>, default: null, required: true },
  outcome: { type: Object as PropType<OutcomeInterface>, default: () => {}, required: true },
  status: { type: Number as PropType<PredictionSetStatus>, default: null, required: true },
  action: { type: Number as PropType<TransactionType>, default: null, required: false },
  endTime: { type: String, default: null, required: false },
  outcomes: { type: Array as PropType<OutcomeInterface[]>, default: () => [], required: true },
  defaultValue: { type: Number, default: 0 },
});

const { getMinTokensToBuy, addFunding, buy, sell, calcSellAmountInCollateral, getPricePerShare, getTotalFunding } =
  useFixedMarketMaker();
const { refreshCollateralBalance, getTokenStore } = useCollateralToken();
const { getConditionalBalance, parseConditionalBalance } = useConditionalToken();
const { ensureCorrectNetwork } = useContracts();
const { isConnected } = useAccount();
const message = useMessage();
const txWait = useTxWait();
const tokenStore = getTokenStore();

const selectedTab = ref(TransactionType.BUY);
const isFundEnabled = ref(true);
const slippage = ref(3);
const loading = ref(false);
const amount = ref<number>(props.defaultValue);
const returnAmount = ref<string>('0.0');
const potentialReturn = ref<string>('0.0');
const conditionalBalance = ref(BigInt(0));
const pricePerShare = ref(0.0);
const totalFundAmount = ref(BigInt(0));

const showSuccessModal = ref(false);
const transactionHash = ref('');

const buyError = ref('');

const buyValidator = (x: number) => {
  if (x > buyFundLimit.value) {
    // Because input is calling -1 +1 for buttons
    if (amount.value !== x - 1) {
      buyError.value = `Value can not exceed 10% of funding`;
    }
  } else buyError.value = '';
  return x >= 0 && x <= buyFundLimit.value;
};

const onBuyBlur = () => {
  if (buyError.value) {
    amount.value = buyFundLimit.value;
    buyError.value = '';
  }
};

watch(
  () => props.defaultValue,
  defaultValue => {
    amount.value = defaultValue;
  }
);

const enoughConditionalBalance = computed(() => {
  const scaledAmount = BigInt(Math.round((amount.value || 0) * 10 ** tokenStore.decimals));
  return conditionalBalance.value >= scaledAmount;
});

const enoughCollateralBalance = computed(() => {
  const scaledAmount = BigInt(Math.round((amount.value || 0) * 10 ** tokenStore.decimals));
  return tokenStore.balance >= scaledAmount;
});

const buyFundLimit = computed(() => {
  let max = (BigInt(totalFundAmount.value) * 10n) / 100n;
  if (tokenStore.balance < max) {
    max = tokenStore.balance;
  }
  return bigIntToNum(max, 6);
});

onMounted(async () => {
  if (props.status === PredictionSetStatus.FUNDING) {
    selectedTab.value = TransactionType.FUND;
  } else if (props.action) {
    selectedTab.value = props.action;
  }

  await refreshCollateralBalance();
  totalFundAmount.value = await getTotalFunding(props.contractAddress);
});

watchEffect(async () => {
  if (props.outcome.positionId) {
    conditionalBalance.value = await getConditionalBalance(props.outcome.positionId);
    pricePerShare.value = await getPricePerShare(props.contractAddress, props.outcome.outcomeIndex);
  }
});

watch(
  () => props.action,
  () => {
    selectedTab.value = props.action;
  }
);

watchDebounced(
  () => amount.value,
  async () => {
    if (amount.value === 0) {
      returnAmount.value = '0.0';
      potentialReturn.value = '0.0';
      return;
    }

    if (!amount.value) {
      returnAmount.value = '0.0';
      potentialReturn.value = '0.0';
      return;
    }

    if (selectedTab.value === TransactionType.BUY) {
      await updateBuyAmount();
    } else if (selectedTab.value === TransactionType.SELL) {
      await updateSellAmount();
    }
  },
  { debounce: 500, maxWait: 1000 }
);

watchDebounced(
  () => slippage.value,
  async () => {
    if (!slippage.value) {
      slippage.value = 0;
    }

    if (amount.value === 0) {
      returnAmount.value = '0.0';
      return;
    }

    if (!amount.value) {
      returnAmount.value = '0.0';
      return;
    }

    if (selectedTab.value === TransactionType.BUY) {
      await updateBuyAmount();
    } else if (selectedTab.value === TransactionType.SELL) {
      await updateSellAmount();
    }
  },
  { debounce: 500, maxWait: 1000 }
);

watch(
  () => selectedTab.value,
  async () => {
    if (selectedTab.value === TransactionType.BUY) {
      await updateBuyAmount();
    } else if (selectedTab.value === TransactionType.SELL) {
      await updateSellAmount();
    }
  }
);

async function updateBuyAmount() {
  if (!amount.value) {
    return;
  }

  const { minTokensToBuy, minTokensToBuyNoSlippage } = await getMinTokensToBuy(
    props.contractAddress,
    amount.value,
    props.outcome.outcomeIndex,
    slippage.value
  );

  returnAmount.value = (Number(minTokensToBuy) / Math.pow(10, tokenStore.decimals)).toString();
  potentialReturn.value = (Number(minTokensToBuyNoSlippage) / Math.pow(10, tokenStore.decimals)).toFixed(3);
}

async function updateSellAmount() {
  if (!amount.value) {
    return;
  }

  const result = await calcSellAmountInCollateral(
    amount.value,
    props.outcome.outcomeIndex,
    props.contractAddress,
    props.outcomes.map(o => o.positionId)
  );

  potentialReturn.value = (Number(result) / Math.pow(10, tokenStore.decimals)).toString();
}

async function fund() {
  if (!amount.value) {
    return;
  }

  loading.value = true;
  try {
    await refreshCollateralBalance();

    if (!enoughCollateralBalance.value) {
      return;
    }

    await ensureCorrectNetwork();

    txWait.hash.value = await addFunding(props.contractAddress, amount.value);
    const receipt = await txWait.wait();

    if (receipt.status === 'success') {
      showSuccessModal.value = true;
      transactionHash.value = receipt?.data?.transactionHash || '';
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }

    amount.value = 0 as any;
    await refreshCollateralBalance();
    await refreshBalances();
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
  }
}

async function sellOutcome() {
  if (!amount.value) {
    return;
  }

  loading.value = true;
  try {
    conditionalBalance.value = await getConditionalBalance(props.outcome.positionId);
    if (!enoughConditionalBalance.value) {
      return;
    }

    await ensureCorrectNetwork();

    const collateralAmount = await calcSellAmountInCollateral(
      amount.value,
      props.outcome.outcomeIndex,
      props.contractAddress,
      props.outcomes.map(o => o.positionId)
    );

    txWait.hash.value = await sell(props.contractAddress, collateralAmount, props.outcome.outcomeIndex, slippage.value);
    const receipt = await txWait.wait();

    if (receipt.status === 'success') {
      showSuccessModal.value = true;
      transactionHash.value = receipt?.data?.transactionHash || '';
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }

    console.log(collateralAmount);

    amount.value = 0 as any;
    await refreshBalances();
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
  }
}

async function buyOutcome() {
  if (!amount.value) {
    return;
  }

  loading.value = true;
  try {
    await refreshCollateralBalance();
    if (buyFundLimit.value < amount.value || !enoughCollateralBalance.value) {
      return;
    }

    await ensureCorrectNetwork();

    txWait.hash.value = await buy(props.contractAddress, amount.value, props.outcome.outcomeIndex, slippage.value);
    const receipt = await txWait.wait();
    console.log(receipt);

    if (receipt.status === 'success') {
      showSuccessModal.value = true;
      transactionHash.value = receipt?.data?.transactionHash || '';
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }

    amount.value = 0 as any;
    await refreshBalances();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}

function openExplorer(txHash: string) {
  const explorer = getExplorer();

  window.open(`${explorer}/tx/${txHash}`, '_blank');
}

async function refreshBalances() {
  try {
    await refreshCollateralBalance();
    conditionalBalance.value = await getConditionalBalance(props.outcome.positionId);
    pricePerShare.value = await getPricePerShare(props.contractAddress, props.outcome.outcomeIndex);
    totalFundAmount.value = await getTotalFunding(props.contractAddress);
  } catch (error) {}
}
</script>

<style scoped>
.tabs-wrapper :deep(.n-tabs-nav) {
  position: relative;
}

.tabs-wrapper :deep(.n-tabs-nav::before) {
  content: '';
  position: absolute;
  bottom: 0;
  left: -24px;
  right: -24px;
  height: 1px;
  background-color: var(--n-tab-border-color);
}

.tabs-wrapper :deep(.n-tabs-bar) {
  bottom: 0 !important;
}

.tabs-wrapper :deep(.n-tabs .n-tabs-nav.n-tabs-nav--line-type.n-tabs-nav--top .n-tabs-nav-scroll-content) {
  border-bottom: none;
}
</style>
