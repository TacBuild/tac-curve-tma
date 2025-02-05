import type { Address } from '@ton/ton'
import { fromNano, TonClient } from '@ton/ton'

export const SLIPPAGE_PERCENT_VALUE = 0.5
export const MIN_INPUT_SWAP_VALUE = 25

export const fetchTonBalance = async (address: Address) => {
  await new Promise(resolve => setTimeout(resolve, 1000))
  const client = new TonClient({ endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC' })

  try {
    const v = await client.getBalance(address)
    return +Number(fromNano(v)).toFixed(4)
  }
  catch (e) {
    console.warn('Failed to getTONBalance: ' + e)
    return 0
  }
}
