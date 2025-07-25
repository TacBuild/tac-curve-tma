<script setup lang="ts">
import type { Pool, PoolCoin } from '~/entities/pool'

defineProps<{
  type?: 'swap' | 'add-liquidity' | 'remove-liquidity'
  pool?: Pool
  poolValue?: number | string
  tokenA?: PoolCoin
  tokenB?: PoolCoin
  valueA?: number | string
  valueB?: number | string
}>()
</script>

<template>
  <div :class="$style.TransactionAssetsInfo">
    <!-- <template v-if="pool">
      <TransactionAssetsInfoPool
        :pool="pool"
        :amount="poolValue"
      />
    </template> -->
    <template v-if="type === 'swap'">
      <TransactionAssetsInfoToken
        v-if="tokenA"
        :token="tokenA"
        :amount="valueA"
      />
      <template v-if="tokenA && tokenB">
        <svg
          :class="$style.arrow"
          width="8"
          height="14"
          viewBox="0 0 8 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.642792 9.47202L1.24539 8.86369L3.75884 11.3681L3.75884 0.988709L4.63102 0.988709L4.63102 11.3681L7.13655 8.86369L7.74707 9.47202L4.19493 13.0113L0.642792 9.47202Z"
            fill="#8E8E93"
          />
        </svg>
      </template>
      <TransactionAssetsInfoToken
        v-if="tokenB"
        :token="tokenB"
        :amount="valueB"
      />
    </template>
    <TransactionDetailsPool
      v-else-if="pool"
      :token-a="tokenA"
      :token-b="tokenB"
      :value-a="valueA"
      :value-b="valueB"
      :pool="pool"
      :pool-value="poolValue || 0"
    />
  </div>
</template>

<style module lang="scss">
.TransactionAssetsInfo {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.arrow {
  position: absolute;
  top: calc(50% - 7px);
  left: 8px;
}

.plus {
  position: absolute;
  top: calc(50% - 10px);
  left: 7px;
}
</style>
