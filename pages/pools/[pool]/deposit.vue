<script setup lang="ts">
import { pools } from '~/entities/pool'

const route = useRoute()

const pool = pools.find(pool => pool[0].toLowerCase() === String(route.params.pool).toLowerCase())
if (!pool) {
  showError({
    status: 404,
    message: 'Pool not found. Make sure this pool exists or try a bit later.',
  })
}
const poolAddress = pool?.[1]
</script>

<template>
  <div>
    <div
      :class="$style.header"
      class="flex-between p1 mb-24"
    >
      <h1 class="weight-600">
        Deposit to pool
      </h1>
      <p
        v-if="pool"
        class="weight-600"
      >
        {{ pool[0] }}
      </p>
    </div>

    <LiquidityAddForm
      v-if="poolAddress"
      :pool-address="poolAddress"
    />
  </div>
</template>

<style module lang="scss">
.header {
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
