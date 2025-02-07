<script setup lang="ts">
import { tokens } from '~/entities/token'

defineEmits(['close'])
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      <div :class="$style.title">
        <p class="mb-4">
          Swap details
        </p>
        <p class="p4">
          September 3, 2024,  2:18 PM
        </p>
      </div>
    </template>

    <TokenPairSwapInfo
      class="mb-16 mt-4"
      :from-token="tokens[0]"
      :to-token="tokens[1]"
      from-value="1"
      to-value="1"
    />

    <HistoryTransactionProgressList class="mb-24" />`

    <UiButton
      wide
      @click="$emit('close')"
    >
      Back
    </UiButton>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.title {
  display: flex;
  flex-direction: column;
}
</style>
