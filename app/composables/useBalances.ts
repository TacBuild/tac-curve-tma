import { getAddress, parseUnits } from 'ethers'
import axios from 'axios'
import { Address } from '@ton/ton'
import { until } from '@vueuse/core'

const { getTacSdk, isLoaded: isSdkReady } = useTac()
const { address, isConnected, balance: tonBalance } = useTonConnect()
const { coins, pools, isLoaded, getUsdRate } = useCurve()

const isRatesLoaded = ref(false)
const isCoinsBalancesLoading = ref(false)
const isPoolsBalancesLoading = ref(false)

const jettonBalances: Ref<Record<string, bigint>> = ref({})
const jettonRates: Ref<Record<string, number>> = ref({})
const poolsBalances: Ref<Record<string, bigint>> = ref({})

const coinsBalances: ComputedRef<Record<string, bigint>> = computed(() => (
  {
    '0xb76d91340f5ce3577f0a056d29f6e3eb4e88b140': parseUnits(String(tonBalance.value), 9), // TON
    ...jettonBalances.value,
  }
))
const fetchBalancesByEvmAddresses = async (addresses: string[]) => {
  await until(isSdkReady).toBe(true)
  const tvmDict: Record<string, string | undefined> = {}
  const batchSize = 3
  for (let i = 0; i < addresses.length; i += batchSize) {
    const batch = addresses.slice(i, i + batchSize)
    await Promise.allSettled(batch.map(async (address) => {
      const addr = await getTacSdk().getTVMTokenAddress(getAddress(address)).catch((e) => {
        console.warn(e)
        return undefined
      })
      if (addr) {
        tvmDict[address] = addr === 'NONE' ? undefined : addr
      }
    }))
  }

  const { data } = await axios.get(`https://rp.mainnet.tac.build/api/v3/jetton/wallets`, {
    params: {
      jetton_address: Object.values(tvmDict),
      owner_address: [address.value],
      limit: 50,
    },
  })

  const balances: Record<string, bigint> = {}
  Object.entries(tvmDict).map((o) => {
    if (!o[1]) {
      return
    }
    const wallet = data.jetton_wallets.find((w: { jetton: string }) =>
      w.jetton === (Address.parse(o[1] as string).toRawString()).toUpperCase())
    balances[o[0]] = BigInt(wallet?.balance || 0)
  })

  return balances
}
const updateCoinsBalances = async () => {
  try {
    jettonBalances.value = {}
    if (!isConnected.value) {
      return
    }
    isCoinsBalancesLoading.value = true

    jettonBalances.value = await fetchBalancesByEvmAddresses(coins.value.map(c => c.address))
  }
  catch (e) {
    console.warn(e)
    throw e
  }
  finally {
    isCoinsBalancesLoading.value = false
  }
}
const updatePoolsBalances = async () => {
  try {
    await until(isLoaded).toBe(true)
    poolsBalances.value = {}
    if (!isConnected.value) {
      return
    }
    isPoolsBalancesLoading.value = true

    poolsBalances.value = await fetchBalancesByEvmAddresses(pools.value.map(c => c.address))
  }
  catch (e) {
    console.warn(e)
    throw e
  }
  finally {
    isPoolsBalancesLoading.value = false
  }
}
const updateCoinsRates = async () => {
  coins.value.map(async (c) => {
    jettonRates.value[c.symbol] = await getUsdRate(c.address)
  })
  isRatesLoaded.value = true
}

watch([isConnected, isLoaded], () => {
  if (!isConnected.value || !isLoaded.value) {
    jettonBalances.value = {}
    return
  }
  updateCoinsBalances()
})

export const useBalances = () => {
  return {
    isCoinsBalancesLoading,
    isPoolsBalancesLoading,
    coinsBalances,
    poolsBalances,
    jettonRates,
    isRatesLoaded,
    updateCoinsBalances,
    updatePoolsBalances,
    updateCoinsRates,
  }
}
