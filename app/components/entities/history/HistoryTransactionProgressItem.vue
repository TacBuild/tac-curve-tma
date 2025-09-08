<script setup lang="ts">
const { label, link, status } = defineProps<{
  label: string
  link?: string
  status?: 'success' | 'error' | 'pending'
}>()
</script>

<template>
  <div :class="$style.HistoryTransactionProgressItem">
    <HistoryTransactionProgressIcon
      :class="$style.icon"
      :status="status"
    />

    <p class="p3">
      {{ label }}
    </p>

    <slot>
      <a
        v-if="link"
        :class="$style.link"
        href="link"
      >
        <svg
          width="17"
          height="16"
          viewBox="0 0 17 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.3877 2.66663H4.72103C3.98465 2.66663 3.3877 3.26358 3.3877 3.99996V12C3.3877 12.7363 3.98465 13.3333 4.72103 13.3333H12.721C13.4574 13.3333 14.0544 12.7363 14.0544 12V9.33329M8.05436 8.66663L14.0544 2.66663M14.0544 2.66663V5.99996M14.0544 2.66663H10.721"
            stroke="#8E8E93"
            stroke-width="1.2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    </slot>
  </div>
</template>

<style module lang="scss">
.HistoryTransactionProgressItem {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon {
  flex-shrink: 0;
}

.link {
  margin-left: auto;
}
</style>
