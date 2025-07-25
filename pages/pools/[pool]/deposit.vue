<script setup lang="ts">
import type { Pool } from '~/entities/pool'
import { usePools } from '#imports'

const route = useRoute()
const { getPool, isLoading } = usePools()
const pool: Ref<Pool | undefined> = ref()

const load = async () => {
  try {
    pool.value = await getPool(route.params.pool as string)
  }
  catch (e) {
    console.warn(e)
    showError({
      status: 404,
      message: 'Pool not found. Make sure this pool exists or try a bit later.',
    })
  }
}

load()
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
        {{ pool.name }}
      </p>
    </div>

    <span
      v-if="isLoading"
      class="ui-loader"
    />

    <LiquidityAddForm
      v-else-if="pool"
      :class="$style.form"
      :pool-address="pool.address"
    />
  </div>
</template>

<style module lang="scss">
.header {
  padding-top: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.form {
  min-height: calc(100dvh - 180px);
}
</style>
