<script setup lang="ts">
import { UseImage } from '@vueuse/components'
import type { PoolCoin } from '~~/entities/pool'

defineOptions({
  inheritAttrs: false,
})
const { coins } = defineProps<{ coins: PoolCoin[] }>()

const getCoinLogo = (coin: PoolCoin) => {
  if (coin?.address) {
    return `https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets-tac/${coin.address.toLowerCase()}.png`
  }

  return '/tokens/default.png'
}
</script>

<template>
  <div :class="$style.BaseCoinAvatar">
    <UseImage
      v-for="(coin, idx) in coins"
      :key="idx"
      :src="getCoinLogo(coin)"
    >
      <span
        :class="$style.icon"
        class="icon"
        v-bind="$attrs"
        :style="{ backgroundImage: `url(${getCoinLogo(coin)})` }"
      />

      <template #error>
        <span
          :class="$style.icon"
          class="icon"
          v-bind="$attrs"
          :style="{ backgroundImage: `url(/tokens/default.png)` }"
        />
      </template>
    </UseImage>
  </div>
</template>

<style module lang="scss">
.BaseCoinAvatar {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  overflow: hidden;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  flex-shrink: 0;

  &:not(:first-child) {
    margin-left: -8px;
  }
}
</style>
