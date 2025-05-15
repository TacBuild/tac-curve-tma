import { type Token, tokens } from '~/entities/token'

export interface PoolWithTokens {
  name: string
  address: string
  tokens: [Token, Token]
}
const poolsDict: Record<string, string> = {
  'TON-USDT': '0xc856c1BEDb03Eb254c303bf133ACaE81d67d6A98',
  'TON-USDE': '0x0AC686a45c3823E59c95360c0a277Bb11F5C65E8',
  'TON-WETH': '0x5E3Cf7Eb13deD24Fe4729Fc47906979C9F1cB680',
  'TON-ezETH': '0x3F1d4f870Dd5FE00C526137164aA7208B16D4311',
  'TON-wBTC': '0xb18Aec1F4aE7c67e41dbF7A1044027e441296135',
  'TON-LBTC': '0x3a869Cce04CAdBa3fE4A0Fd5ef0BfF29a0b8979c',
  'TON-NOT': '0x47eCcf2cFafC93Fe7149f8249eD615B786610044',
  'TON-HMSTR': '0x5Fe6b5a40E9C45F6f6621eDdeEB9a191B2f252d1',
  'TON-DOGS': '0xbC24a9157860711C8Cb31d7C872CC94E4385Adeb',
  'TON-stTON': '0x3E5f421c06273566Afd0dBf352a98003D7e89119',
  'TON-tsTON': '0x283d80Fb8b52202AA43Fa276F0BA974DdC988932',
  'TON-REDO': '0x3F7AF0bb4253d66a24EdA897aCc29c706b5bd3c0',
  'TON-CATI': '0xc78D6d6abA83333E395d17A25F2Ed235511AAcD4',
  'TON-CATS': '0xb45fa957D4EC6d4fA7572800C622Bb591F70a436',
  'TON-STORM': '0x94aE727AdB7E9b0eFb863fCdBF32e19512493B2F',
  'TON-DUREV': '0xE980ddEE2d6DA2a4CC99F795AaB98420F4A0c523',
  'TON-NikoAI': '0x449143aab282929AAe303A09FDE948b737D2e5b1',
  'TON-STON': '0xa2b3579Bb73546b6856B30DF95fe38244d931664',
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
