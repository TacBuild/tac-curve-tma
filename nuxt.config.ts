// https://nuxt.com/docs/api/configuration/nuxt-config

const scripts = [
  { src: 'https://telegram.org/js/telegram-web-app.js' }
];

export default defineNuxtConfig({
  devtools: {
    enabled: Boolean(process.env.DEV)
  },

  telemetry: {
    enabled: false
  },
  ssr: false,

  css: [
    '~/assets/scss/fonts.scss',
    '~/assets/scss/vendors.scss',
    '~/assets/scss/common.scss',
    '~/components/ui/styles/common.scss'
  ],

  modules: [
    '@nuxtjs/eslint-module',
    'nuxt-proxy-request'
  ],

  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  devServer: {
    https: {
      key: process.env.HTTPS_KEY,
      cert: process.env.HTTPS_CERT
    }
  },

  app: {
    head: {
      title: 'Curve.fi x TAC',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        {
          name: 'description',
          content: 'Swap with Curve.fi. Powered by TAC'
        },
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, user-scalable=no'
        },
        {
          name: 'theme-color',
          content: '#f2f2f7'
        }
      ],
      link: [
        {
          rel: 'manifest',
          href: '/site.webmanifest'
        },
        {
          rel: 'icon',
          href: '/favicons/favicon.ico'
        },
        {
          rel: 'shortcut icon',
          href: '/favicons/favicon.ico'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicons/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicons/favicon-16x16.png'
        }
      ],
      script: scripts
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in' // default
    }
    // layoutTransition: {
    //   name: 'layout',
    //   mode: 'out-in' // default
    // }
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
          @import "@/assets/scss/shared/mixins.scss";
          @import "@/assets/scss/shared/functions.scss";
          @import "@/assets/scss/shared/variables.scss";
          `
        }
      }
    },
    build: {
      rollupOptions: {
        output: {
          inlineDynamicImports: true
        }
      }
    }
  },

  nitro: {
    compressPublicAssets: true
  },

  sourcemap: {
    server: false,
    client: false
  },

  runtimeConfig: {
    public: {
      telegramManifestUrl: process.env.TELEGRAM_MANIFEST_URL || '',
      tonconnectManifestUrl: process.env.TONCONNECT_MANIFEST_URL || '',
      telegramMiniAppBotUrl: process.env.TELEGRAM_MINI_APP_BOT_URL || '',
      ethersProviderUrl: process.env.ETHERS_PROVIDER_URL || '',
      ethersPoolAddress: process.env.ETHERS_POOL_ADDRESS || ''
    }
  },

  proxy: {
    options: [
      {
        target: process.env.TONCENTER_URL || 'localhost:5000',
        changeOrigin: true,
        pathRewrite: {
          '^/jsonRPC': '/jsonRPC'
        },
        pathFilter: ['/jsonRPC']
      }
    ]
  },

  compatibilityDate: '2024-04-03'
});
