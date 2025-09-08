<script setup lang="ts">
import type { PoolWithTokens } from '~~/entities/pool'
import type { Token } from '~~/entities/token'

defineProps<{
  tokenA?: Token
  tokenB?: Token
  valueA?: number | string
  valueB?: number | string
  pool: PoolWithTokens
  poolValue: number | string
}>()
</script>

<template>
  <div :class="$style.TransactionDetailsPool">
    <div
      :class="$style.info"
      class="mb-12"
    >
      <span class="weight-700">
        Pool
      </span>
      <span>
        {{ pool.name }}
      </span>
    </div>
    <div class="ui-separator mb-12" />
    <div
      v-if="tokenA"
      :class="$style.info"
      class="mb-8"
    >
      <div class="flex-center">
        <CoinAvatar
          :coins="[tokenA]"
          class="mr-8"
        />

        <span class="weight-700">
          {{ tokenA.symbol }}
        </span>
      </div>

      <span>
        {{ valueA || 0 }}
      </span>
    </div>
    <div
      v-if="tokenB"
      :class="$style.info"
      class="mb-12"
    >
      <div class="flex-center">
        <CoinAvatar
          :coins="[tokenB]"
          class="mr-8"
        />

        <span class="weight-700">
          {{ tokenB.symbol }}
        </span>
      </div>

      <span>
        {{ valueB || 0 }}
      </span>
    </div>
    <div class="ui-separator" />
    <div
      v-if="poolValue"
      :class="$style.info"
      class="mt-12"
    >
      <span class="weight-700">
        LP Tokens
      </span>

      <span>
        {{ poolValue }}
      </span>
    </div>
  </div>
</template>

<style module lang="scss">
.TransactionDetailsPool {
  display: flex;
  flex-direction: column;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
