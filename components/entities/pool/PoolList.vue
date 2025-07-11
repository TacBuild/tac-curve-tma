<script setup lang="ts">
import axios from 'axios'
import { Address } from '@ton/ton'
import { poolsWithTokens, type PoolWithTokens } from '~/entities/pool'
import { useModal } from '~/components/ui/composables/useModal'
import { PoolDetailModal } from '#components'

const { address } = useTonConnect()
const balances: Ref<Record<string, bigint>> = ref({})
const isBalancesLoading = ref(false)

const { getTacSdk, isLoaded } = useTac()
const modal = useModal()

const openDetail = (pool: PoolWithTokens) => {
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
    await Promise.all(poolsWithTokens.map(async (pool) => {
      tvmDict[pool.name] = await getTacSdk().getTVMTokenAddress(pool.address)
    }))

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
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isBalancesLoading.value = false
  }
}

updateBalances()

watch([address, isLoaded], () => {
  updateBalances()
})
</script>

<template>
  <ul :class="$style.PoolList">
    <li
      v-for="pool in poolsWithTokens"
      :key="pool.address"
      :class="$style.item"
      @click="openDetail(pool)"
    >
      <PoolItem
        :pool="pool"
        :balance="balances[pool.name]"
        :balance-loading="isBalancesLoading"
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
