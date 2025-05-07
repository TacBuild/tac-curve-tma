<script setup lang="ts">
import type { PoolWithTokens } from '~/entities/pool'

const { pool } = defineProps<{ pool: PoolWithTokens }>()
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
  </div>
</template>

<style module lang="scss">
.PoolItem {
  cursor: pointer;
  gap: 8px;
}
</style>
