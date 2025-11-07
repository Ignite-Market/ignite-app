import { VueQueryPlugin } from '@tanstack/vue-query';
import { inAppWalletConnector } from '@thirdweb-dev/wagmi-adapter';
import { createConfig, createStorage, http, WagmiPlugin } from '@wagmi/vue';
import { flare, flareTestnet, type Chain } from '@wagmi/vue/chains';
import { coinbaseWallet, metaMask, walletConnect } from '@wagmi/vue/connectors';
import { defineChain as thirdwebChain } from 'thirdweb';
import { AppEnv } from '~/lib/types/config';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  const chains: readonly [Chain, ...Chain[]] = config.public.ENV === AppEnv.PROD ? [flare] : [flareTestnet];
  const { client } = useThirdweb();

  const transports = chains.reduce((acc, chain) => {
    acc[chain.id] = http();
    return acc;
  }, {});

  const wagmiConfig = createConfig({
    chains,
    connectors: [
      inAppWalletConnector({
        client,
        // @ts-ignore wrong types smartAccount/smartAccounts
        smartAccounts: {
          sponsorGas: true,
          chain: thirdwebChain((config.public.ENV === AppEnv.PROD ? flare : flareTestnet) as any),
        },
        metadata: { name: 'Embedded Wallet (Google & Apple & Social)' },
      }),
      metaMask({
        dappMetadata: {
          name: 'Ignite Market Metamask wallet',
          url: 'https://ignitemarket.xyz',
          iconUrl: 'https://app.ignitemarket.xyz/favicon.png',
        },
      }),
      coinbaseWallet({ appName: 'Ignite Market Coinbase wallet', appLogoUrl: '/favicon.png' }),
      walletConnect({
        projectId: config.public.WALLETCONNECT_PROJECT_ID,
        qrModalOptions: {
          themeVariables: {
            '--wcm-z-index': '2001',
          },
        },
      }),
    ],
    multiInjectedProviderDiscovery: false,
    storage: createStorage({ storage: window.localStorage }),
    transports,
  });

  nuxtApp.provide('wagmiConfig', wagmiConfig);
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig });
  nuxtApp.vueApp.use(VueQueryPlugin);
});
