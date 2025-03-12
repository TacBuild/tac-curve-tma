<script setup lang="ts">
import type { Token } from '~/entities/token'

const emits = defineEmits(['close', 'select'])
const { tokens, onSelect } = defineProps<{ tokens: Token[], onSelect: (e: Token) => void }>()

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
          Select token to swap
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
        <span
          :class="$style.icon"
          class="icon icon--32"
          :style="{ backgroundImage: `url(${token.logo})` }"
        />

        <p class="weight-700 p1">
          {{ token?.tokenName || 'Unknown' }}
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
