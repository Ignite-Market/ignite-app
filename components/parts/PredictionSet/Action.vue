<template>
  <n-card
    class="bg-grey border-1 !border-grey-lighter"
    :class="isMd ? 'h-auto' : 'h-[440px]'"
    :content-class="'!py-5 !pb-5 !pt-4 !rounded-[8px]'"
    :header-class="'!py-5 !px-6 bg-grey-dark !rounded-t-[8px]'"
  >
    <template #header>
      <div v-if="selectedTab === TransactionType.FUND" class="flex items-center justify-center">
        <div class="text-[12px] leading-[16px] pt-[19px] pb-[19px]">Fund this market</div>
        <IconInfo
          size="sm"
          tooltip="Provide liquidity to earn trading fees and profit from market movement. </br> You can withdraw funding and claim rewards when the market closes.</br> Learn more about <a href='https://docs.ignitemarket.xyz/' target='_blank' class='underline'>funding the markets.</a>"
        />
      </div>
      <div v-else class="bg-grey-light rounded-[8px] p-3 flex flex-row items-center justify-center">
        <div class="w-[30px] h-[30px] flex-shrink-0">
          <Image :src="outcome.imgUrl" class="rounded-[48px] w-full h-full object-cover" />
        </div>
        <div class="ml-2 text-[12px] leading-[16px] font-bold">{{ outcome.name }}</div>
        <div class="text-[12px] leading-[16px] font-bold ml-auto">{{ (outcome.latestChance * 100).toFixed(0) }} %</div>

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

              <n-input-number
                v-model:value="slippage"
                :show-button="false"
                :max="100"
                :min="0"
                :precision="2"
                class="w-[70px]"
              >
                <template #suffix>%</template>
              </n-input-number>
            </div>
            <div class="text-[12px] text-grey-lightest mt-3 leading-[16px]">
              Slippage tolerance is the maximum price change you<br />
              are willing to accept. Higher percentages may help<br />
              transactions succeed during high market volatility.
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
                <div class="text-white/80 ml-1">{{ collateralToken.parsedBalance }} {{ collateralToken.symbol }}</div>
              </div>
            </div>

            <n-input-number
              v-model:value="amount"
              placeholder="0"
              size="large"
              class="min-w-full text-center"
              type="number"
              :show-button="true"
              :max="collateralToken.parsedBalance"
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

              <template #suffix>
                <div
                  class="w-[38px] h-[20px] rounded-[4px] flex items-center justify-center absolute right-[34px] top-1/2 -translate-y-1/2 text-xs bg-none hover:bg-grey-light cursor-pointer"
                  @click="setMaxBuyAmount"
                >
                  Max
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
            :btn-class="['!font-bold']"
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
                {{ pricePerShare ? pricePerShare.toFixed(3) : 0.0 }} {{ collateralToken.symbol }}
              </div>
            </div>
            <div class="flex items-center justify-center mt-2">
              <div>Shares (receive at least)</div>
              <div class="ml-auto text-white/80">{{ returnAmount }}</div>
            </div>
            <div class="flex items-center justify-center mt-2">
              <div>Potential return</div>
              <div class="ml-auto text-statusGreen">{{ potentialReturn }} {{ collateralToken.symbol }}</div>
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
                <div class="text-white/80 ml-1">
                  {{ parseConditionalBalance(conditionalBalance, props.collateralToken.decimals) }}
                </div>
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
              :max="parseConditionalBalance(conditionalBalance, props.collateralToken.decimals)"
              :validator="sellValidator"
              :disabled="loading"
              @blur="onSellBlur"
            >
              <template #minus-icon>
                <div
                  class="min-w-[20px] min-h-[20px] rounded-[4px] flex items-center justify-center bg-none hover:bg-grey-light"
                >
                  <NuxtIcon class="hover:text-white text-white" name="icon/minus" />
                </div>
              </template>

              <template #suffix>
                <div
                  class="w-[38px] h-[20px] rounded-[4px] flex items-center justify-center absolute right-[34px] top-1/2 -translate-y-1/2 text-xs bg-none hover:bg-grey-light cursor-pointer"
                  @click="setMaxSellAmount"
                >
                  Max
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
            <div v-if="sellError" class="text-statusRed mt-1">
              {{ sellError }}
            </div>
          </div>

          <BasicButton
            :disabled="!isConnected || !enoughConditionalBalance"
            class="w-full"
            :btn-class="['!font-bold']"
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
                {{ pricePerShare ? pricePerShare.toFixed(3) : 0.0 }} {{ collateralToken.symbol }}
              </div>
            </div>
            <div class="flex items-center justify-center mt-2">
              <div>Potential return</div>
              <div class="ml-auto text-statusGreen">{{ potentialReturn }} {{ collateralToken.symbol }}</div>
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
                <div class="text-white/80 ml-1">{{ collateralToken.parsedBalance }} {{ collateralToken.symbol }}</div>
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
              :max="collateralToken.parsedBalance"
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

      <div class="flex flex-col items-center justify-center mt-5">
        <div v-if="selectedTab === TransactionType.FUND" class="text-center mb-2">
          You have successfully funded this market for
          <span class="font-bold"> {{ givenAmount }} {{ collateralToken.symbol }} </span>.
        </div>
        <div v-else class="flex flex-col items-center justify-center text-center">
          <div v-if="selectedTab === TransactionType.BUY">
            You have successfully bought <span class="font-bold">{{ obtainedAmount }}</span> shares of outcome:
          </div>
          <div v-else>
            You have sold
            <span class="font-bold">
              {{ givenAmount }}
            </span>
            <span class="font-normal text-statusGreen"> ({{ obtainedAmount }} {{ collateralToken.symbol }})</span>
            shares of outcome:
          </div>

          <div class="flex w-full items-center justify-center mt-6">
            <div class="w-[56px] h-[56px] flex-shrink-0">
              <Image :src="outcome.imgUrl" class="rounded-[78px] w-full h-full object-cover" />
            </div>
          </div>
          <div class="my-4 uppercase font-extrabold text-[18px]">{{ outcome.name }}</div>
        </div>
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

  <!-- TRANSACTION TWO STEP MODAL -->
  <n-modal
    v-model:show="showTransactionModal"
    preset="card"
    class="w-[400px] border-none"
    :mask-closable="false"
    :close-on-esc="false"
    :closable="false"
  >
    <div v-if="selectedTab === TransactionType.FUND" class="flex flex-col mt-4">
      <div class="flex w-full items-center justify-center mb-2">
        <NuxtIcon name="icon/coins" class="text-primary text-[56px]" />
      </div>
      <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Fund market</div>
    </div>

    <div v-else class="flex flex-col mt-4">
      <div class="flex w-full items-center justify-center mb-4">
        <div class="w-[56px] h-[56px] flex-shrink-0">
          <Image :src="outcome.imgUrl" class="rounded-[78px] w-full h-full object-cover" />
        </div>
      </div>
      <div
        v-if="selectedTab === TransactionType.BUY"
        class="flex items-center justify-center text-[14px] leading-[20px]"
      >
        Buy&nbsp;
        <span class="font-extrabold">{{ outcome.name }}</span>
        &nbsp;shares for {{ amount }} {{ collateralToken.symbol }}.
      </div>

      <div
        v-if="selectedTab === TransactionType.SELL"
        class="flex items-center justify-center text-[14px] leading-[20px]"
      >
        Sell&nbsp;
        <span class="font-extrabold">{{ amount }}</span>
        &nbsp;of&nbsp;<span class="font-extrabold">{{ outcome.name }}</span>
        &nbsp;shares.
      </div>
    </div>

    <div class="flex items-center py-4 border-b-1 border-b-grey-lighter mt-4 font-semibold px-1">
      1. Increase allowance

      <div class="ml-auto">
        <div
          v-if="transactionStep === TransactionStep.ALLOWANCE"
          class="w-[17px] h-[17px] flex justify-center items-center ml-auto"
        >
          <div class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></div>
        </div>
        <NuxtIcon v-else class="text-primary text-[17px]" name="icon/complete" />
      </div>
    </div>

    <div class="flex items-center pt-4 font-semibold px-1">
      2. Confirm transaction

      <div v-if="transactionStep === TransactionStep.CONFIRM" class="ml-auto">
        <div class="w-[17px] h-[17px] flex justify-center items-center ml-auto">
          <div class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { watchDebounced } from '@vueuse/core';
import type { Address } from 'viem';
import { useAccount } from '@wagmi/vue';
import ConfettiExplosion from 'vue-confetti-explosion';
import type { OutcomeInterface } from '~/lib/types/prediction-set';
import { PredictionSetStatus, TransactionType } from '~/lib/types/prediction-set';
import { colors } from '~/tailwind.config';

enum TransactionStep {
  ALLOWANCE = 1,
  CONFIRM = 2,
}

const props = defineProps({
  contractAddress: { type: String as PropType<Address>, default: null, required: true },
  outcome: { type: Object as PropType<OutcomeInterface>, default: () => {}, required: true },
  status: { type: Number as PropType<PredictionSetStatus>, default: null, required: true },
  action: { type: Number as PropType<TransactionType>, default: null, required: false },
  endTime: { type: String, default: null, required: false },
  outcomes: { type: Array as PropType<OutcomeInterface[]>, default: () => [], required: true },
  defaultValue: { type: Number, default: 0 },
  collateralToken: { type: Object as PropType<CollateralToken>, default: () => {}, required: true },
});

const emit = defineEmits(['actionChanged', 'transactionSuccessful']);

const {
  getMinTokensToBuy,
  addFunding,
  buy,
  sell,
  calcSellAmountInCollateral,
  getPricePerShare,
  getTotalFunding,
  calcSharesForCollateral,
} = useFixedMarketMaker();
const { refreshCollateralBalance, checkCollateralAllowance } = useCollateralToken();
const { getConditionalBalance, parseConditionalBalance, checkConditionalApprove } = useConditionalToken();
const { ensureCorrectNetwork } = useContracts();
const { isConnected, address } = useAccount();
const { isMd } = useScreen();
const message = useMessage();
const txWait = useTxWait();

const selectedTab = ref(TransactionType.BUY);
const isFundEnabled = ref(true);
const slippage = ref(3);
const loading = ref(false);
const amount = ref<number | undefined>(props.defaultValue || undefined);
const returnAmount = ref<string>('0.0');
const potentialReturn = ref<string>('0.0');
const conditionalBalance = ref(BigInt(0));
const pricePerShare = ref(0.0);
const totalFundAmount = ref(BigInt(0));

const givenAmount = ref();
const obtainedAmount = ref();

const showSuccessModal = ref(false);
const showTransactionModal = ref(false);
const transactionHash = ref('');

const buyError = ref('');
const sellError = ref('');
const transactionStep = ref(TransactionStep.ALLOWANCE);

const sellFundLimit = ref(0);

const buyValidator = (x: number) => {
  if (x > buyFundLimit.value) {
    // Because input is calling -1 +1 for buttons
    if (amount.value !== x - 1) {
      buyError.value = `Amount can not exceed 10% of total funding.`;
    }
  } else {
    buyError.value = '';
  }

  return x >= 0 && x <= buyFundLimit.value;
};

const sellValidator = (x: number) => {
  if (x > sellFundLimit.value) {
    // Because input is calling -1 +1 for buttons
    if (amount.value !== x - 1) {
      sellError.value = `Sell amount can not exceed 10% of total funding.`;
    }
  } else {
    sellError.value = '';
  }

  return x >= 0 && x <= sellFundLimit.value;
};

const onBuyBlur = () => {
  if (buyError.value) {
    amount.value = buyFundLimit.value;
    buyError.value = '';
  }
};

const onSellBlur = () => {
  if (sellError.value) {
    amount.value = sellFundLimit.value;
    sellError.value = '';
  }
};

watch(
  () => props.defaultValue,
  defaultValue => {
    amount.value = defaultValue;
  }
);

watch(
  () => isConnected.value,
  async () => {
    await refreshBalances();
  }
);

const enoughConditionalBalance = computed(() => {
  const scaledAmount = BigInt(Math.round((amount.value || 0) * 10 ** props.collateralToken.decimals));
  return conditionalBalance.value >= scaledAmount;
});

const enoughCollateralBalance = computed(() => {
  const scaledAmount = BigInt(Math.round((amount.value || 0) * 10 ** props.collateralToken.decimals));
  return props.collateralToken.balance >= scaledAmount;
});

const buyFundLimit = computed(() => {
  let max = (BigInt(totalFundAmount.value) * 10n) / 100n;
  if (props.collateralToken.balance < max) {
    max = props.collateralToken.balance;
  }
  return bigIntToNum(max, props.collateralToken.decimals || 6);
});

watch(
  () => [totalFundAmount.value, conditionalBalance.value, props.outcome.outcomeIndex],
  async () => {
    const maxAmount = bigIntToNum((BigInt(totalFundAmount.value) * 10n) / 100n, props.collateralToken.decimals || 6);
    let limit =
      (await calcSharesForCollateral(
        maxAmount,
        props.outcome.outcomeIndex,
        props.contractAddress,
        props.outcomes.map(o => o.positionId),
        props.collateralToken.decimals
      )) || 0n;

    if (conditionalBalance.value < limit) {
      limit = conditionalBalance.value;
    }
    sellFundLimit.value = Number(limit) / Math.pow(10, props.collateralToken.decimals);
  }
);

onMounted(async () => {
  if (props.status === PredictionSetStatus.FUNDING) {
    selectedTab.value = TransactionType.FUND;
  } else if (props.action) {
    selectedTab.value = props.action;
  }

  await refreshCollateralBalance(props.collateralToken.id);
  totalFundAmount.value = await getTotalFunding(props.contractAddress);
});

watchEffect(async () => {
  if (props.outcome.positionId) {
    conditionalBalance.value = await getConditionalBalance(props.outcome.positionId);

    if (props.status !== PredictionSetStatus.FUNDING) {
      pricePerShare.value = await getPricePerShare(
        props.contractAddress,
        props.outcome.outcomeIndex,
        props.collateralToken.decimals
      );
    }
  }
});

watch(
  () => props.action,
  () => {
    selectedTab.value = props.action;
  }
);

watch(
  () => selectedTab.value,
  () => {
    emit('actionChanged', selectedTab.value);
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

function setMaxBuyAmount() {
  amount.value = buyFundLimit.value;
}

function setMaxSellAmount() {
  amount.value = sellFundLimit.value;
}

function openExplorer(txHash: string) {
  const explorer = getExplorer();

  window.open(`${explorer}/tx/${txHash}`, '_blank');
}

/**
 * TODO: Debounce!
 */
async function refreshBalances() {
  try {
    await refreshCollateralBalance(props.collateralToken.id);
    conditionalBalance.value = await getConditionalBalance(props.outcome.positionId);
    pricePerShare.value = await getPricePerShare(
      props.contractAddress,
      props.outcome.outcomeIndex,
      props.collateralToken.decimals
    );
    totalFundAmount.value = await getTotalFunding(props.contractAddress);
  } catch (error) {
    console.log(error);
  }
}

async function updateBuyAmount() {
  if (!amount.value) {
    return;
  }

  const { minTokensToBuy, minTokensToBuyNoSlippage } = await getMinTokensToBuy(
    props.contractAddress,
    amount.value,
    props.outcome.outcomeIndex,
    slippage.value,
    props.collateralToken.decimals
  );

  returnAmount.value = (Number(minTokensToBuy) / Math.pow(10, props.collateralToken.decimals)).toString();
  potentialReturn.value = (Number(minTokensToBuyNoSlippage) / Math.pow(10, props.collateralToken.decimals)).toFixed(3);
}

async function updateSellAmount() {
  if (!amount.value) {
    return;
  }

  const result = await calcSellAmountInCollateral(
    amount.value,
    props.outcome.outcomeIndex,
    props.contractAddress,
    props.outcomes.map(o => o.positionId),
    props.collateralToken.decimals
  );

  potentialReturn.value = (Number(result) / Math.pow(10, props.collateralToken.decimals)).toString();
}

/**
 * Fund market.
 */
async function fund() {
  if (!amount.value) {
    return;
  }

  transactionStep.value = TransactionStep.ALLOWANCE;
  showTransactionModal.value = true;
  loading.value = true;
  try {
    await refreshCollateralBalance(props.collateralToken.id);

    if (!enoughCollateralBalance.value) {
      loading.value = false;
      return;
    }
    await ensureCorrectNetwork();

    const allowance = await checkCollateralAllowance(props.collateralToken.id, props.contractAddress);
    if (!allowance) {
      loading.value = false;
      return;
    }
    transactionStep.value = TransactionStep.CONFIRM;

    txWait.hash.value = await addFunding(props.contractAddress, amount.value, props.collateralToken.decimals);
    const receipt = await txWait.wait();

    if (receipt.status === 'success') {
      givenAmount.value = amount.value;
      showSuccessModal.value = true;
      transactionHash.value = receipt?.data?.transactionHash || '';
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }

    amount.value = 0 as any;
    await refreshBalances();

    emit('transactionSuccessful', TransactionType.FUND);
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
    transactionStep.value = TransactionStep.ALLOWANCE;
    showTransactionModal.value = false;
  }
}

/**
 * Sell outcome shares.
 */
async function sellOutcome() {
  if (!amount.value) {
    return;
  }

  transactionStep.value = TransactionStep.ALLOWANCE;
  showTransactionModal.value = true;
  loading.value = true;
  try {
    conditionalBalance.value = await getConditionalBalance(props.outcome.positionId);
    if (!enoughConditionalBalance.value) {
      loading.value = false;
      return;
    }

    await ensureCorrectNetwork();

    const approved = await checkConditionalApprove(props.contractAddress);
    if (!approved) {
      loading.value = false;
      return;
    }
    transactionStep.value = TransactionStep.CONFIRM;

    const collateralAmount = await calcSellAmountInCollateral(
      amount.value,
      props.outcome.outcomeIndex,
      props.contractAddress,
      props.outcomes.map(o => o.positionId),
      props.collateralToken.decimals
    );

    txWait.hash.value = await sell(props.contractAddress, collateralAmount, props.outcome.outcomeIndex, slippage.value);
    const receipt = await txWait.wait();

    if (receipt.status === 'success') {
      const parsedGiven = parseSingleTransfersERC1155(receipt);
      if (parsedGiven.length) {
        const event = parsedGiven.find((e: any) => e.from === address.value);
        givenAmount.value = formatCollateralAmount(event.amount, props.collateralToken.decimals);
      }

      const parsedObtained = parseTransfersERC20(receipt);
      if (parsedObtained.length) {
        const event = parsedObtained.find((e: any) => e.to === address.value);
        obtainedAmount.value = formatCollateralAmount(event.amount, props.collateralToken.decimals);
      }

      givenAmount.value = amount.value;
      showSuccessModal.value = true;
      transactionHash.value = receipt?.data?.transactionHash || '';
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }

    amount.value = 0 as any;
    await refreshBalances();

    emit('transactionSuccessful', TransactionType.SELL);
  } catch (error) {
    console.error(error);
    message.error(contractError(error));
  } finally {
    loading.value = false;
    transactionStep.value = TransactionStep.ALLOWANCE;
    showTransactionModal.value = false;
  }
}

/**
 * Buy outcome shares.
 */
async function buyOutcome() {
  if (!amount.value) {
    return;
  }

  transactionStep.value = TransactionStep.ALLOWANCE;
  showTransactionModal.value = true;
  loading.value = true;
  try {
    await refreshCollateralBalance(props.collateralToken.id);
    if (buyFundLimit.value < amount.value || !enoughCollateralBalance.value) {
      loading.value = false;
      return;
    }
    await ensureCorrectNetwork();

    const allowance = await checkCollateralAllowance(props.collateralToken.id, props.contractAddress);
    if (!allowance) {
      loading.value = false;
      return;
    }
    transactionStep.value = TransactionStep.CONFIRM;

    txWait.hash.value = await buy(
      props.contractAddress,
      amount.value,
      props.outcome.outcomeIndex,
      slippage.value,
      props.collateralToken.decimals
    );
    const receipt = await txWait.wait();

    if (receipt.status === 'success') {
      const parsed = parseSingleTransfersERC1155(receipt);
      if (parsed.length) {
        const event = parsed.find((e: any) => e.to === address.value);
        obtainedAmount.value = formatCollateralAmount(event.amount, props.collateralToken.decimals);
      }

      showSuccessModal.value = true;
      transactionHash.value = receipt?.data?.transactionHash || '';
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }

    amount.value = 0 as any;
    await refreshBalances();

    emit('transactionSuccessful', TransactionType.BUY);
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
    transactionStep.value = TransactionStep.ALLOWANCE;
    showTransactionModal.value = false;
  }
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
