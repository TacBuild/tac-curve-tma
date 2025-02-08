<script setup lang="ts">
import type { Token } from '~/entities/token'

const emits = defineEmits(['close'])
const props = defineProps<{
  poolAddress: string
  fromToken: Token
  toToken: Token
  toValue: number | string
  fromValue: number | string
  onConfirm: () => void
}>()

const confirmBtnWrap = ref()

const onSubmit = () => {
  props.onConfirm()
  nextTick(() => {
    emits('close')
  })
}

onMounted(() => {
  const btn = confirmBtnWrap.value.firstChild as HTMLButtonElement
  if (btn) {
    btn.focus()
  }
})
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      Confirm swap
    </template>

    <TokenPairSwapInfo
      class="mb-16"
      :from-token="fromToken"
      :to-token="toToken"
      :from-value="fromValue"
      :to-value="toValue"
    />

    <!-- <p
        :class="$style.info"
        class="mb-12"
      >
        <span class="weight-600">Rate:</span>
        <span class="c-secondary-text weight-600">
          1 TON ≈ 5.73705 USDT
        </span>
      </p> -->

    <p
      :class="$style.info"
      class="mb-12"
    >
      <span class="weight-600">Slippage tolerance:</span>
      <span class="c-secondary-text weight-600">0.5%</span>
    </p>

    <p
      :class="$style.info"
      class="mb-24"
    >
      <span class="weight-600">Network fee</span>
      <span class="c-secondary-text weight-600">~0.14 TON</span>
    </p>

    <template #bottom>
      <div ref="confirmBtnWrap">
        <UiButton
          class="mb-4"
          wide
          @click="onSubmit"
        >
          Confirm
        </UiButton>
      </div>

      <UiButton
        wide
        color="secondary"
        @click="$emit('close')"
      >
        Close
      </UiButton>
    </template>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.info {
  display: flex;
  justify-content: space-between;
}
</style>
