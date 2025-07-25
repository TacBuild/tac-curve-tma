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

    <div :class="$style.content">
      <slot />
    </div>

    <div
      v-if="$slots.bottom"
      :class="$style.bottom"
    >
      <slot
        name="bottom"
      />
    </div>
  </div>
</template>

<style module lang="scss">
.BaseModal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--c-white);
  min-width: 375px;
  max-width: 600px;
  overflow: auto;
  max-height: calc(80dvh);
  padding-bottom: 16px;

  @include respond-to(mobile) {
    top: auto;
    left: 0;
    bottom: 0;
    width: 100%;
    min-width: 100%;
    max-height: calc(90dvh);
    transform: translate(0, 0);
  }
}

.top {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 32px;
  margin-bottom: -16px;
  font-size: 19px;
  line-height: 21px;
  font-weight: 600;
  padding: 16px 24px;

  @include respond-to(mobile) {
    padding: 16px;
  }
}

.content {
  padding: 16px 24px;

  @include respond-to(mobile) {
    padding: 16px;
  }
}

.bottom {
  padding: 16px;
}

.close {
  cursor: pointer;
}
</style>
