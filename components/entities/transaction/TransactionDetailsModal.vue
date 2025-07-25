<script setup lang="ts">
import type { TransactionLinker } from '@tonappchain/sdk'
import type { Pool, PoolCoin } from '~/entities/pool'

defineEmits(['close'])
const { title = 'Operation details', transactionLinker } = defineProps<{
  type?: 'swap' | 'add-liquidity' | 'remove-liquidity'
  title?: string
  tokenA?: PoolCoin
  tokenB?: PoolCoin
  valueA?: number | string
  valueB?: number | string
  pool?: Pool
  poolValue?: number | string
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

    <div
      :class="$style.wrap"
      class="mt-16"
    >
      <TransactionAssetsInfo
        class="mb-16"
        :type="type"
        :token-a="tokenA"
        :token-b="tokenB"
        :value-a="valueA"
        :value-b="valueB"
        :pool="pool"
        :pool-value="poolValue"
      />

      <HistoryTransactionProgressList
        v-if="!error"
        :operation-id="operationId"
        :status="status"
        class="mb-24 mt-12"
      />

      <p
        v-else
        class="mt-8 mb-24 c-orange"
      >
        {{ error }}
      </p>
    </div>

    <UiButton
      wide
      @click="$emit('close')"
    >
      Close
    </UiButton>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.title, .wrap {
  display: flex;
  flex-direction: column;
}
</style>
