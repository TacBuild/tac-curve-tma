import { parseQuery } from 'vue-router'

export default defineNuxtPlugin((nuxtApp) => {
  const webapp = window.Telegram?.WebApp
  const router = useRouter()
  const route = useRoute()

  const onBack = () => {
    if (window.history.length > 1) {
      router.go(-1)
    }
    else {
      router.push('/')
    }
  }

  if (!webapp) {
    return {
      provide: {
        webapp: {},
        haptic: {
          notificationOccurred: () => {},
          impactOccurred: () => {},
        },
      },
    }
  }

  webapp.themeParams.bg_color = '#ffffff'
  const haptic = webapp.HapticFeedback
  try {
    webapp.setHeaderColor(webapp.themeParams.bg_color)
  }
  catch (e) {
    console.warn('[TGA]:', e)
  }
  try {
    webapp.BackButton.onClick(onBack)
    webapp.enableClosingConfirmation()
    webapp.expand()
    webapp.disableVerticalSwipes()
  }
  catch (e) {
    console.warn('[TGA]:', e)
  }

  watch(() => route.name, (value) => {
    if (!webapp?.BackButton) {
      return
    }

    if (value === 'index') {
      webapp.BackButton.hide()
      return
    }

    webapp.BackButton.show()
  }, { immediate: true })

  nuxtApp.hook('app:mounted', async () => {
    const str = decodeURIComponent(webapp.initData)
    const params = str.split('&')
    const startParam = params.find(str => str.startsWith('start_param'))?.split('=')[1]
    if (startParam) {
      const queries = startParam.split('__')
      queries.forEach((query) => {
        const [name, value] = query.split('_')
        if (name === 'to-deposit') {
          router.replace(`/pools/${value}/deposit`)
        }
      })
    }
  })

  return {
    provide: {
      webapp,
      haptic,
    },
  }
})
