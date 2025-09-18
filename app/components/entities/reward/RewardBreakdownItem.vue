<script setup lang="ts">
import type { Reward } from '~~/entities/merkl'

const {
  name,
  total,
  images,
  token,
} = defineProps<{
  name: string
  total: number
  images: string[]
  token: Reward['token']
}>()
</script>

<template>
  <div
    :class="$style.RewardBreakdownItem"
    class="flex-between flex-center gap-8"
  >
    <div
      class="flex-center gap-8"
      style="flex: 1"
    >
      <BaseAvatar
        v-if="images.length"
        :src="images"
      />

      <p>
        {{ name || 'Other source' }}
      </p>
    </div>

    <span class="weight-600 right ml-auto">
      {{ formatNumber(total, 2) }} {{ token.symbol === 'WTAC' ? 'TAC' : token.symbol }}
    </span>
  </div>
</template>

<style module lang="scss">
.RewardBreakdownItem {
  flex-wrap: wrap;
}
</style>
