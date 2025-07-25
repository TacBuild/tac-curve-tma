import { Network, TacSdk } from '@tonappchain/sdk'

let tacSdk: TacSdk
const isLoaded = ref(false)

export const useTac = () => {
  const { address, fetchTonBalance } = useTonConnect()

  const init = async () => {
    tacSdk = await TacSdk.create({
      network: Network.MAINNET,
    })
    isLoaded.value = true
  }
  const getTacSdk = () => {
    return tacSdk
  }
  const fetchJettonBalanceByEvmAddress = async (evmAddress: string) => {
    try {
      const sdk = getTacSdk()
      const tvmAddress = await sdk.getTVMTokenAddress(evmAddress)
      if (tvmAddress === 'NONE') {
        return await fetchTonBalance()
      }
      const res = await sdk.getUserJettonBalanceExtended(
        address.value,
        tvmAddress,
      )
      return res?.exists ? res.amount : 0
    }
    catch (e) {
      console.warn(e)
      return 0
    }
  }

  return {
    tacSdk,
    isLoaded,
    init,
    getTacSdk,
    fetchJettonBalanceByEvmAddress,
  }
}
