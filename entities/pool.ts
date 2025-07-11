import { type Token, tokens } from '~/entities/token'

export interface PoolWithTokens {
  name: string
  address: string
  tokens: [Token, Token]
}
const poolsDict: Record<string, string> = {
  'LADA-BMW': '0xc6e7c8DC7414C28C67de0238393e50431De83a69',
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
