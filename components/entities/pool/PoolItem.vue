<script setup lang="ts">
import type { PoolWithTokens } from '~/entities/pool'

const { pool, balance, balanceLoading } = defineProps<{ pool: PoolWithTokens, balance?: bigint, balanceLoading?: boolean }>()
</script>

<template>
  <div
    :class="$style.PoolItem"
    class="flex-center"
  >
    <BaseAvatar
      class="icon--32"
      :src="[pool.tokens[0].logo, pool.tokens[1].logo]"
    />

    <p class="weight-700 p2">
      {{ pool.name }}
    </p>

    <p class="right ml-auto">
      <span
        v-if="balance"
        class="weight-700"
      >
        {{ formatNumber(nanoToValue(balance || 0n, 18), 2, 2) }} LP
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
