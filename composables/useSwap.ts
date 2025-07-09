import { ref } from 'vue';
import { parseUnits, createPublicClient, http, getContract } from 'viem';
import { flare } from 'viem/chains';
import { useAccount, useConnectorClient, useChainId, useSwitchChain } from '@wagmi/vue';
import { SPARK_DEX_QUOTER_ABI, SPARK_DEX_SWAP_ROUTER_ABI } from '~/lib/config/abi';
import { sleep } from '~/lib/utils/helpers';

const WFLR_ADDRESS = '0x1d80c49bbbcd1c0911346656b529df9e5c2f783d';
const USDT_ADDRESS = '0xe7cd86e13AC4309349F30B3435a9d337750fC82D';
const QUOTER_ADDRESS = '0x5B5513c55fd06e2658010c121c37b07fC8e8B705';
const ROUTER_ADDRESS = '0x8a1E35F5c98C4E85B36B7B253222eE17773b2781';

export function useSwap() {
  // Reactive state that components can rely on
  const loading = ref(false);
  const quote = ref(null) as Ref<{
    result: [bigint, bigint, bigint, bigint];
    expiration: number;
    amountOut: number;
  } | null>;
  const { address, isConnected } = useAccount();
  const { data: walletClient, refetch } = useConnectorClient();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  // Create public client for Flare mainnet
  const publicClient = createPublicClient({
    chain: flare,
    transport: http(),
  });

  // Initialize contracts
  const quoter = getContract({
    address: QUOTER_ADDRESS,
    abi: SPARK_DEX_QUOTER_ABI,
    client: publicClient,
  });

  const router = getContract({
    address: ROUTER_ADDRESS,
    abi: SPARK_DEX_SWAP_ROUTER_ABI,
    client: walletClient.value!,
  });

  /**
   * Ensure the user is connected to Flare mainnet.
   *
   * @param retry The number of times to retry.
   */
  async function ensureCorrectNetwork(retry: number = 0) {
    if (chainId.value === flare.id) {
      return; // Already on correct network
    }

    console.log(`Switching to Flare mainnet (${flare.id}) from ${chainId.value}...`);
    await switchChainAsync({ chainId: flare.id });
    await sleep(100);
    await refetch();
    await sleep(100);

    if (chainId.value !== flare.id) {
      if (retry > 5) {
        throw new Error('Failed to switch to Flare mainnet!');
      }
      await sleep(100);
      await ensureCorrectNetwork(retry + 1);
    }
  }

  /**
   * Fetches a quote for swapping FLR → tokenOut so that `amountOut` of
   * tokenOut will be received. Returns the amount of FLR that has to be
   * supplied.
   */
  async function getQuote(
    amountOut: number,
    tokenIn = WFLR_ADDRESS, // WFLR
    tokenOut = USDT_ADDRESS, // USDT on Flare
    decimalsOut = 6,
    fee = 500
  ) {
    loading.value = true;
    try {
      console.log('Starting quote request...');

      const result = (await quoter.read.quoteExactOutputSingle([
        {
          tokenIn,
          tokenOut,
          amount: parseUnits(amountOut.toString(), decimalsOut),
          fee,
          sqrtPriceLimitX96: 0n,
        },
      ])) as [bigint, bigint, bigint, bigint];

      const expiration = Math.floor(Date.now() / 1000) + 60 * 5;
      quote.value = { result, expiration, amountOut };

      console.log('Quote result:', result);
      return { result, expiration };
    } catch (error) {
      console.error('Quote request failed:', error);
      throw error;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Executes the swap using the SparkDEX router.
   */
  async function executeSwap(amountOut: number) {
    if (!isConnected.value || !walletClient.value) {
      console.error('Wallet not connected');
      return;
    }

    // Ensure user is on Flare mainnet
    await ensureCorrectNetwork();

    // Ensure we have a fresh quote
    if (!quote.value || quote.value.amountOut !== amountOut || quote.value.expiration < Math.floor(Date.now() / 1000)) {
      console.log('Quote expired or missing, getting new quote...');
      await getQuote(amountOut);
    }
    if (!quote.value) {
      console.error('No quote found');
      return;
    }
    const amountInFLR = quote.value.result[0]; // bigint amount of FLR needed

    // Add a 3% slippage buffer
    const amountInMax = amountInFLR + (amountInFLR * 3n) / 100n;

    const deadline = Math.floor(Date.now() / 1000) + 60 * 5; // 5 minutes from now

    console.log('Executing swap with params:', {
      tokenIn: WFLR_ADDRESS,
      tokenOut: USDT_ADDRESS,
      fee: 500,
      recipient: address.value,
      deadline,
      amountOut,
      amountInMax: amountInMax.toString(),
    });

    const gasEstimate = await router.estimateGas.exactOutputSingle(
      [
        {
          tokenIn: WFLR_ADDRESS,
          tokenOut: USDT_ADDRESS,
          fee: 500,
          recipient: address.value,
          deadline,
          amountOut: parseUnits(amountOut.toString(), 6), // USDT amount (6 decimals)
          amountInMaximum: amountInMax, // bigint already in 18-dec FLR
          sqrtPriceLimitX96: 0n,
        },
      ],
      {
        value: amountInMax, // Send FLR for the swap
      }
    );

    console.log('Gas estimate:', gasEstimate);

    // Add 20% buffer to gas estimate
    const gasLimit = gasEstimate + (gasEstimate * 20n) / 100n; // 20% buffer
    console.log('Gas limit:', gasLimit);

    const hash = await router.write.exactOutputSingle(
      [
        {
          tokenIn: WFLR_ADDRESS,
          tokenOut: USDT_ADDRESS,
          fee: 500,
          recipient: address.value,
          deadline,
          amountOut: parseUnits(amountOut.toString(), 6), // USDT amount (6 decimals)
          amountInMaximum: amountInMax, // bigint already in 18-dec FLR
          sqrtPriceLimitX96: 0n,
        },
      ],
      {
        value: amountInMax, // Send FLR for the swap
        gas: gasLimit,
      }
    );

    console.log('Swap transaction hash:', hash);
    return hash;
  }

  return {
    loading,
    quote,
    getQuote,
    executeSwap,
    ensureCorrectNetwork,
  } as const;
}
