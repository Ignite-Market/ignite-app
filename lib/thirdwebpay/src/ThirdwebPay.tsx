import { BuyWidget, ThirdwebProvider, useActiveAccount, useConnect, type PayUIOptions } from 'thirdweb/react';
import { createThirdwebClient, defineChain, type ThirdwebClient } from 'thirdweb';
import { createWallet } from 'thirdweb/wallets';
import { useEffect, useState } from 'react';

/**
 * @TODO Import from thirdweb/chains once available
 */
const flareChain = defineChain({
  blockExplorers: [
    {
      apiUrl: 'https://flare-explorer.flare.network/api',
      name: 'Flare Explorer',
      url: 'https://flare-explorer.flare.network',
    },
  ],
  id: 14,
  name: 'Flare Mainnet',
  nativeCurrency: { decimals: 18, name: 'Flare', symbol: 'FLR' },
});

const ExternalWalletsIdMap = {
  metaMaskSDK: 'io.metamask',
  coinbaseWalletSDK: 'com.coinbase.wallet',
  walletConnect: 'walletConnect',
} as const;

export type PayParams = {
  amountInUsdc: string;
  // tokenAddress?: string;
  paymentReceiverAddress?: string;
  testMode?: boolean;
  purchaseData?: Record<string, unknown>;
  connectorId?: keyof typeof ExternalWalletsIdMap;

  // https://portal.thirdweb.com/references/typescript/v5/PayUIOptions
  onSuccess?: PayUIOptions['onPurchaseSuccess'];
};

export type Params = {
  clientId: string;
} & PayParams;

export default function ThirdwebPay({ clientId, ...params }: Params) {
  const [client, setClient] = useState<ThirdwebClient>();

  useEffect(() => {
    if (!client && clientId) {
      const c = createThirdwebClient({ clientId });
      setClient(c);
    }
  }, [clientId, client]);

  if (!client) {
    return <></>;
  }

  return (
    <ThirdwebProvider>
      <Embed client={client} {...params} />
    </ThirdwebProvider>
  );
}

function Embed({
  client,
  connectorId,
  amountInUsdc,
  // tokenAddress = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // Base USDC
  paymentReceiverAddress = '0x5f2B7077a7e5B4fdD97cBb56D9aD02a4f326896d', // OUR account
  testMode = false,
  purchaseData = {},
  onSuccess,
}: { client: ThirdwebClient } & PayParams) {
  const { connect } = useConnect();
  const activeAccount = useActiveAccount();

  /**
   * @TODO add testnet once available
   */
  const chain = testMode ? flareChain : flareChain;

  useEffect(() => {
    /**
     * Initialize wallet if external wallet is provided
     */
    if (
      !activeAccount &&
      !!connectorId &&
      !!client &&
      ['metaMaskSDK', 'coinbaseWalletSDK', 'walletConnect'].includes(connectorId)
    ) {
      connect(async () => {
        const wallet = createWallet(ExternalWalletsIdMap[connectorId]);
        await wallet.connect({ client });
        return wallet;
      });
    }
  }, [client, connectorId, activeAccount, connect]);
  console.log(paymentReceiverAddress);
  console.log(amountInUsdc);
  if (!activeAccount && !testMode) {
    return <></>;
  }

  return (
    <>
      {/* <PayEmbed
        client={client}
        payOptions={{
          mode: 'direct_payment',
          purchaseData,
          // prefillBuy: {
          //   token: getDefaultToken(chain, 'USDC'),
          //   chain,
          //   amount: amountInUsdc,
          //   allowEdits: {
          //     amount: false,
          //     token: false,
          //     chain: false,
          //   },
          // },
          // buyWithFiat: false,
          buyWithCrypto: false,
          paymentInfo: {
            sellerAddress: paymentReceiverAddress,
            chain,
            amount: amountInUsdc,
            token: getDefaultToken(chain, 'USDC'),
          },
          onPurchaseSuccess: onSuccess,
        }}
      /> */}
      <BuyWidget
        client={client}
        chain={chain}
        amount={amountInUsdc}
        purchaseData={purchaseData}
        paymentMethods={['card']} // Crypto doesn't make senese since only FLR is supported
        onSuccess={onSuccess}
      />
    </>
  );
}
