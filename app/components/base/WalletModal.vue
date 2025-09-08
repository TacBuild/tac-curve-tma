<script setup lang="ts">
const { friendlyAddress, disconnect } = useTonConnect()
const emits = defineEmits(['close'])

const handleDisconnect = () => {
  disconnect()
  emits('close')
}
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      Connected wallet
    </template>

    <div
      :class="$style.wallet"
      class="mb-16"
    >
      <div
        class="flex-center p1 weight-600"
        style="word-break: break-all;"
      >
        <BaseAvatar
          src="/tokens/ton.png"
          class="mr-8 icon--32"
        />

        {{ friendlyAddress }}
      </div>
    </div>

    <UiButton
      wide
      :class="$style.btn"
      @click="handleDisconnect"
    >
      Disconnect
    </UiButton>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.wallet {
  min-height: 204px;
}
.btn {
  margin-top: auto;
}
</style>
