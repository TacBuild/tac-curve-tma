<script setup lang="ts">
import type { TransactionLinker } from '@tonappchain/sdk'
import type { Token } from '~/entities/token'

defineEmits(['close'])
const { transactionLinker } = defineProps<{
  fromToken: Token
  toToken: Token
  fromValue: number | string
  toValue: number | string
  transactionLinker: TransactionLinker
}>()

const { operationId, status, error, destroy } = useOperationTracker(transactionLinker)
const date = new Date(transactionLinker.timestamp * 1000).toLocaleString()

onUnmounted(() => {
  destroy()
})
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      <div :class="$style.title">
        <p class="mb-4">
          Swap details
        </p>
        <p class="p4">
          {{ date }}
        </p>
      </div>
    </template>

    <TokenPairSwapInfo
      class="mb-16 mt-4"
      :from-token="fromToken"
      :to-token="toToken"
      :from-value="fromValue"
      :to-value="toValue"
    />

    <HistoryTransactionProgressList
      v-if="!error"
      :operation-id="operationId"
      :status="status"
      class="mb-24"
    />

    <p
      v-else
      class="mt-8 mb-24 c-orange"
    >
      {{ error }}
    </p>

    <UiButton
      wide
      @click="$emit('close')"
    >
      Close
    </UiButton>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.title {
  display: flex;
  flex-direction: column;
}
</style>
