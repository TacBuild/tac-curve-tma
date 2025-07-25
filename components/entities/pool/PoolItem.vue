<script setup lang="ts">
import { formatUnits } from 'ethers'
import type { Pool } from '~/entities/pool'

const { pool, balance, balanceLoading } = defineProps<{ pool: Pool, balance?: bigint, balanceLoading?: boolean }>()
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

    <p class="right ml-auto">
      <span
        v-if="balance"
        class="weight-700"
      >
        {{ formatNumber(formatUnits(balance || 0n, 18), 2) }} LP
      </span>
      <span
        v-else-if="balanceLoading"
        class="ui-loader"
      />
    </p>
  </div>
</template>

<style module lang="scss">
.PoolItem {
  cursor: pointer;
  gap: 8px;
}
</style>
