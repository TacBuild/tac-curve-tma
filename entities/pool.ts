import type { PoolTemplate } from '@curvefi/api/lib/pools'

export const STABLE_PROXY_ADDRESS = '0xfC99BD3dAABAcAC47c1040421A3Fb05bbf8c2b4b'
export const TWO_PROXY_ADDRESS = '0x402879F4a18C79747177a91DDeAb1aB18f97503F'

export interface PoolCoin {
  address: string
  usdPrice: null | number
  decimals: string
  isBasePoolLpToken: boolean
  symbol: string
  poolBalance: string
}

export interface Pool extends PoolTemplate {
  originalName: string
  totalLiquidity: string
  merklApr: number
  usdRate: number
}

export const getProxyAddressByPoolImplementation = (implementation?: string) => {
  if (implementation === 'plainstableng') {
    return STABLE_PROXY_ADDRESS
  }
  return TWO_PROXY_ADDRESS
}
