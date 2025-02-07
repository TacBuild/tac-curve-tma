<script setup lang="ts">
import type { Token } from '~/entities/token'

const props = defineProps<{
  token: Token
  amount: number | string
}>()
</script>

<template>
  <div :class="$style.TokenPairSwapInfoItem">
    <div :class="$style.left">
      <div :class="$style.img">
        <img
          :src="props.token.logo"
          :alt="props.token.tokenName"
        >
      </div>

      <p class="p2 weight-700">
        {{ amount }} {{ token.tokenName }}
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
.TokenPairSwapInfoItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.img {
  width: 24px;
  height: 24px;
  border-radius: 50%;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>
