import { until } from '@vueuse/core'
import {
  fetchPools,
  getCoinsFromPools,
  type Pool,
  type PoolCoin,
} from '~/entities/pool'

const isLoaded = ref(false)
const isLoading = ref(false)
const pools: Ref<Pool[]> = ref([])
const coins: Ref<PoolCoin[]> = ref([])

const updatePools = async () => {
  try {
    isLoading.value = true
    pools.value = await fetchPools()
    coins.value = getCoinsFromPools(pools.value)
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isLoaded.value = true
    isLoading.value = false
  }
}
const getPool = async (address: string) => {
  await until(isLoaded).toBe(true)

  const pool = pools.value.find(pool => pool.address.toLowerCase() === address.toLowerCase())

  if (!pool) {
    throw new Error(`Pool with address ${address} not found`)
  }

  return pool
}

updatePools()
export const usePools = () => {
  return {
    pools,
    coins,
    isLoaded,
    isLoading,
    getPool,
    updatePools,
  }
}
