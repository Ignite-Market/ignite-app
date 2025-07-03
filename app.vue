<template>
  <div id="app" class="bg-bg">
    <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides" :locale="locale" :date-locale="dateLocale">
      <n-message-provider placement="bottom-right" :keep-alive-on-hover="true" :duration="3000" closable>
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </n-message-provider>
      <!-- <CookieConsent /> -->
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { darkTheme, enUS, dateEnUS } from 'naive-ui';
import { themeOverrides } from './lib/config/naive-ui';

const tokensStore = useTokensStore();

const $i18n = useI18n();
window.$i18n = $i18n as any;

const lang = computed(() => {
  return $i18n.locale.value;
});

const locale = computed(() => {
  switch ($i18n.locale.value) {
    case 'en':
      return enUS;
    default:
      return enUS;
  }
});
const dateLocale = computed(() => {
  switch ($i18n.locale.value) {
    case 'en':
      return dateEnUS;
    default:
      return dateEnUS;
  }
});

useHead({
  htmlAttrs: {
    lang,
  },
  title: 'Ignite Market - Future prediction market',
  meta: [
    { name: 'title', content: 'Ignite Market | Predict. Profit. Participate.' },
    {
      name: 'description',
      content:
        'Ignite Market is a cutting-edge prediction platform where you can forecast outcome and earn from your insights on trending events.',
    },
    { name: 'canonical', content: 'https://ignitemarket.xyz/' },

    // Open Graph / Facebook
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://ignitemarket.xyz/' },
    { property: 'og:title', content: 'Ignite Market | Predict the future!' },
    {
      property: 'og:description',
      content:
        'Forecast real-world events and earn from your predictions on XPR, Flare, Sports, and Finance. Ignite your insights.',
    },
    { property: 'og:image', content: 'https://images.ignitemarket.xyz/social-share.png' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@ignitemarket' },
    { name: 'twitter:title', content: 'Ignite Market | Predict the future!' },
    { name: 'twitter:description', content: 'Forecast real-world events. Ignite your insights.' },
    { name: 'twitter:image', content: 'https://images.ignitemarket.xyz/social-share.png' },
  ],
  link: [{ rel: 'canonical', href: 'https://ignitemarket.xyz/' }],
});

onMounted(async () => {
  await tokensStore.fetch();
});
</script>
