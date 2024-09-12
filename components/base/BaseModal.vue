<script setup lang="ts">
defineEmits(['close']);
defineProps({
  title: {
    type: String,
    default: ''
  },

  text: {
    type: String,
    default: ''
  },

  buttonLabel: {
    type: String,
    default: 'Great'
  }
});
</script>

<template>
  <div :class="$style.BaseModal">
    <div :class="$style.top">
      <span />
      <SvgIcon name="cross" class="icon--32 c-secondary-text" @click="$emit('close')" />
    </div>

    <div :class="$style.content" class="mx-auto">
      <p v-if="title" class="h1 center">
        {{ title }}
      </p>
      <p v-if="text" class="center c-secondary-text">
        {{ text }}
      </p>
    </div>

    <UiButton wide @click="$emit('close')">
      {{ buttonLabel }}
    </UiButton>
  </div>
</template>

<style lang="scss" module>
.BaseModal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 16px;
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
    transform: translate(0, 0);
  }
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 36px;
  height: 32px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 72px;
  max-width: 278px;
}
</style>
