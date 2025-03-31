import { Network, TacSdk } from '@tonappchain/sdk'
import type { ShallowRef } from 'vue'

const tacSdk: ShallowRef<TacSdk | undefined> = shallowRef()
const isLoaded = ref(false)

export const useTac = () => {
  const init = async () => {
    tacSdk.value = await TacSdk.create({
      network: Network.TESTNET,
    })
    isLoaded.value = true
  }

  init()

  return {
    tacSdk,
    isLoaded,
  }
}
