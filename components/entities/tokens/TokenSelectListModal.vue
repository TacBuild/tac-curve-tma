<script setup lang="ts">
import type { Token } from '~/entities/token'

const emits = defineEmits(['close', 'select'])
const { title = 'Select token', tokens, onSelect } = defineProps<{ title?: string, tokens: Token[], onSelect: (e: Token) => void }>()

const handleSelect = (token: Token) => {
  if (onSelect) {
    onSelect(token)
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
        v-for="token in tokens"
        :key="token.evmTokenAddress"
        :class="$style.item"
        @click="handleSelect(token)"
      >
        <BaseAvatar
          :src="token.logo"
          class="icon--32"
        />

        <p class="weight-700 p1">
          {{ token?.symbol || 'Unknown' }}
        </p>
      </li>
    </ul>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.TokenSelectList {
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
