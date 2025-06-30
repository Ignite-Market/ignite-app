import { createThirdwebClient, type ThirdwebClient } from 'thirdweb';
import { createWallet } from 'thirdweb/wallets';

// @url https://portal.thirdweb.com/typescript/v5/supported-wallets
const ExternalWalletsIdMap = {
  metaMaskSDK: 'io.metamask',
  coinbaseWalletSDK: 'com.coinbase.wallet',
  walletConnect: 'walletConnect',
} as const;

/**
 * Creates and returns a thirdweb client.
 *
 * @returns The thirdweb client.
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

  async function connectExternalWallet(id: keyof typeof ExternalWalletsIdMap) {
    if (!['metaMaskSDK', 'coinbaseWalletSDK', 'walletConnect'].includes(id)) {
      return;
    }

    const wallet = createWallet(ExternalWalletsIdMap[id]);

    const account = await wallet.connect({ client });

    return account;
  }

  return {
    client,
    strategies,
    connectExternalWallet,
  };
}
