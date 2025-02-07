<script setup lang="ts">
import type { Token } from '~/entities/token'

defineProps<{
  fromToken: Token
  toToken: Token
  fromValue: number | string
  toValue: number | string
}>()
</script>

<template>
  <div :class="$style.TokenPairSwapInfo">
    <TokenPairSwapInfoItem
      :token="fromToken"
      :amount="fromValue"
    />
    <svg
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
    <TokenPairSwapInfoItem
      :token="toToken"
      :amount="toValue"
    />
  </div>
</template>

<style module lang="scss">
.TokenPairSwapInfo {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;

  svg {
    position: absolute;
    top: calc(50% - 7px);
    left: 8px;
  }
}
</style>
