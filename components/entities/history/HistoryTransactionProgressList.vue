<script setup lang="ts">
import { StageName } from '@tonappchain/sdk/dist/structs/Struct'
import { useClipboard } from '@vueuse/core'

const { copy, copied, isSupported } = useClipboard({ legacy: true })
const { operationId, status } = defineProps<{ operationId: string, status: string }>()

const map: Record<string, number> = {
  '': 0,
  [StageName.COLLECTED_IN_TAC]: 1,
  [StageName.INCLUDED_IN_TAC_CONSENSUS]: 2,
  [StageName.EXECUTED_IN_TAC]: 3,
  [StageName.COLLECTED_IN_TON]: 4,
  [StageName.INCLUDED_IN_TON_CONSENSUS]: 5,
  [StageName.EXECUTED_IN_TON]: 6,
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
      label: 'Collected in TAC',
      status: operationId ? getStatus(StageName.COLLECTED_IN_TAC) : undefined,
    },
    {
      label: 'Included in TAC consensus',
      status: getStatus(StageName.INCLUDED_IN_TAC_CONSENSUS),
    },
    {
      label: 'Executed in TAC',
      status: getStatus(StageName.EXECUTED_IN_TAC),
    },
    {
      label: 'Collected in TON',
      status: getStatus(StageName.COLLECTED_IN_TON),
    },
    {
      label: 'Included in TON consensus',
      status: getStatus(StageName.INCLUDED_IN_TON_CONSENSUS),
    },
    {
      label: 'Executed in TON',
      status: getStatus(StageName.EXECUTED_IN_TON),
    },
  ]
})

const copyOperationId = () => {
  if (!copied.value) {
    copy(operationId)
  }
}
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
      >
        <template v-if="idx === 0">
          <div
            v-if="operationId && isSupported"
            :class="$style.copy"
            class="c-secondary-text"
            @click="copyOperationId"
          >
            <UiIcon
              class="icon"
              name="copy"
            />
          </div>
        </template>
      </HistoryTransactionProgressItem>
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

.copy {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin: -7px;
  margin-left: auto;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
  }
}
</style>
