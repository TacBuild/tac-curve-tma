<script setup lang="ts">
import { poolsWithTokens, type PoolWithTokens } from '~/entities/pool'

const props = defineProps<{ onSelect: (pool: PoolWithTokens) => void }>()
const emits = defineEmits(['close', 'select'])

const handleSelect = (pool: PoolWithTokens) => {
  props.onSelect(pool)
  emits('close')
}
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      <div :class="$style.title">
        <p class="mb-4">
          Select pool
        </p>
      </div>
    </template>

    <ul :class="$style.list">
      <li
        v-for="pool in poolsWithTokens"
        :key="pool.address"
        :class="$style.item"
        @click="handleSelect(pool)"
      >
        <BaseAvatar
          v-if="pool"
          class="icon--32"
          :src="[pool.tokens[0].logo, pool.tokens[1].logo]"
        />

        <p class="weight-700 p1">
          {{ pool.name }}
        </p>
      </li>
    </ul>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.TokenSelectList {
  //
}

.icon {
  background-position: center;
  background-size: contain;
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
