import { Network, TacSdk } from '@tonappchain/sdk'
import { getAddress } from 'ethers'
import { until } from '@vueuse/core'

let tacSdk: TacSdk
const isLoaded = ref(false)

export const useTac = () => {
  const { address, fetchTonBalanceBigInt } = useTonConnect()

  const init = async () => {
    tacSdk = await TacSdk.create({
      network: Network.MAINNET,
    })
    isLoaded.value = true
  }
  const getTacSdk = () => {
    return tacSdk
  }
  const fetchJettonBalance = async (evmAddress: string) => {
    const obj = {
      balance: 0n,
      decimals: 18,
    }
    await until(isLoaded).toBe(true)

    try {
      const sdk = getTacSdk()
      const tvmAddress = await sdk.getTVMTokenAddress(getAddress(evmAddress))
      if (tvmAddress === 'NONE') {
        obj.balance = await fetchTonBalanceBigInt()
        obj.decimals = 9
        return obj
      }
      const res = await sdk.getUserJettonBalanceExtended(
        address.value,
        tvmAddress,
      )
      if (res.exists) {
        obj.balance = res.rawAmount
        obj.decimals = res.decimals
      }
      return obj
    }
    catch (e) {
      console.warn(e)
      return obj
    }
  }

  return {
    tacSdk,
    isLoaded,
    init,
    getTacSdk,
    fetchJettonBalance,
  }
}
