export const IS_TESTNET = false

export const EVM_CHAIN_ID = IS_TESTNET ? 2390 : 239
export const EVM_PROVIDER_URL = IS_TESTNET
  ? 'https://rpc.ankr.com/tac_spb'
  : 'https://rpc.ankr.com/tac'

export const CURVE_HIGH_PRICE_IMPACT_PERCENT = 0.1
export const CURVE_ROUTER_PROXY = IS_TESTNET
  ? ''
  : '0xADb2b2F9c73967B55FFc0fAF9fC1ddA3670a0689'

export const EVM_TAC_ADDRESS = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
export const EVM_WTAC_ADDRESS = '0xb63b9f0eb4a6e6f191529d71d4d88cc8900df2c9'

export const TAC_SA_FACTORY_ADDRESS = IS_TESTNET
  ? '0x5919D1D0D1b36F08018d7C9650BF914AEbC6BAd6'
  : '0x070820Ed658860f77138d71f74EfbE173775895b'

export const MERKL_PROXY = IS_TESTNET
  ? ''
  : '0x74e6b5e701bA5de3245653d72A075c7709EeFDC4'
export const MERKL_API_BASE_URL = 'https://api.merkl.xyz/v4'
