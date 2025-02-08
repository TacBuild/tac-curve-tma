<script setup lang="ts">
defineEmits(['close'])
</script>

<template>
  <div :class="$style.BaseModal">
    <div :class="$style.top">
      <slot name="title">
        <span />
      </slot>
      <UiIcon
        name="cross"
        class="icon--32 c-secondary-text"
        @click="$emit('close')"
      />
    </div>

    <div class="mx-auto">
      <slot />
    </div>

    <slot name="bottom" />
  </div>
</template>

<style module lang="scss">
.BaseModal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 24px;
  background-color: var(--c-white);
  min-width: 375px;
  max-width: 600px;
  overflow: auto;
  max-height: calc(100svh - 32px);

  @include respond-to(mobile) {
    top: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    min-width: 100%;
    transform: translate(0, 0);
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
  }
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  min-height: 32px;
  font-size: 19px;
  line-height: 21px;
  font-weight: 600;
}
</style>
