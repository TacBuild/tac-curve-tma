export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  const webapp = window.Telegram?.WebApp
  const router = useRouter()
  const route = useRoute()

  const onBack = () => {
    if (window.history.length > 1) {
      router.go(-1)
      return
    }

    router.push('/')
  }

  const onSettingsClick = () => {
    router.push('/profile/settings')
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
    webapp.SettingsButton.show()
    webapp.SettingsButton?.onClick(onSettingsClick)
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

    if (value === 'new' || value === 'update') {
      webapp.SettingsButton.hide()
    }

    if (value === 'index' || value === 'new' || value === 'update') {
      webapp.BackButton.hide()
      return
    }

    webapp.BackButton.show()
  }, { immediate: true })

  return {
    provide: {
      webapp,
      haptic,
    },
  }
})
