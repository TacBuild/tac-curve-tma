// https://nuxt.com/docs/api/configuration/nuxt-config

// const scripts = [
//   { src: 'https://telegram.org/js/telegram-web-app.js?v=2' }
// ];

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
    '@gvade/nuxt3-svg-sprite'
  ],
  svgSprite: {
    elementClass: 'icon'
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false
    }
  ],

  app: {
    head: {
      title: 'TAC',
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        {
          name: 'description',
          content: 'TAC'
        },
        { charset: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, user-scalable=no'
        },
        {
          name: 'theme-color',
          content: '#efeef4'
        }
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://cdn.fanz.ee'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/favicons/apple-touch-icon.png'
        },
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
      ]
      // script: scripts
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
          inlineDynamicImports: true // TODO: disable chunking
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
      telegramMiniAppBotUrl: process.env.TELEGRAM_MINI_APP_BOT_URL || ''
    }
  },

  compatibilityDate: '2024-04-03'
});
