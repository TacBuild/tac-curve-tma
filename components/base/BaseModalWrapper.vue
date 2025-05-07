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
        :class="$style.close"
        name="cross"
        class="icon--32 c-secondary-text"
        @click="$emit('close')"
      />
    </div>

    <div>
      <slot />
    </div>

    <slot name="bottom" />
  </div>
</template>

<style module lang="scss">
.BaseModal {
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 24px;
  background-color: var(--c-white);
  min-width: 375px;
  max-width: 600px;
  overflow: auto;
  max-height: calc(80dvh);

  @include respond-to(mobile) {
    top: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    min-width: 100%;
    padding: 16px;
    max-height: calc(90dvh);
    transform: translate(0, 0);
  }
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  min-height: 32px;
  font-size: 19px;
  line-height: 21px;
  font-weight: 600;
}

.close {
  cursor: pointer;
}
</style>
