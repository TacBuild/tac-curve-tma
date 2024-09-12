<script setup lang="ts">
import { gsap } from 'gsap';

const props = defineProps({
  error: {
    type: String,
    default: ''
  },
  noPadding: Boolean
});

const updateHeight = (el: Element) => {
  gsap.to(el, {
    duration: 0.3,
    ease: 'power1',
    height: props.error ? 'auto' : 0
  });
};
</script>

<template>
  <ClientOnly>
    <Transition
      name="fade-fast"
      appear
      @enter="updateHeight"
      @leave="updateHeight"
    >
      <div
        v-if="error"
        class="v-error"
      >
        <div :class="['v-error__wrap', '_noPadding']">
          <span
            role="alert"
            v-html="error"
          />
        </div>
      </div>
    </Transition>
  </ClientOnly>
</template>

<style lang='scss'>
  .v-error {
    overflow: hidden;
    height: 0;
    color: var(--ui-danger-color);

    &__wrap {
      display: flex;
      align-items: center;
      padding: 6px 0 0;

      &._noPadding {
        padding: 0;
      }

      svg {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        margin-right: 11px;
      }
    }
  }
</style>
