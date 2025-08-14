<script setup lang="ts">
import axios from 'axios'
import { Address } from '@ton/ton'
import { useModal } from '~/components/ui/composables/useModal'
import { PoolDetailModal } from '#components'
import type { Pool } from '~/entities/pool'

const modal = useModal()
const { pools } = usePools()
const { address, isConnected } = useTonConnect()
const { getTacSdk, isLoaded } = useTac()

const balances: Ref<Record<string, bigint>> = ref({})
const isBalancesLoading = ref(false)

let lastUpdated = 0

const openDetail = (pool: Pool) => {
  modal.open(PoolDetailModal, {
    props: {
      pool,
    },
  })
}
const updateBalances = async () => {
  try {
    isBalancesLoading.value = true
    balances.value = {}
    if (!address.value || !isLoaded.value) {
      return
    }
    const tvmDict: Record<string, string | bigint> = {}
    const batchSize = 5
    for (let i = 0; i < pools.value.length; i += batchSize) {
      const batch = pools.value.slice(i, i + batchSize)
      await Promise.allSettled(batch.map(async (pool) => {
        const addr = await getTacSdk().getTVMTokenAddress(pool.address).catch(() => undefined)
        if (addr) {
          tvmDict[pool.address] = addr
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

    Object.entries(tvmDict).map((o) => {
      const wallet = data.jetton_wallets.find((w: { jetton: string }) => w.jetton === (Address.parse(o[1] as string).toRawString()).toUpperCase())
      tvmDict[o[0]] = BigInt(wallet?.balance || 0)
    })

    balances.value = tvmDict as Record<string, bigint>
    lastUpdated = +new Date()
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isBalancesLoading.value = false
  }
}

onActivated(() => {
  const threshold = lastUpdated + (60 * 1000)
  if (lastUpdated && +new Date() > threshold) {
    updateBalances()
  }
})
watch([pools, isLoaded, isConnected], () => {
  if (isLoaded.value && pools.value.length && isConnected.value) {
    updateBalances()
  }
}, { immediate: true })
</script>

<template>
  <ul :class="$style.PoolList">
    <li
      v-for="pool in pools"
      :key="pool.address"
      :class="$style.item"
      @click="openDetail(pool)"
    >
      <PoolItem
        :pool="pool"
        :balance="balances[pool.address]"
        :balance-loading="!isLoaded || isBalancesLoading"
      />
    </li>
  </ul>
</template>

<style module lang="scss">
.PoolList {
  //
}

.item {
  padding: 16px 0;

  &:not(:last-child) {
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
