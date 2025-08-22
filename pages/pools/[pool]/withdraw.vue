<script setup lang="ts">
import type { Pool } from '~/entities/pool'

const route = useRoute()
const { getPool, isLoading } = useCurve()
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
  <div class="flex column">
    <div
      :class="$style.header"
      class="flex-between p1 mb-24"
    >
      <h1 class="weight-600">
        Withdraw from pool
      </h1>
      <p
        v-if="pool"
        class="weight-600"
      >
        {{ pool.name }}
      </p>
    </div>

    <div
      v-if="isLoading"
      class="ui-loader mx-auto"
    />

    <LiquidityRemoveForm
      v-else-if="pool"
      :class="$style.form"
      :pool="pool"
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
