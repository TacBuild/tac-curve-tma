import type { Account } from '@tonconnect/ui'
import { CHAIN, THEME, TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui'
import { Address, fromNano, TonClient } from '@ton/ton'
import { truncate } from '~/utils/string-utils'
import { SwapStatusModal } from '#components'
import { useModal } from '~/components/ui/composables/useModal'

const modal = useModal()

let client: TonClient
let tonConnectUI: TonConnectUI

const isLoaded = ref(false)
const walletName = ref('Wallet')
const account: Account = reactive({} as Account)

const address = computed(() => account?.address || '')
const chain = computed(() => account.chain)
const friendlyAddress = computed(() => account?.address ? toUserFriendlyAddress(account.address) : '')
const shortAddress = computed(() => friendlyAddress.value ? truncate(friendlyAddress.value) : '')
const shorterAddress = computed(() => friendlyAddress.value ? truncate(friendlyAddress.value, 3) : '')
const isConnected = computed(() => Boolean(address.value))

const init = () => {
  client = new TonClient({
    endpoint: 'https://rp.mainnet.tac.build/api/v2/jsonRPC',
  })
  tonConnectUI = new TonConnectUI({
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
      twaReturnUrl: 'https://t.me/tac_curve_bot',
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
}
const fetchTonBalance = async () => {
  try {
    const v = await client.getBalance(Address.parse(address.value))
    return +fromNano(v)
  }
  catch (e) {
    console.warn('Failed to fetchTonBalance: ' + e)
    return 0
  }
}
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

watch(chain, async (val) => {
  if (val === CHAIN.TESTNET) {
    modal.open(SwapStatusModal, {
      props: {
        title: 'Testnet Wallet cannot be connected',
        text: 'Only Mainnet wallets can be used in this app. Change network and try again',
        status: 'error',
        buttonLabel: 'Close',
      },
    })
    await disconnect()
  }
}, { immediate: true })

export const useTonConnect = () => {
  return {
    isLoaded,
    isConnected,
    address,
    friendlyAddress,
    walletName,
    shortAddress,
    shorterAddress,
    fetchTonBalance,
    getTonConnectUI,
    disconnect,
    init,
  }
}
