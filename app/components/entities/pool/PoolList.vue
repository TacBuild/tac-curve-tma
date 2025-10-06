<script setup lang="ts">
import { useModal } from '~/components/ui/composables/useModal'
import { PoolDetailModal } from '#components'
import type { Pool } from '~~/entities/pool'

const modal = useModal()
const { isLoaded } = useTac()
const { isConnected } = useTonConnect()
const { pools, isLoading: isCurveLoading } = useCurve()
const { poolsBalances, updatePoolsBalances, isPoolsBalancesLoading } = useBalances()

let lastUpdated = 0

const sortedPools = computed(() => {
  return pools.value.toSorted((a, b) =>
    Number((poolsBalances.value[b.address] || 0n) - (poolsBalances.value[a.address] || 0n)))
})

const openDetail = (pool: Pool) => {
  modal.open(PoolDetailModal, {
    props: {
      pool,
    },
  })
}
const updateBalances = async () => {
  try {
    await updatePoolsBalances()
    lastUpdated = +new Date()
  }
  catch (e) {
    console.warn(e)
  }
}

onActivated(() => {
  const threshold = lastUpdated + (60 * 1000)
  if (lastUpdated && +new Date() > threshold) {
    updateBalances()
  }
})
watch([isLoaded, isCurveLoading, isConnected], () => {
  if (isLoaded.value && !isCurveLoading.value && isConnected.value) {
    updateBalances()
  }
}, { immediate: true })
</script>

<template>
  <div
    v-if="!isLoaded || isPoolsBalancesLoading || isCurveLoading"
    class="ui-loader center"
  />
  <ul
    v-else
    :class="$style.PoolList"
  >
    <li
      v-for="pool in sortedPools"
      :key="pool.address"
      :class="$style.item"
      @click="openDetail(pool)"
    >
      <PoolItem
        :pool="pool"
        :balance="poolsBalances[pool.address]"
        :balance-loading="!isLoaded || isPoolsBalancesLoading"
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

    @media (prefers-color-scheme: dark) {
      box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
