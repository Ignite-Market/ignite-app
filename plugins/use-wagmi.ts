import { http, createConfig, WagmiPlugin, createStorage } from '@wagmi/vue';
import { songbird, flareTestnet } from '@wagmi/vue/chains';
import { type Chain } from '@wagmi/vue/chains';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { injected, metaMask, coinbaseWallet, walletConnect } from '@wagmi/vue/connectors';
import { AppEnv } from '~/lib/types/config';

export default defineNuxtPlugin(nuxtApp => {
  const chains: readonly [Chain, ...Chain[]] =
    useRuntimeConfig().public.ENV === AppEnv.PROD ? [songbird] : [flareTestnet];

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
          name: 'Ignite Market Metamask wallet',
          url: 'https://ignitemarket.xyz',
          iconUrl: '/favicon.png',
        },
      }),
      coinbaseWallet({ appName: 'Ignite Market Coinbase wallet', appLogoUrl: '/favicon.png' }),
      walletConnect({ projectId: '' }),
    ],
    multiInjectedProviderDiscovery: false,
    storage: createStorage({ storage: window.sessionStorage }),
    transports,
  });

  nuxtApp.provide('wagmiConfig', wagmiConfig);
  nuxtApp.vueApp.use(WagmiPlugin, { config: wagmiConfig });
  nuxtApp.vueApp.use(VueQueryPlugin);
});
