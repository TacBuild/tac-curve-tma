<script setup lang="ts">
import type { TransactionLinker } from '@tonappchain/sdk'
import type { Token } from '~~/entities/token'

defineEmits(['close'])
const { title = 'Swap details', transactionLinker } = defineProps<{
  title: string
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
          {{ title }}
        </p>
        <p class="p4">
          {{ date }}
        </p>
      </div>
    </template>

    <TransactionAssetsInfo
      class="mb-16 mt-4"
      :token-a="fromToken"
      :token-b="toToken"
      :value-a="fromValue"
      :value-b="toValue"
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
