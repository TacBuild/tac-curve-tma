<script setup lang="ts">
import type { PoolWithTokens } from '~/entities/pool'

defineProps<{
  pool: PoolWithTokens
  amount: number | string | undefined
}>()
</script>

<template>
  <div :class="$style.TransactionAssetsInfoToken">
    <div :class="$style.left">
      <BaseAvatar
        v-if="pool"
        style="flex-shrink: 0"
        :src="[pool.tokens[0].logo, pool.tokens[1].logo]"
      />

      <p
        v-if="amount !== undefined"
        class="p2 weight-700"
      >
        {{ amount }} {{ pool.name }}
      </p>
    </div>
    <!-- <div
      :class="$style.right"
      class="weight-400 c-secondary-text"
    >
      ~ $465.34
    </div> -->
  </div>
</template>

<style module lang="scss">
.TransactionAssetsInfoPool {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
