<script setup lang="ts">
import { formatUnits } from 'ethers'
import { compactNumber } from '~/utils/string-utils'
import type { Pool } from '~~/entities/pool'

const { pool, balance, balanceLoading } = defineProps<{ pool: Pool, balance?: bigint, balanceLoading?: boolean }>()
const { isConnected } = useTonConnect()
const { coinsMap } = useCurve()
const { aprs } = useMerkl()

const coins = computed(() => [
  coinsMap.get(pool.underlyingCoinAddresses[0]!)!,
  coinsMap.get(pool.underlyingCoinAddresses[1]!)!,
])
</script>

<template>
  <div
    :class="$style.PoolItem"
    class="flex-center"
  >
    <CoinAvatar
      class="icon--32"
      :coins="coins"
    />

    <p class="weight-700 p2">
      {{ pool.name }}
    </p>

    <div
      :class="$style.values"
      class="right ml-auto "
    >
      <template v-if="!balanceLoading">
        <p v-if="aprs[pool.address]">
          {{ formatPercent(aprs[pool.address]! / 100) }} APR
        </p>

        <p v-if="isConnected && balance">
          <span class="weight-700">
            {{ compactNumber(formatUnits(balance || 0n, 18), 4) }} LP
          </span>
        </p>
      </template>

      <template v-else>
        <span class="ui-loader" />
      </template>
    </div>
  </div>
</template>

<style module lang="scss">
.PoolItem {
  flex-wrap: wrap;
  cursor: pointer;
  gap: 8px;
}

.values {
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 8px;
  height: 24px;
}
</style>
