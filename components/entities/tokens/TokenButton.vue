<script setup lang="ts">
import type { Token } from '~/entities/token';

defineProps({
  token: {
    type: Object as PropType<Token>,
    default: () => ({} as Token)
  }
});
</script>

<template>
  <button :class="$style.TokenButton" type="button" @click.stop>
    <span :class="$style.icon" class="icon" :style="{ backgroundImage: `url(${token.iconUrl})` }" />
    <span class="mx-auto weight-700">
      {{ token.ticker }}
    </span>
  </button>
</template>

<style lang="scss" module>
.TokenButton {
  display: flex;
  align-items: center;
  background-color: #F8F8F9;
  box-shadow: 1px 0 0 0 #E8E8E9 inset, 0 1px 0 0 #E8E8E9 inset, -2px 0 0 0 #E8E8E9 inset, 0 -2px 0 0 #E8E8E9 inset;
  color: #484D56;
  height: 42px;
  padding: 9px;
  gap: 8px;
  min-width: 118px;
}

.icon {
  background-position: center;
  background-size: contain;
}
</style>
