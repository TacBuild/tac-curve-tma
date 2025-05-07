<script setup lang="ts">
import type { Token } from '~/entities/token'

defineProps<{
  token: Token
  amount: number | string | undefined
}>()
</script>

<template>
  <div :class="$style.TransactionAssetsInfoToken">
    <div :class="$style.left">
      <BaseAvatar
        :class="$style.img"
        :src="token.logo"
      />

      <p
        v-if="amount !== undefined"
        class="p2 weight-700"
      >
        {{ amount }} {{ token.symbol }}
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
.TransactionAssetsInfoToken {
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
