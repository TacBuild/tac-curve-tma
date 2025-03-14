<script setup lang="ts">
const { operationId, status } = defineProps<{ operationId: string, status: string }>()

const map: Record<string, number> = {
  '': 0,
  'EVMMerkleMessageCollected': 1,
  'EVMMerkleRootSet': 2,
  'EVMMerkleMessageExecuted': 3,
  'TVMMerkleMessageCollected': 4,
  'TVMMerkleRootSet': 5,
  'TVMMerkleMessageExecuted': 6,
}

const getStatus = (key: string) => {
  const currentIdx = map[status || '']
  const idx = map[key || ''] || 0
  if (currentIdx + 1 === idx) {
    return 'pending'
  }
  return currentIdx >= idx ? 'success' : undefined
}

const items: Ref<{ label: string, status: 'success' | 'error' | 'pending' | undefined }[]> = computed(() => {
  return [
    {
      label: 'Initialization, getting id of operation',
      status: operationId ? 'success' : 'pending',
    },
    {
      label: 'EVM message collected',
      status: operationId ? getStatus('EVMMerkleMessageCollected') : undefined,
    },
    {
      label: 'EVM message executing',
      status: getStatus('EVMMerkleRootSet'),
    },
    {
      label: 'EVM message executed',
      status: getStatus('EVMMerkleMessageExecuted'),
    },
    {
      label: 'TVM message collected',
      status: getStatus('TVMMerkleMessageCollected'),
    },
    {
      label: 'TVM message executing',
      status: getStatus('TVMMerkleRootSet'),
    },
    {
      label: 'TVM message executed, complete',
      status: getStatus('TVMMerkleMessageExecuted'),
    },
  ]
})
</script>

<template>
  <ul :class="$style.HistoryTransactionProgressList">
    <li
      v-for="(item, idx) in items"
      :key="idx"
    >
      <HistoryTransactionProgressItem
        :label="item.label"
        :status="item.status"
      />
    </li>
  </ul>
</template>

<style module lang="scss">
.HistoryTransactionProgressList {
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > *:not(:last-child) {
    position: relative;
    &:before {
      position: absolute;
      left: 8px;
      bottom: -20px;
      content: "";
      width: 3px;
      height: 19px;
      background-image: url("data:image/svg+xml,<svg width=\"3\" height=\"19\" viewBox=\"0 0 3 19\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\"><g clip-path=\"url(%23clip0_3_2)\"><path d=\"M1.7207 17.4453V1\" stroke=\"%238E8E93\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-dasharray=\"4 6\"/></g><defs><clipPath id=\"clip0_3_2\"><rect width=\"3\" height=\"19\" fill=\"white\"/></clipPath></defs></svg>");
    }
  }
}
</style>
