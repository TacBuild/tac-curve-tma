import { fromNano } from '@ton/ton'

export const MIN_SLIPPAGE_PERCENT_VALUE = 0.1
export const MAX_SLIPPAGE_PERCENT_VALUE = 5.0
export const DEFAULT_SLIPPAGE_PERCENT_VALUE = 0.5

export const nanoToValue = (src: bigint | number | string, decimals: number = 9) => {
  const pw = 9 - decimals
  return +fromNano(pw < 0 ? BigInt(src) / 10n ** BigInt(Math.abs(pw)) : BigInt(src) * 10n ** BigInt(pw))
}

export const valueToNano = (src: number | string, decimals: number = 9) => {
  return BigInt(Math.ceil(+(+src).toFixed(decimals) * 10 ** decimals))
}
