import { http, createConfig, WagmiPlugin, createStorage } from '@wagmi/vue';
import { songbird, flareTestnet } from '@wagmi/vue/chains';
import { type Chain } from '@wagmi/vue/chains';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { metaMask, coinbaseWallet, walletConnect } from '@wagmi/vue/connectors';
import { inAppWalletConnector } from '@thirdweb-dev/wagmi-adapter';
import { defineChain as thirdwebChain } from 'thirdweb';
import { AppEnv } from '~/lib/types/config';

export default defineNuxtPlugin(nuxtApp => {
  const config = useRuntimeConfig();
  const chains: readonly [Chain, ...Chain[]] = config.public.ENV === AppEnv.PROD ? [songbird] : [flareTestnet];
  const { client } = useThirdweb();

  const transports = chains.reduce((acc, chain) => {
    acc[chain.id] = http();
    return acc;
  }, {});

  const wagmiConfig = createConfig({
    chains,
    connectors: [
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
      inAppWalletConnector({
        client,
        smartAccount: {
          sponsorGas: true,
          chain: thirdwebChain((config.public.ENV === AppEnv.PROD ? songbird : flareTestnet) as any),
        },
        metadata: { name: 'Embedded Wallet' },
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
