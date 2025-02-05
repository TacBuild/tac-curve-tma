import { Network, TacSdk } from 'tac-sdk'
import type { ShallowRef } from 'vue'

const tacSdk: ShallowRef<TacSdk | undefined> = shallowRef()
const isLoaded = ref(false)

export const useTac = () => {
  const init = async () => {
    tacSdk.value = await TacSdk.create({
      network: Network.Testnet,
    })
    isLoaded.value = true
  }

  init()

  return {
    tacSdk,
    isLoaded,
  }
}
