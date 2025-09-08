<script setup lang="ts">
import type { PoolCoin } from '~~/entities/pool';

const emits = defineEmits(['close', 'select'])
const { title = 'Select token', coins, onSelect } = defineProps<{ title?: string, coins: PoolCoin[], onSelect: (e: PoolCoin) => void }>()

const handleSelect = (coin: PoolCoin) => {
  if (onSelect) {
    onSelect(coin)
  }
  emits('close')
}
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      <div :class="$style.title">
        <p class="mb-4">
          {{ title }}
        </p>
      </div>
    </template>

    <ul :class="$style.list">
      <li
        v-for="coin in coins"
        :key="coin.address"
        :class="$style.item"
        @click="handleSelect(coin)"
      >
        <CoinAvatar
          class="icon--32"
          :coins="[coin]"
        />

        <p class="weight-700 p1">
          {{ coin?.symbol || 'Unknown' }}
        </p>
      </li>
    </ul>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.CoinSelectListModal {
  //
}

.list {
  display: flex;
  flex-direction: column;
  margin: 0 -8px;
  margin-bottom: 8px;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--c-body-bg);
  }

  &:hover, &:active {
    cursor: pointer;
    background-color: var(--c-body-bg);
  }
}
</style>
