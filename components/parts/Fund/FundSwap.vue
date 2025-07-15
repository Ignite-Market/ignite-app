<script setup lang="ts">
import { useAccount, useBalance } from '@wagmi/vue';
import ConfettiExplosion from 'vue-confetti-explosion';
import type { CollateralToken } from '../../../stores/collateral-tokens';
import { colors } from '../../../tailwind.config';

const props = defineProps<{
  amount?: number;
  loading?: boolean;
  collateralToken: CollateralToken;
}>();

const emit = defineEmits(['success', 'disableClose', 'enableClose']);

const { isConnected, address } = useAccount();
const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({ address: address.value });
const { getQuote, executeSwap, loading: swapLoading, quote } = useSwap();
const txWait = useTxWait();
const message = useMessage();

// Local state
const amountToSwap = ref(props.amount || 0);
const amountQuoted = ref(0);
const quoteAmount = ref(0);
const quoteError = ref(false);
const isExecuting = ref(false);
const swapSuccess = reactive({
  amount: 0,
  spentAmount: 0,
  txHash: '',
});

// Computed values
const canSwap = computed(
  () => isConnected.value && amountToSwap.value > 0 && quote.value && !swapLoading.value && !isExecuting.value
);

const quoteExpired = computed(() => quote.value && quote.value.expiration < Math.floor(Date.now() / 1000));

// Check if user has enough FLR for the swap
const hasEnoughBalance = computed(() => {
  if (!nativeBalance.value || quoteAmount.value === 0) return false;
  const userBalance = bigIntToNum(nativeBalance.value.value, 18);
  return userBalance >= quoteAmount.value;
});

const balanceShortfall = computed(() => {
  if (!nativeBalance.value || quoteAmount.value === 0) return 0;
  const userBalance = bigIntToNum(nativeBalance.value.value, 18);
  return Math.max(0, quoteAmount.value - userBalance);
});

// Methods
async function fetchQuote() {
  if (amountToSwap.value <= 0) return;

  try {
    const result = await getQuote(amountToSwap.value, props.collateralToken.address);
    if (!result) {
      quoteError.value = true;
      return;
    }
    quoteAmount.value = bigIntToNum(result.result[0], 18);
    amountQuoted.value = amountToSwap.value;
  } catch (error) {
    console.error('Failed to fetch quote:', error);
  }
}

async function handleSwap() {
  if (!canSwap.value || !hasEnoughBalance.value) return;

  isExecuting.value = true;
  emit('disableClose');
  try {
    txWait.hash.value = await executeSwap(amountToSwap.value, props.collateralToken.address);
    const receipt = await txWait.wait();

    if (receipt.status === 'success') {
      // Parse ERC20 Transfer events to get the actual amounts
      const parsedTransfers = parseTransfersERC20(receipt);
      const txHash = receipt?.data?.transactionHash || '';

      let actualAmountReceived = 0;
      let actualAmountSpent = 0;

      if (parsedTransfers.length) {
        // Find the transfer event where tokens were sent TO the user's address (amount received)
        const receivedEvent = parsedTransfers.find((e: any) => e.to === address.value);
        if (receivedEvent) {
          // Convert the bigint amount to a number with proper decimals
          actualAmountReceived = bigIntToNum(receivedEvent.amount, props.collateralToken.decimals);
        }

        // For SparkDEX swaps, the FLR spent is typically handled through WFLR transfers
        // Look for WFLR transfers FROM the router TO the pool
        const wflrTransfers = parsedTransfers.filter(
          (e: any) => e.contractAddress.toLowerCase() === '0x1d80c49bbbcd1c0911346656b529df9e5c2f783d' // WFLR address
        );

        // The WFLR transfer from router to pool represents the amount spent
        const routerToPoolTransfer = wflrTransfers.find(
          (e: any) => e.from.toLowerCase() === '0x8a1e35f5c98c4e85b36b7b253222ee17773b2781' // Router address
        );

        if (routerToPoolTransfer) {
          actualAmountSpent = bigIntToNum(routerToPoolTransfer.amount, 18);
        }

        // Update the success state
        swapSuccess.amount = actualAmountReceived;
        swapSuccess.spentAmount = actualAmountSpent;
        swapSuccess.txHash = txHash;

        emit('success', actualAmountReceived);
      } else {
        swapSuccess.amount = amountToSwap.value;
        swapSuccess.spentAmount = 0; // No spent amount if no transfer events
        swapSuccess.txHash = txHash;
        emit('success', amountToSwap.value);
      }
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }
  } catch (error) {
    console.error('Swap failed:', error);
  } finally {
    isExecuting.value = false;
    emit('enableClose');
  }
}

// Watch for amount changes to fetch new quotes
let quoteTimeout: NodeJS.Timeout;
watch(amountToSwap, () => {
  if (amountToSwap.value > 0) {
    clearTimeout(quoteTimeout);
    quoteTimeout = setTimeout(() => {
      fetchQuote();
    }, 500);
  }
});

// Initial quote fetch
onMounted(async () => {
  if (props.amount) {
    amountToSwap.value = props.amount;
  }
  await refetchNativeBalance();
  fetchQuote();
});
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold text-center w-full">Swap FLR to {{ collateralToken.symbol }}</h2>
    </div>

    <div v-if="!swapSuccess.txHash" class="space-y-5">
      <!-- Swap Form -->
      <div class="space-y-4">
        <!-- Amount Input -->
        <div v-if="quote" class="space-y-2">
          <label class="text-sm font-medium text-grey-lightest text-center w-full">
            Amount to receive ({{ collateralToken.symbol }})
          </label>
          <div class="relative">
            <n-input-number
              v-model:value="amountToSwap"
              placeholder="0"
              min="0"
              size="large"
              class="min-w-full text-center"
              type="number"
              :show-button="true"
              button-placement="both"
            >
              <template #suffix>
                <div class="absolute right-10 top-1/2 -translate-y-1/2 text-grey-lightest text-sm">
                  {{ collateralToken?.symbol }}
                </div>
              </template>
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
        </div>

        <!-- Quote Display -->
        <div v-if="!quoteError" class="bg-grey-dark/50 rounded-lg p-4 space-y-3">
          <!-- Balance Display -->
          <div class="flex justify-between items-center">
            <span class="text-sm text-grey-lightest">Your FLR Balance:</span>
            <div class="flex items-center gap-2">
              <span v-if="swapLoading" class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></span>
              <span class="text-sm font-medium flex items-center">
                {{ bigIntToNum(nativeBalance?.value || 0n, 18).toFixed(4) }}
                <NuxtIcon name="icon/flare" class="w-3 h-3 ml-1" filled />
              </span>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-grey-lightest">You'll pay:</span>
            <div class="flex items-center gap-2">
              <span v-if="swapLoading" class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></span>
              <span class="text-sm font-medium flex items-center">
                {{ quoteAmount.toFixed(4) }} <NuxtIcon name="icon/flare" class="w-3 h-3 ml-1" filled />
              </span>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <span class="text-sm text-grey-lightest">Rate:</span>
            <div class="flex items-center gap-2">
              <span v-if="swapLoading" class="w-[7px] h-[7px] bg-statusGreen rounded-full animate-pulse"></span>
              <span class="text-sm font-medium flex items-center">
                1 {{ collateralToken.symbol }} = {{ (quoteAmount / amountQuoted).toFixed(6) }}
                <NuxtIcon name="icon/flare" class="w-3 h-3 ml-1" filled />
              </span>
            </div>
          </div>

          <!-- Balance Check -->
          <div v-if="!hasEnoughBalance && quoteAmount > 0" class="text-statusRed text-xs">
            Insufficient FLR balance. You need {{ balanceShortfall.toFixed(4) }} more FLR.
          </div>

          <div v-if="quoteExpired" class="text-statusRed text-xs">Quote expired. Please refresh.</div>
        </div>

        <div v-if="quoteError" class="flex items-center justify-center py-11">
          Unable to get quote. Please try again later.
        </div>

        <!-- Error State -->
        <div v-if="!isConnected" class="text-statusRed text-sm text-center py-2">
          Please connect your wallet to swap
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <BasicButton v-if="quoteExpired" class="w-full" type="secondary" :loading="swapLoading" @click="fetchQuote">
          Refresh Quote
        </BasicButton>

        <BasicButton
          class="w-full"
          type="primary"
          :disabled="!canSwap || !hasEnoughBalance"
          :loading="isExecuting"
          @click="handleSwap"
        >
          {{ isExecuting ? 'Swapping...' : 'Swap FLR to ' + collateralToken.symbol }}
        </BasicButton>
      </div>

      <!-- Info Section -->
      <div class="bg-grey-dark/30 rounded-lg p-3 space-y-2">
        <div class="flex justify-between text-xs text-grey-lightest">
          <span>Slippage:</span>
          <span>3%</span>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center">
      <ConfettiExplosion
        v-if="swapSuccess.spentAmount"
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
      <div class="flex items-center justify-center text-[14px] leading-[20px] font-bold">Swap successful!</div>

      <div class="flex flex-col items-center justify-center mt-5">
        <div class="text-center mb-2">
          You have successfully swapped
          <span class="font-bold text-primary">{{ swapSuccess.spentAmount.toFixed(4) }} FLR</span>
          for<br />
          <span class="font-bold text-statusGreen"> {{ swapSuccess.amount }} {{ collateralToken.symbol }} </span>
        </div>
        <BasicButton
          v-if="swapSuccess.txHash"
          class="w-full font-bold mt-3"
          type="secondary"
          :size="'medium'"
          :href="`https://flare-explorer.flare.network/tx/${swapSuccess.txHash}`"
        >
          Transaction
        </BasicButton>
      </div>
    </div>
  </div>
</template>
