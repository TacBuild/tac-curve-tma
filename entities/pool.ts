import axios from 'axios'

const USDT_WTAC_POOL_ADDRESS = '0xAaD47973427b39bE737C1154F50DD6595083FA88'
const WTAC_TON_POOL_ADDRESS = '0xed0CDC6363222eF823eF44d30B57f76CF980c368'
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

export interface Pool {
  id: string
  address: string
  coinsAddresses: [
    string,
    string,
  ]
  decimals: [string, string]
  virtualPrice: string
  amplificationCoefficient: string
  name: string
  symbol: string
  totalSupply: string
  implementationAddress: string
  priceOracle: number
  usdTotal: number
  implementation: string
  assetTypeName: string
  coins: [PoolCoin, PoolCoin]
  poolUrls: {
    swap: string[]
    deposit: string[]
    withdraw: string[]
  }
  lpTokenAddress: string
  isMetaPool: boolean
  usdTotalExcludingBasePool: number
  usesRateOracle: boolean
  isBroken: boolean
  merkl: {
    apr: number
  }
}

const convertUsdtWtacToUsdtTacPool = (pool: Pool): Pool => {
  return {
    ...pool,
    coinsAddresses: [
      '0xAF988C3f7CB2AceAbB15f96b19388a259b6C438f',
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    ],
    name: 'USDT/TAC',
    symbol: 'USDT-TAC',
    coins: [
      { ...pool.coins[0] },
      { ...pool.coins[1],
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'TAC' },
    ],
  }
}

const convertWtacTonToTacTonPool = (pool: Pool): Pool => {
  return {
    ...pool,
    coinsAddresses: [
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      '0xb76d91340F5CE3577f0a056D29f6e3Eb4E88B140',
    ],
    name: 'TAC/TON',
    symbol: 'TAC-TON',
    coins: [
      { ...pool.coins[0],
        address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        symbol: 'TAC' },
      pool.coins[1],
    ],
  }
}

export const fetchPools = async () => {
  const [twos, stables, { data: merklOpportunities }] = await Promise.all([
    await axios.get<{ success: boolean, data: { poolData: Pool[] } }>
    ('https://api-core.curve.finance/v1/getPools/tac/factory-twocrypto'),
    await axios.get<{ success: boolean, data: { poolData: Pool[] } }>
    ('https://api-core.curve.finance/v1/getPools/tac/factory-stable-ng'),
    await axios.get('https://api.merkl.xyz/v4/opportunities', {
      params: {
        items: 50,
        mainProtocolId: 'curve',
        chainId: 239,
      },
    }),
  ])

  const poolData: Pool[] = []
  if (!twos.data.success || !stables.data.success) {
  // if (!twos.data.success) {
    throw new Error('Unable to fetch pools')
  }

  if (twos.data.data.poolData) {
    poolData.push(...twos.data.data.poolData)
  }

  if (stables.data.data.poolData) {
    poolData.push(...stables.data.data.poolData)
  }

  // Get pools only with liquidity and display wtac as tac
  return poolData.filter(pool => pool.usdTotal > 0).map((pool) => {
    pool.merkl = { apr: 0 }
    const merklOpportunity = merklOpportunities
      .find((opportunity: Record<string, unknown>) => opportunity.identifier === pool.address)
    if (merklOpportunity) {
      pool.merkl.apr = merklOpportunity.apr
    }
    if (pool.address === USDT_WTAC_POOL_ADDRESS) {
      return convertUsdtWtacToUsdtTacPool(pool)
    }
    if (pool.address === WTAC_TON_POOL_ADDRESS) {
      return convertWtacTonToTacTonPool(pool)
    }

    return pool
  })
}

export const getCoinsFromPools = (pools: Pool[]) => {
  const map = new Map<string, PoolCoin>()
  pools.forEach((pool) => {
    pool.coins.forEach((coin) => {
      map.set(coin.address, coin)
    })
  })
  return map.values().toArray()
}

export const getProxyAddressByPoolImplementation = (implementation?: string) => {
  if (implementation === 'plainstableng') {
    return STABLE_PROXY_ADDRESS
  }
  return TWO_PROXY_ADDRESS
}
