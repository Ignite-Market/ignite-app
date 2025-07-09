<script setup lang="ts">
import { useAccount, useBalance } from '@wagmi/vue';

const props = defineProps<{
  amount?: number;
  loading?: boolean;
}>();

const emit = defineEmits<{
  back: [];
  success: [amount: number];
}>();

const { isConnected, address } = useAccount();
const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({ address: address.value });
const { getQuote, executeSwap, loading: swapLoading, quote } = useSwap();
const txWait = useTxWait();
const message = useMessage();

// Local state
const amountToSwap = ref(props.amount || 0);
const amountQuoted = ref(0);
const quoteAmount = ref(0);
const isExecuting = ref(false);

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
    const result = await getQuote(amountToSwap.value);
    quoteAmount.value = bigIntToNum(result.result[0], 18);
    amountQuoted.value = amountToSwap.value;
  } catch (error) {
    console.error('Failed to fetch quote:', error);
  }
}

async function handleSwap() {
  if (!canSwap.value || !hasEnoughBalance.value) return;

  isExecuting.value = true;
  try {
    txWait.hash.value = await executeSwap(amountToSwap.value);
    const receipt = await txWait.wait();

    if (receipt.status === 'success') {
      console.log(receipt);
      emit('success', amountToSwap.value);
    } else if (receipt.status === 'error') {
      message.error(contractError(receipt.error));
    }
  } catch (error) {
    console.error('Swap failed:', error);
  } finally {
    isExecuting.value = false;
  }
}

function handleBack() {
  emit('back');
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
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-bold">Swap FLR to USD₮0</h2>
      <BasicButton size="small" @click="handleBack">Back</BasicButton>
    </div>

    <!-- Swap Form -->
    <div class="space-y-4">
      <!-- Amount Input -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-grey-lightest">Amount to receive (USD₮0)</label>
        <div class="relative">
          <input
            v-model.number="amountToSwap"
            type="number"
            step="0.01"
            min="0"
            class="w-full px-3 py-2 bg-grey-dark border border-grey-light rounded-lg text-white placeholder-grey-lightest focus:outline-none focus:border-primary"
            placeholder="0.00"
            :disabled="swapLoading || isExecuting"
          />
          <div class="absolute right-3 top-2.5 text-grey-lightest text-sm">USD₮0</div>
        </div>
      </div>

      <!-- Quote Display -->
      <div v-if="quote && !swapLoading" class="bg-grey-dark/50 rounded-lg p-4 space-y-3">
        <!-- Balance Display -->
        <div class="flex justify-between items-center">
          <span class="text-sm text-grey-lightest">Your FLR Balance:</span>
          <span class="text-sm font-medium flex items-center">
            {{ bigIntToNum(nativeBalance?.value || 0n, 18).toFixed(4) }}
            <NuxtIcon name="icon/flare" class="w-3 h-3 ml-1" filled />
          </span>
        </div>
        <div class="flex justify-between items-center">
          <span class="text-sm text-grey-lightest">You'll pay:</span>
          <span class="text-sm font-medium flex items-center">
            {{ quoteAmount.toFixed(4) }} <NuxtIcon name="icon/flare" class="w-3 h-3 ml-1" filled />
          </span>
        </div>

        <div class="flex justify-between items-center">
          <span class="text-sm text-grey-lightest">Rate:</span>
          <span class="text-sm font-medium flex items-center">
            1 USD₮0 = {{ (quoteAmount / amountQuoted).toFixed(6) }}
            <NuxtIcon name="icon/flare" class="w-3 h-3 ml-1" filled />
          </span>
        </div>

        <!-- Balance Check -->
        <div v-if="!hasEnoughBalance && quoteAmount > 0" class="text-statusRed text-xs">
          Insufficient FLR balance. You need {{ balanceShortfall.toFixed(4) }} more FLR.
        </div>

        <div v-if="quoteExpired" class="text-statusRed text-xs">Quote expired. Please refresh.</div>
      </div>

      <!-- Loading State -->
      <div v-if="swapLoading" class="flex items-center justify-center py-4">
        <Spinner :size="20" color="#000" />
        <span class="ml-2 text-sm text-grey-lightest">Getting quote...</span>
      </div>

      <!-- Error State -->
      <div v-if="!isConnected" class="text-statusRed text-sm text-center py-2">Please connect your wallet to swap</div>
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
        {{ isExecuting ? 'Swapping...' : 'Swap FLR to USD₮0' }}
      </BasicButton>
    </div>

    <!-- Info Section -->
    <div class="bg-grey-dark/30 rounded-lg p-3 space-y-2">
      <div class="flex justify-between text-xs text-grey-lightest">
        <span>Network:</span>
        <span class="flex items-center">
          <NuxtIcon name="icon/flare" class="w-3 h-3 mr-1" filled />
          Flare Mainnet
        </span>
      </div>
      <div class="flex justify-between text-xs text-grey-lightest">
        <span>Protocol:</span>
        <span>SparkDEX</span>
      </div>
      <div class="flex justify-between text-xs text-grey-lightest">
        <span>Slippage:</span>
        <span>3%</span>
      </div>
    </div>
  </div>
</template>
