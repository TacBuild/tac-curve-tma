<script setup lang="ts">
import type { HistoryTransactionRecord } from '~~/entities/history'

defineProps({
  records: {
    type: Array as PropType<HistoryTransactionRecord[]>,
    default: () => [],
  },
})
</script>

<template>
  <div :class="$style.HistoryTransactionList">
    <ul :class="$style.list">
      <li
        v-for="record in records"
        :key="record.hash"
        :class="$style.item"
      >
        <HistoryTransactionItem :record="record" />
      </li>
    </ul>
  </div>
</template>

<style module lang="scss">
.item {
  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);

    @media (prefers-color-scheme: dark) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
