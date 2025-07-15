import { Bridge, createThirdwebClient, NATIVE_TOKEN_ADDRESS, toWei } from 'thirdweb';

export default function useThirdwebPay() {
  const config = useRuntimeConfig();

  const client = createThirdwebClient({
    clientId: config.public.THIRDWEB_CLIENT_KEY,
  });

  async function getQuote(amount: string) {
    const quote = await Bridge.Buy.quote({
      originChainId: 1,
      originTokenAddress: NATIVE_TOKEN_ADDRESS,
      destinationChainId: 1,
      destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
      amount: toWei(amount),
      client,
    });

    console.log(quote);
  }

  return {
    getQuote,
  };
}
