<script setup lang="ts">
import { createPublicClient, http, parseUnits } from 'viem';
import { flare } from 'viem/chains';
import { useAccount, useBalance } from '@wagmi/vue';
import { startThirdwebPayment } from '~/lib/thirdwebpay/dist/thirdwebpay';

const props = defineProps<{
  amount: number;
  collateralToken: CollateralToken;
}>();

const config = useRuntimeConfig();
const { connector, address } = useAccount();
const { data: nativeBalance } = useBalance({ address: address.value });
const isOpen = ref(false);
const isThirdweb = ref(false); // Is thirdweb step currently displayed
const isSwap = ref(false); // Is swap step currently displayed

/* Actions */
function topUpGas() {
  setTimeout(() => {
    /**
     * Method from thirdwebpay package (nested react app)
     */
    startThirdwebPayment('#thirdwebpay', {
      clientId: config.public.THIRDWEB_CLIENT_KEY,
      paymentReceiverAddress: address.value,
      amountInUsdc: numToBigInt(props.amount),
      // purchaseData: { purchaseId: 1 },
      connectorId: connector.value?.id,
      onSuccess: (_info: any) => {
        /**
         * Handle success in <PredictionSetAction />
         */
        // emit('success', props.amount || 0);
      },
    });
  }, 50);
  setTimeout(() => {
    isThirdweb.value = true;
  }, 100);
}

async function openSwap() {
  try {
    const client = createPublicClient({
      chain: flare,
      transport: http('https://flare-api.flare.network/ext/C/rpc'), // Use actual Flare RPC
    });

    console.log('Starting quote request...');

    const result = await client.readContract({
      address: '0x5B5513c55fd06e2658010c121c37b07fC8e8B705',
      abi: [
        {
          name: 'quoteExactOutputSingle',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            {
              components: [
                { name: 'tokenIn', type: 'address' },
                { name: 'tokenOut', type: 'address' },
                { name: 'amount', type: 'uint256' },
                { name: 'fee', type: 'uint24' },
                { name: 'sqrtPriceLimitX96', type: 'uint160' },
              ],
              internalType: 'struct IQuoterV2.QuoteExactOutputSingleParams',
              name: 'params',
              type: 'tuple',
            },
          ],
          outputs: [
            { name: 'amountIn', type: 'uint256' },
            { name: 'sqrtPriceX96After', type: 'uint160' },
            { name: 'initializedTicksCrossed', type: 'uint32' },
            { name: 'gasEstimate', type: 'uint256' },
          ],
        },
      ],
      functionName: 'quoteExactOutputSingle',
      args: [
        {
          tokenIn: '0x1d80c49bbbcd1c0911346656b529df9e5c2f783d',
          tokenOut: '0xe7cd86e13AC4309349F30B3435a9d337750fC82D',
          amount: parseUnits('10', 6),
          fee: 500, // 3000
          sqrtPriceLimitX96: 0n,
        },
      ],
    });

    console.log('Quote result:', result);
    isSwap.value = true;
  } catch (error) {
    console.error('Quote request failed:', error);
    // Still show swap UI even if quote fails
    isSwap.value = true;
  }
}

// Expose methods and state for parent component
defineExpose({
  isOpen,
  openModal: () => {
    isOpen.value = true;
    isThirdweb.value = false;
  },
  closeModal: () => {
    isOpen.value = false;
    isThirdweb.value = false;
  },
});
</script>

<template>
  <Modal
    v-model:show="isOpen"
    display-directive="show"
    class="!max-w-[402px] !bg-[#131418] [&>.n-card-header>button]:z-1"
    @update:show="isOpen = $event"
  >
    <div v-show="!isThirdweb">
      <h2 class="text-lg font-bold mb-4 text-center">Insufficient funds</h2>

      <div class="space-y-3">
        <!-- Native token row -->
        <div class="flex items-center p-3 rounded-[8px]" :class="amount ? 'bg-statusRed/10' : 'bg-statusGreen/10'">
          <NuxtIcon class="text-[24px]" name="icon/flare" filled />
          <div class="ml-3 flex-1">
            <div class="text-sm font-medium">Gas (FLR)</div>
            <div class="text-xs text-grey-lightest">
              Balance {{ bigIntToNum(nativeBalance?.value || 0n, 18).toFixed(4) }} / Needed ≈
              {{ amount.toFixed(4) }}
            </div>
          </div>

          <BasicButton v-if="amount" size="small" class="!px-3" @click="topUpGas">Add</BasicButton>
          <NuxtIcon v-else name="icon/check" class="text-statusGreen" />
        </div>

        <!-- USDT row -->
        <div class="flex items-center p-3 rounded-[8px]" :class="amount ? 'bg-statusRed/10' : 'bg-statusGreen/10'">
          <Image
            :src="collateralToken.imgUrl"
            :title="collateralToken.name"
            class="rounded-full w-6 h-6 object-cover mr-1"
          />
          <div class="ml-3 flex-1">
            <div class="text-sm font-medium">Collateral (USDT)</div>
            <div class="text-xs text-grey-lightest">
              Balance {{ bigIntToNum(collateralToken?.balance || 0n, collateralToken.decimals).toFixed(2) }} / Needed
              {{ amount.toFixed(2) }}
            </div>
          </div>

          <BasicButton v-if="amount" size="small" class="!px-3" @click="openSwap">Swap</BasicButton>
          <NuxtIcon v-else name="icon/check" class="text-statusGreen" />
        </div>
      </div>
      <BasicButton class="w-full mt-6" type="primary" :disabled="!amount"> Done </BasicButton>
    </div>
    <!-- Thirdweb iframe slot -->
    <div v-show="isThirdweb">
      <div id="thirdwebpay" class="[&>div]:mx-auto [&>div]:!border-none" :style="{ margin: '-20px -24px -20px' }"></div>
    </div>
    <PredictionSetSwap v-if="isSwap" />
    <template #header>
      <BasicButton v-show="isThirdweb" class="" type="primary" @click="isThirdweb = false"> Back </BasicButton>
    </template>
  </Modal>
</template>
