import curve from '@curvefi/api'
import { until } from '@vueuse/core'
import axios from 'axios'
import {
  EVM_CHAIN_ID,
  EVM_PROVIDER_URL,
  EVM_TAC_ADDRESS, EVM_WTAC_ADDRESS,
} from '~~/entities/config'
import type { Pool, PoolCoin } from '~~/entities/pool'

const isLoading = ref(false)
const isLoaded = ref(false)
const poolsMap: Map<string, Pool> = reactive(new Map())
const coinsMap: Map<string, PoolCoin> = reactive(new Map())
const aprs: Ref<Record<string, number>> = ref({})

const pools = computed(() => [...poolsMap.values()])
const coins = computed(() => [...coinsMap.values()])

const init = async () => {
  try {
    isLoading.value = true
    updateMerklAPRs()
    await curve.init('JsonRpc', { url: EVM_PROVIDER_URL }, { chainId: EVM_CHAIN_ID })
    await updatePools()
    isLoaded.value = true
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isLoading.value = false
  }
}
const updatePools = async () => {
  poolsMap.clear()
  coinsMap.clear()
  // add native tac token
  coinsMap.set(EVM_TAC_ADDRESS, {
    address: EVM_TAC_ADDRESS,
    symbol: 'TAC',
    decimals: '18',
    usdPrice: 0,
    poolBalance: '',
    isBasePoolLpToken: false,
  })
  await Promise.allSettled([
    curve.stableNgFactory.fetchPools(),
    curve.twocryptoFactory.fetchPools(),
    // curve.tricryptoFactory.fetchPools(),
  ])

  for (const poolId of curve.getPoolList()) {
    const curvePool = curve.getPool(poolId)
    const pool = {
      ...curvePool,
      totalLiquidity: await curvePool.stats.totalLiquidity(),
    } as Pool
    if (pool && +pool.totalLiquidity > 0) { // show non-empty pools only
      // change wtac to tac in name
      pool.name = pool.name.toUpperCase().replace('WTAC', 'TAC')
      poolsMap.set(poolId, pool)

      pool.underlyingCoinAddresses.forEach((address, index) => {
        if (!coinsMap.has(address)) {
          coinsMap.set(address, {
            address,
            symbol: pool.underlyingCoins[index],
            decimals: String(pool.underlyingDecimals[index]),
            usdPrice: 0,
            poolBalance: '',
            isBasePoolLpToken: false,
          })
        }
      })
    }
  }
}
const updateMerklAPRs = async () => {
  aprs.value = {}
  const { data } = await axios.get('https://api.merkl.xyz/v4/opportunities', {
    params: {
      items: 50,
      mainProtocolId: 'curve',
      chainId: 239,
    },
  })
  data.forEach((opportunity: Record<string, unknown>) => {
    aprs.value[(opportunity.identifier as string).toLowerCase()] = opportunity.apr as number
  })
}
const getBestRouteAndOutput = async (
  inputCoin: string,
  outputCoin: string,
  amount: string | number,
  reversed: boolean = false,
) => {
  await until(isLoaded).toBe(true)
  let fromAmount = amount
  if (reversed) {
    fromAmount = await curve.router.required(inputCoin, outputCoin, amount)
  }

  const { route, output } = await curve.router.getBestRouteAndOutput(inputCoin, outputCoin, fromAmount)
  const priceImpact = await curve.router.priceImpact(inputCoin, outputCoin, fromAmount)
  return {
    route,
    output: reversed ? fromAmount : output,
    priceImpact,
  }
}
const getUsdRate = async (coinAddress: string) => {
  return await curve.getUsdRate(coinAddress)
}
const getPool = async (id: string) => {
  await until(isLoaded).toBe(true)
  return poolsMap.get(id)
}
const getCoin = async (address: string, wtacToTac?: boolean) => {
  await until(isLoaded).toBe(true)
  if (wtacToTac && address === EVM_WTAC_ADDRESS) {
    return coinsMap.get(EVM_TAC_ADDRESS)
  }
  return coinsMap.get(address)
}
const getCurve = () => {
  return curve
}

init()

export const useCurve = () => {
  return {
    isLoaded,
    isLoading,
    poolsMap,
    coinsMap,
    pools,
    coins,
    aprs,
    getCoin,
    getPool,
    getCurve,
    getUsdRate,
    getBestRouteAndOutput,
  }
}
