<script setup lang="ts">
import { formatUnits } from 'ethers'
import type { Pool } from '~/entities/pool'
import { compactNumber, formatPercent } from '~/utils/string-utils'

const { pool, balance, balanceLoading } = defineProps<{ pool: Pool, balance?: bigint, balanceLoading?: boolean }>()
const { isConnected } = useTonConnect()
</script>

<template>
  <div
    :class="$style.PoolItem"
    class="flex-center"
  >
    <CoinAvatar
      class="icon--32"
      :coins="pool.coins"
    />

    <p class="weight-700 p2">
      {{ pool.name }}
    </p>

    <div
      :class="$style.values"
      class="right ml-auto weight-700"
    >
      <template v-if="!balanceLoading">
        <p v-if="pool.merkl.apr">
          {{ formatPercent(pool.merkl.apr / 100) }} APR
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
