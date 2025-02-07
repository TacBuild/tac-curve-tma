import type { CHAIN, Account } from '@tonconnect/ui'
import { THEME, TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui'
import { truncate } from '~/utils/string-utils'

const config = useRuntimeConfig().public

const isLoaded = ref(false)
const account: Account = reactive({} as Account)
const walletName = ref('Wallet')
const address = computed(() => account?.address || '')

const tonConnectUI = new TonConnectUI({
  manifestUrl: 'https://curve.tac.build/tonconnect-manifest.json',
})
Object.assign(account, tonConnectUI.account)
tonConnectUI.uiOptions = {
  language: 'en',
  uiPreferences: {
    theme: THEME.LIGHT,
    borderRadius: 'none',
  },
  actionsConfiguration: {
    twaReturnUrl: config.telegramMiniAppBotUrl as `${string}://${string}`,
  },
}

tonConnectUI.connectionRestored.then(() => {
  isLoaded.value = true
})
tonConnectUI.onStatusChange((walletInfo) => {
  if (walletInfo?.account?.address) {
    Object.assign(account, walletInfo.account)
    walletName.value = walletInfo?.name
  }
})

export const useTonConnect = () => {
  const friendlyAddress = computed(() => account?.address ? toUserFriendlyAddress(account.address, true) : '')
  const shortAddress = computed(() => friendlyAddress.value ? truncate(friendlyAddress.value) : '')
  const shorterAddress = computed(() => friendlyAddress.value ? truncate(friendlyAddress.value, 3) : '')
  const isConnected = computed(() => Boolean(address.value))
  const getTonConnectUI = () => {
    return tonConnectUI
  }
  const disconnect = async () => {
    Object.assign(account, {
      address: '',
      chain: '' as CHAIN,
      walletStateInit: '',
      publicKey: '',
    })

    await tonConnectUI.disconnect()
  }

  return {
    isLoaded,
    isConnected,
    address,
    friendlyAddress,
    walletName,
    shortAddress,
    shorterAddress,
    getTonConnectUI,
    disconnect,
  }
}
