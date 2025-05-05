import { Network, TacSdk } from '@tonappchain/sdk'
import type { ShallowRef } from 'vue'
import { TonClient } from '@ton/ton'

const tacSdk: ShallowRef<TacSdk | undefined> = shallowRef()
const isLoaded = ref(false)

export const useTac = () => {
  const config = useRuntimeConfig().public

  const init = async () => {
    tacSdk.value = await TacSdk.create({
      network: Network.TESTNET,
      TONParams: config.toncenterApiKey
        ? {
            contractOpener: new TonClient({
              endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
              apiKey: config.toncenterApiKey || '',
            }),
          }
        : undefined,
    })
    isLoaded.value = true
  }

  return {
    tacSdk,
    isLoaded,
    init,
  }
}
