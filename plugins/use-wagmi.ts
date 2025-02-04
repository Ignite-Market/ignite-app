import { http, createConfig, WagmiPlugin, createStorage } from '@wagmi/vue';
import { moonbeam, moonbaseAlpha, base, baseSepolia, bsc, bscTestnet } from '@wagmi/vue/chains';
import { type Chain } from '@wagmi/vue/chains';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { injected, metaMask, coinbaseWallet, walletConnect } from '@wagmi/vue/connectors';
import { AppEnv } from '~/lib/types/config';

export default defineNuxtPlugin(nuxtApp => {
  const chains: readonly [Chain, ...Chain[]] =
    useRuntimeConfig().public.ENV === AppEnv.PROD ? [base, moonbeam, bsc] : [moonbaseAlpha, baseSepolia, bscTestnet];

  const transports = chains.reduce((acc, chain) => {
    acc[chain.id] = http();
    return acc;
  }, {});

  const wagmiConfig = createConfig({
    chains,
    connectors: [
      injected(),
      metaMask({
        dappMetadata: {
          name: 'LendeeFi Metamask wallet',
          url: 'https://LendeeFi.com',
          iconUrl: '/favicon.png',
        },
      }),
      coinbaseWallet({ appName: 'LendeeFi Coinbase wallet', appLogoUrl: '/favicon.png' }),
    ],
    multiInjectedProviderDiscovery: false,
    storage: createStorage({ storage: window.sessionStorage }),
    transports,
  });
  nuxtApp.provide('wagmiConfig', wagmiConfig);
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig });
  nuxtApp.vueApp.use(VueQueryPlugin);
});
