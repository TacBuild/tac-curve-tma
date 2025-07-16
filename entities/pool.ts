import { type Token, tokens } from '~/entities/token'

export interface PoolWithTokens {
  name: string
  address: string
  tokens: [Token, Token]
}
const poolsDict: Record<string, string> = {
  'USDT-TON': '0x52297F3E1F099dA7f4fc0A66Bc8732016aB3F9b1',
  'USDT-wETH': '0xE9973C24945CB4B4e87DbEe6908DB5E07484113D',
  'USDT-cbBTC': '0xE5948A817d7A061a0eF40128E91379046Da1009e',
  'USDT-TAC': '0xAaD47973427b39bE737C1154F50DD6595083FA88',
  // 'TON-tsTON': '0x51d701D23E1e6a58202694352E486b3614b75946',
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
