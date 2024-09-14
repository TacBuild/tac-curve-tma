export default defineNuxtPlugin(() => {
  const webapp = window.Telegram?.WebApp;
  if (!webapp) {
    return {
      provide: {
        webapp: {},
        haptic: {
          notificationOccurred: () => {}
        }
      }
    };
  }

  webapp.themeParams.bg_color = '#f2f2f7';
  const haptic = webapp.HapticFeedback;
  try {
    webapp.setHeaderColor(webapp.themeParams.bg_color);
  } catch (e) {
    console.warn('[TMA]:', e);
  }
  try {
    webapp.enableClosingConfirmation();
    webapp.expand();
  } catch (e) {
    console.warn('[TMA]:', e);
  }

  return {
    provide: {
      webapp,
      haptic
    }
  };
});
