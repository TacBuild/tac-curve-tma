<script setup lang="ts">
defineProps<{ label: string }>()
const model = defineModel<unknown>()
const isFocused = ref(false)

const classes = computed(() => {
  return {
    'is-focused': isFocused.value,
  }
})
</script>

<template>
  <div
    class="v-select v-input"
    :class="classes"
  >
    <div
      v-if="label || $slots.label"
      class="v-input__label"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </div>

    <select
      v-model="model"
      class="v-input__wrap"
      v-bind="$attrs"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
      <slot />
    </select>
  </div>
</template>

<style lang="scss">
.v-select {
  position: relative;

  & .v-input__wrap {
    cursor: default;
  }

  & .v-input__label {
    position: absolute;
    z-index: 1;
    left: 16px;
    top: 8px;
  }

  & select {
    width: 100%;
    padding-top: 22px;
    font-weight: var(--ui-font-weight);
    border-radius: 0;
  }

}
</style>
