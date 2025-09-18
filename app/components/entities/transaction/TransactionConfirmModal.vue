<script setup lang="ts">
import type { PoolWithTokens } from '~~/entities/pool'
import type { Token } from '~~/entities/token'

const { slippagePercent } = useTransaction()

const emits = defineEmits(['close'])
const { title = 'Confirm swap', type = 'swap', onConfirm } = defineProps<{
  title?: string
  type?: 'swap' | 'add-liquidity' | 'remove-liquidity'
  pool?: PoolWithTokens
  poolValue?: number | string
  tokenA?: Token
  tokenB?: Token
  valueA?: number | string
  valueB?: number | string
  onConfirm: () => void
}>()

const confirmBtnWrap = ref()

const onSubmit = () => {
  onConfirm()
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
      {{ title }}
    </template>

    <div :class="$style.wrap">
      <TransactionAssetsInfo
        class="mb-16"
        :type="type"
        :pool="pool"
        :pool-value="poolValue"
        :token-a="tokenA"
        :token-b="tokenB"
        :value-a="valueA"
        :value-b="valueB"
      />

      <p
        :class="$style.info"
        class="mb-12 mt-16"
      >
        <span class="weight-600">Slippage Tolerance</span>
        <span class="c-secondary-text weight-600">{{ slippagePercent }}%</span>
      </p>
    </div>

    <template #bottom>
      <div ref="confirmBtnWrap">
        <UiButton
          class="mb-16"
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

.wrap {
  display: flex;
  flex-direction: column;
}
</style>
