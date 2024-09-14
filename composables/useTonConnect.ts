import { type Account, CHAIN, THEME, TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui';

export const useTonConnect = () => {
  const { $isTelegram, $config } = useNuxtApp();

  const isLoaded = ref(false);
  const account: Account = reactive({} as Account);

  const tonConnectUI = new TonConnectUI({
    manifestUrl: $config.public.tonconnectManifestUrl as string
  });
  Object.assign(account, tonConnectUI.account);
  tonConnectUI.uiOptions = {
    uiPreferences: {
      theme: THEME.LIGHT,
      borderRadius: 'none'
    },
    actionsConfiguration: {
      twaReturnUrl: $config.public.telegramMiniAppBotUrl as `${string}://${string}`
    }
  };

  tonConnectUI.connectionRestored.then(() => {
    isLoaded.value = true;
  });
  tonConnectUI.onStatusChange((walletInfo) => {
    if (walletInfo?.account?.address) {
      Object.assign(account, walletInfo.account);
    }
  });

  const address = computed(() => account?.address || '');
  const friendlyAddress = computed(() => toUserFriendlyAddress(account?.address || ''));
  const isConnected = computed(() => Boolean(address.value));
  const getTonConnectUI = () => {
    return tonConnectUI;
  };
  const disconnect = async () => {
    Object.assign(account, {
      address: '',
      chain: '' as CHAIN,
      walletStateInit: '',
      publicKey: ''
    });

    await tonConnectUI.disconnect();
  };

  return {
    isLoaded,
    isConnected,
    address,
    friendlyAddress,
    getTonConnectUI,
    disconnect
  };
};
