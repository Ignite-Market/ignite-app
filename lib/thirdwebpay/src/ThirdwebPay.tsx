import { getDefaultToken, PayEmbed, ThirdwebProvider, type PayUIOptions } from 'thirdweb/react';
import { createThirdwebClient, type ThirdwebClient } from 'thirdweb';
import { base, baseSepolia } from 'thirdweb/chains';

export type PayParams = {
  amountInUsdc: string;
  // tokenAddress?: string;
  paymentReceiverAddress?: string;
  testMode?: boolean;
  purchaseData?: object;

  // https://portal.thirdweb.com/references/typescript/v5/PayUIOptions
  onSuccess?: PayUIOptions['onPurchaseSuccess'];
};

export type Params = {
  clientId: string;
} & PayParams;

export default function ThirdwebPay({ clientId, ...params }: Params) {
  const client = createThirdwebClient({ clientId });

  return (
    <ThirdwebProvider>
      <Embed client={client} {...params} />
    </ThirdwebProvider>
  );
}

function Embed({
  client,
  amountInUsdc,
  // tokenAddress = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', // Base USDC
  paymentReceiverAddress = '0x5f2B7077a7e5B4fdD97cBb56D9aD02a4f326896d', // OUR account
  testMode = false,
  purchaseData = {},
  onSuccess,
}: { client: ThirdwebClient } & PayParams) {
  const chain = testMode ? baseSepolia : base;

  return (
    <>
      <PayEmbed
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
          buyWithCrypto: {
            prefillSource: {
              chain,
              token: getDefaultToken(chain, 'USDC'),
              // allowEdits: {
              //   chain: false,
              //   token: false,
              // },
            },
          },
          paymentInfo: {
            sellerAddress: paymentReceiverAddress,
            chain,
            amount: amountInUsdc,
            token: getDefaultToken(chain, 'USDC'),
          },
          onPurchaseSuccess: onSuccess,
        }}
      />
    </>
  );
}
