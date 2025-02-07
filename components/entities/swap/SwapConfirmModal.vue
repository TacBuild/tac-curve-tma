<script setup lang="ts">
import { fromNano, toNano } from '@ton/ton'
import type { Token } from '~/entities/token'

const { getSwapRates } = useSwap()

const props = defineProps<{
  poolAddress: string
  fromToken: Token
  toToken: Token
  fromValue: number | string
  swapMethod: 'get_dx' | 'get_dy'
  onConfirm: () => void
}>()
const emits = defineEmits(['close'])

const toValue = ref('')

const getRate = async () => {
  console.log(props.swapMethod, props.poolAddress, toNano(props.fromValue))
  const rate = await getSwapRates(props.swapMethod, props.poolAddress, toNano(props.fromValue), [0, 1])
  return Number(rate || 0)
}

const load = async () => {
  const rate = Number(props.fromValue) <= 0 ? 0 : await getRate()
  toValue.value = fromNano(rate)
}

load()

const onSubmit = () => {
  props.onConfirm()
  nextTick(() => {
    emits('close')
  })
}
</script>

<template>
  <form @submit.prevent="onSubmit">
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
        <UiButton
          class="mb-4"
          type="submit"
          wide
        >
          Confirm
        </UiButton>
        <UiButton
          type="button"
          wide
          color="secondary"
          @click="$emit('close')"
        >
          Close
        </UiButton>
      </template>
    </BaseModalWrapper>
  </form>
</template>

<style module lang="scss">
.info {
  display: flex;
  justify-content: space-between;
}
</style>
