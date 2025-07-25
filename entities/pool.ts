import axios from 'axios'

const USDT_WTAC_POOL_ADDRESS = '0xAaD47973427b39bE737C1154F50DD6595083FA88'
const WTAC_TON_POOL_ADDRESS = '0xed0CDC6363222eF823eF44d30B57f76CF980c368'
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
  const { data } = await axios.get<{ success: boolean, data: { poolData: Pool[] } }>
  ('https://api-core.curve.finance/v1/getPools/tac/factory-twocrypto')

  if (data.success) {
    // Get pools only with liquidity and display wtac as tac
    return data.data.poolData.filter(pool => pool.usdTotal > 0).map((pool) => {
      if (pool.address === USDT_WTAC_POOL_ADDRESS) {
        return convertUsdtWtacToUsdtTacPool(pool)
      }
      if (pool.address === WTAC_TON_POOL_ADDRESS) {
        return convertWtacTonToTacTonPool(pool)
      }

      return pool
    })
  }

  throw new Error('Unable to fetch pools')
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
