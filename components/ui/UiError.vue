<script setup lang="ts">
defineProps({
  error: {
    type: String,
    default: '',
  },
  noPadding: Boolean,
})
</script>

<template>
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
</template>

<style lang='scss'>
  .v-error {
    font-size: 14px;
    margin-top: 2px;
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
