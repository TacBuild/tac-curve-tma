import { type Token, tokens } from '~/entities/token'

export interface PoolWithTokens {
  name: string
  address: string
  tokens: [Token, Token]
}
const poolsDict: Record<string, string> = {
  'TON-USDT': '0x88EF664a8fEBC498E1365f395626362496eD3503',
  'TON-USDE': '0xd7691cB963BF07C9f421b3F9507E479c9103F1b2',
  'TON-WETH': '0xA07973ACEA699B8117188c9F1dc4F63D8F790507',
  'TON-ezETH': '0x7fBD83bD004c85c0E858aaf7cF0aDC2d9B6cac98',
  'TON-wBTC': '0xcD47Ea08Db1dd7eedB04ea88e5048AE8B7321D87',
  'TON-LBTC': '0xc1678BFB680C4Cb507cDAd27bf22286d21Adca70',
  'TON-NOT': '0x3CC0FfBD96887b06e0e4E2b458629546178BC316',
  'TON-HMSTR': '0xB8b59E573e989151e4Bef726bb16205884342F7a',
  'TON-DOGS': '0x5b6779FcFd1546E5ee890F07E650742007144AaB',
  'TON-stTON': '0x1D977D920BeAD4Da27681c5b2cd82aB1003Da877',
  'TON-tsTON': '0xdc7a5511b2AD725C33C713B8D8551b02938506f5',
  'TON-REDO': '0x5B36946A6Ad9ADC22981Cacaa372Ab92fae2Ad7E',
  'TON-CATI': '0xe986B8ce3456e4B4E214225B11FE4Bfc5dD604fA',
  'TON-CATS': '0x144534e8C6e4E251c45717655D4faD45085180BB',
  'TON-STORM': '0xaBAc0E9e8B1c3D854AC628059313b4C5F3210209',
  'TON-DUREV': '0xc61d4813B3c274ce40EB00889cf58557BF2B3c85',
  'TON-NikoAI': '0x4458d2aDe8B0293f8da6cf839473FAd76c5A7A7C',
  'TON-STON': '0x67aB6BD94B3983d4B71a2645C36d68ad0C68348d',
  'USDT-WETH': '0x90c058Ef302395E8efD519cB1e7951D42fDCe10B',
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
