import { createThirdwebClient, type ThirdwebClient } from 'thirdweb';

/**
 * Creates and returns a thirdweb client.
 */
export default function useThirdweb() {
  const config = useRuntimeConfig();

  const client: ThirdwebClient = createThirdwebClient({
    clientId: config.public.THIRDWEB_CLIENT_KEY,
  });

  // list: https://portal.thirdweb.com/connect/wallet/sign-in-methods/configure
  const strategies = [
    { id: 'discord', name: 'Discord' },
    { id: 'apple', name: 'Apple' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'google', name: 'Google' },
    { id: 'telegram', name: 'Telegram' },
    { id: 'x', name: 'X' },
    { id: 'twitch', name: 'Twitch' },
  ];

  return {
    client,
    strategies,
  };
}
