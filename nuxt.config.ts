import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { getAppConfig } from './lib/utils';
import { AppEnv } from './lib/types/config';

const env = process.env.ENV || process.env.RUN_ENV || process.env.NODE_ENV;
const appConfig = getAppConfig(env);

const meta = {
  lang: 'en',
  title: 'Ignite Market - Future prediction market',
  description:
    'Ignite Market is a cutting-edge prediction platform where you can forecast outcome and earn from your insights on trending events.',
  url: 'https://ignitemarket.xyz/',
  image: 'https://images.ignitemarket.xyz/social-share.png',
  twitter: '@ignitemarket',
  ogTitle: 'Ignite Market | Predict the future!',
  ogDescription:
    'Forecast real-world events and earn from your predictions on XPR, Flare, Sports, and Finance. Ignite your insights.',
  ogDescriptionShort: 'Forecast real-world events. Ignite your insights.',
};

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  ssr: false,

  build: {
    transpile: process.env.NODE_ENV === AppEnv.PROD ? ['naive-ui', '@juggle/resize-observer'] : [''],
  },
  components: ['~/components', '~/components/general/', '~/components/parts/'],
  devtools: { enabled: false },
  experimental: {
    payloadExtraction: false,
    viewTransition: true,
    renderJsonPayloads: true,
  },
  ignore: ['**/thirdwebpay/**', '**/node_modules/**', '**/.git/**', '**/dist/**'],
  imports: {
    dirs: ['composables/', 'stores/', 'lib/utils'],
  },
  modules: [
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-icons',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/google-fonts',
    'nuxtjs-naive-ui',
  ],
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },
  runtimeConfig: { public: appConfig },
  typescript: { shim: false },
  vite: {
    plugins: [
      AutoImport({
        imports: [
          {
            'naive-ui': ['useMessage'],
          },
        ],
      }),
      Components({
        resolvers: [NaiveUiResolver()],
      }),
      {
        name: 'vite-plugin-glob-transform',
        transform(code: string, id: string) {
          if (id.includes('nuxt-icons')) {
            return code.replace(/as:\s*['"]raw['"]/g, 'query: "?raw", import: "default"');
          }
          return code;
        },
      },
    ],
    optimizeDeps: {
      include: process.env.NODE_ENV === AppEnv.DEV ? ['color', 'mersenne-twister', 'naive-ui'] : [],
      // Don’t try to pre-bundle the dist files in dev
      exclude: ['~/lib/thirdwebpay/dist'],
    },
    build: {
      // Tell Rollup to treat them as already-built, just copy them over
      rollupOptions: {
        plugins: [
          {
            name: 'thirdwebpay-dont-touch',
            // `transform` runs before Rollup does any parsing;
            // returning `null` makes Rollup leave the file alone.
            // We only do this for the generated bundle:
            transform(code, id) {
              if (id.includes('/lib/thirdwebpay/dist/')) {
                return { code, moduleSideEffects: false };
              }
              return null;
            },
          },
        ],
      },
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: meta.lang,
      },

      title: meta.title,
      titleTemplate: `%s - ${meta.title}`,
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',

      meta: [
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#070707' },
        { name: 'title', content: 'Ignite Market | Predict. Profit. Participate.' },
        { name: 'description', content: meta.description, hid: 'description' },
        { name: 'canonical', content: meta.url },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: meta.url },
        { property: 'og:title', content: meta.ogTitle },
        { property: 'og:description', content: meta.ogDescription },
        { property: 'og:image', content: meta.image },

        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: meta.twitter },
        { name: 'twitter:title', content: meta.ogTitle },
        { name: 'twitter:description', content: meta.ogDescriptionShort },
        { name: 'twitter:image', content: meta.image },
        {
          'http-equiv': 'Content-Security-Policy',
          content:
            "default-src *; font-src 'self' data: fonts.gstatic.com; img-src * data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval' *; style-src 'self' 'unsafe-inline' *",
        },
      ],

      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'canonical', href: meta.url },
      ],

      script: [],
    },
  },

  i18n: {
    lazy: true,
    strategy: 'no_prefix',
    defaultLocale: 'en-US',
    detectBrowserLanguage: false,
    langDir: 'i18n',
    vueI18n: 'i18n/config',
    compilation: { strictMessage: false, escapeHtml: false },
    locales: [
      {
        code: 'en-US',
        name: 'English',
        file: 'en/index.ts',
      },
    ],
  },

  googleFonts: {
    useStylesheet: true,
    display: 'swap',
    download: true,
    families: {
      Inter: {
        wght: [400, 500, 600, 700],
      },
    },
  },
  tailwindcss: { cssPath: '~/assets/css/tailwind.css' },
});
