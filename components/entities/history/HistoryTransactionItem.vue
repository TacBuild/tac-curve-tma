<script setup lang="ts">
import type { HistoryTransactionRecord } from '~/entities/history'
import { useModal } from '~/components/ui/composables/useModal'
import { HistoryTransactionDetailsModal } from '#components'

const modal = useModal()
const props = defineProps({
  record: {
    type: Object as PropType<HistoryTransactionRecord>,
    default: () => ({}),
  },
})

const handleClick = () => {
  modal.open(HistoryTransactionDetailsModal)
}
</script>

<template>
  <div
    :class="$style.HistoryTransactionItem"
    role="button"
    @click="handleClick"
  >
    <div
      :class="$style.top"
      class="c-secondary-text"
    >
      <p class="p4">
        September 3, 2024
      </p>
      <p class="p4 right">
        2:18 PM
      </p>
    </div>
    <div :class="$style.content">
      <div :class="$style.icons">
        <div
          :class="$style.icon"
          :style="{ backgroundImage: 'url(/tokens/tac.png)' }"
          class="icon--32"
        />
        <div
          :class="$style.icon"
          :style="{ backgroundImage: 'url(/tokens/tac.png)' }"
          class="icon--32"
        />
      </div>
      <div :class="$style.values">
        <p class="weight-700 mb-2">
          ~0.18141830 ETH
        </p>

        <p class="p4 c-secondary-text">
          ~ $415.34
        </p>
      </div>

      <div :class="$style.status">
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.5 9C17.5 13.6944 13.6944 17.5 9 17.5C4.30558 17.5 0.5 13.6944 0.5 9C0.5 4.30558 4.30558 0.5 9 0.5C13.6944 0.5 17.5 4.30558 17.5 9Z"
            fill="#39B93A"
            stroke="#39B93A"
          />
          <path
            d="M5.22266 8.96919L7.81403 11.5605L12.9635 6.56055"
            stroke="white"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.HistoryTransactionItem {
  display: flex;
  flex-direction: column;
  padding: 16px 0;
  gap: 12px;
  width: 100%;
  cursor: pointer;
}

.top {
  display: flex;
  justify-content: space-between;
}

.content {
  display: flex;
  gap: 8px;
}

.status {
  margin-left: auto;
  margin-top: auto;
}

.icons {
  display: flex;
}

.icon {
  background-position: center;
  background-size: contain;

  &:last-child {
    margin-left: -16px;
  }
}
</style>
