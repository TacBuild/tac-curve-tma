import { type Token, tokens } from '~/entities/token'

export interface PoolWithTokens {
  name: string
  address: string
  tokens: [Token, Token]
}
const poolsDict: Record<string, string> = {
  'TON-USDT': '0xd1c54012bbd50830712B9EF199EF149bad082182',
  'TON-USDE': '0x8e94772eEBc6DC6aF743f81967E0680D04474Df6',
  'TON-WETH': '0xBE606Fec2a967Cbcc599A8C9a1E541947eCE575B',
  'USDT-WETH': '0xC0239492e7F6052a7a8E7fA527F2E6aC97de2C76',
  'TON-ezETH': '0xD7c6A8832258e5c184d31365C925a71C8176Ff84',
  'TON-NOT': '0xb0450eDc5D9C0206fC821067BC5aAE0bCBcBe77E',
  'TON-HMSTR': '0xCC3177e285288355249731ACA25bbCcc2737a4ed',
  'TON-stTON': '0xB4F755c369349d0d3175FB94aAfCDBB7C4dcfc8f',
  'TON-tsTON': '0x6C1DdEA75EBDa178e9eA36Fe9c8DF45Bd0C8a371',
  'TON-REDO': '0xa6f0Ab44A1fBDe9CF531d0e248e2478032047E69',
  'TON-CATI': '0xC63AACC445270AD88Df596ca6ff1397e7EF8802D',
  'TON-STORM': '0xe27FccC0CcBa28D2A3d637F8206857Acf1a87CcE',
  'TON-DUREV': '0x1744364c5821438dA6aa5FFef83B274cE59e6ccd',
  'TON-NikoAI': '0x9369f5f29BC73926531A30A518Bc84f452694f61',
  'TON-STON': '0x92313AA11035Af4030A211f0cFd4FE9bd2CA589D',
  'TON-DOGS': '0x3dA2b24c85E660526622d6e8C2166A0ed11b255D',
  'TON-CATS': '0x3b02ed99EAb273ef8f48eBF017A46c03429d3717',
  'TON-wBTC': '0x83719828f6431d2fD6B26939c25e20a3E21b30Fe',
  'TON-LBTC': '0x52245063F44CE1c5dd4dec81217C4b6Af7a3Cd67',
  'TON-wTAC': '0xd6a612F8d8409917a79125A317Ea915FB1Ca3d77',
}
export const pools = Object.entries(poolsDict)
export const poolsWithTokens: PoolWithTokens[] = Object.keys(poolsDict).map((name) => {
  const keys = name.split('-')
  const foundTokens = keys.map((key: string) => tokens.find(token => key === token.symbol))

  return {
    name,
    address: poolsDict[name],
    tokens: foundTokens as [Token, Token],
  }
})
