// https://nuxt.com/docs/api/configuration/nuxt-config

const scripts = [
  { src: 'https://telegram.org/js/telegram-web-app.js' },
]

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
  ],

  ssr: false,

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devtools: {
    enabled: Boolean(process.env.DEV),
  },

  app: {
    head: {
      title: 'Curve.fi x TAC',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        {
          name: 'description',
          content: 'Swap with Curve.fi. Powered by TAC',
        },
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, user-scalable=no',
        },
        {
          name: 'theme-color',
          content: '#f2f2f7',
        },
      ],
      link: [
        {
          rel: 'manifest',
          href: '/site.webmanifest',
        },
        {
          rel: 'icon',
          href: '/favicons/favicon.ico',
        },
        {
          rel: 'shortcut icon',
          href: '/favicons/favicon.ico',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicons/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicons/favicon-16x16.png',
        },
      ],
      script: scripts,
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in', // default
    },
    // layoutTransition: {
    //   name: 'layout',
    //   mode: 'out-in' // default
    // }
  },

  css: [
    '~/assets/styles/main.scss',
    '~/components/ui/styles/main.scss',
  ],

  runtimeConfig: {
    public: {
      tonconnectManifestUrl: process.env.TONCONNECT_MANIFEST_URL || '',
      telegramMiniAppBotUrl: process.env.TELEGRAM_MINI_APP_BOT_URL || '',
      toncenterApiKey: process.env.TONCENTER_API_KEY || '',
    },
  },

  sourcemap: {
    server: false,
    client: false,
  },

  devServer: {
    https: {
      key: process.env.HTTPS_KEY,
      cert: process.env.HTTPS_CERT,
    },
  },

  compatibilityDate: '2024-04-03',

  nitro: {
    compressPublicAssets: true,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/mixins.scss" as *;',
        },
      },
    },

    build: {
      target: 'modules',
      rollupOptions: {
        output: {
          inlineDynamicImports: true,
        },
      },
    },
  },

  telemetry: {
    enabled: false,
  },

  eslint: { config: { stylistic: true } },
})
