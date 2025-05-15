<script setup lang="ts">
type RadioOption = {
  id: string | number
  label?: string
  value: unknown
  disabled?: boolean
  [key: string]: unknown
}
const { name = 'radio', direction = 'vertical' } = defineProps<{ name?: string, options: RadioOption[], direction?: 'vertical' | 'horizontal' }>()
const model = defineModel<unknown>({ default: undefined })
</script>

<template>
  <div
    class="v-radio"
    :class="[`v-radio--${direction}`]"
  >
    <label
      v-for="option in options"
      :key="option.id"
    >
      <input
        :value="option.value"
        type="radio"
        :name="name"
        :checked="model === option.value"
        :disabled="option.disabled"
        @input="model = option.value"
      >
      <slot :option="option">
        {{ option.label }}
      </slot>
    </label>
  </div>
</template>

<style lang="scss">
.v-radio {
  display: flex;
  flex-direction: column;
  gap: var(--ui-radio-gap-y);
  padding: 0;
  border: 0;

  & label {
    display: flex;
    gap: var(--ui-radio-gap-x);
  }

  & input[type="radio"] {
    position: relative;
    -webkit-appearance: none;
    appearance: none;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
    background-color: var(--ui-block-color);
    margin: 0;
    font: inherit;
    font-size: var(--ui-radio-font-size);
    line-height: var(--ui-radio-line-height);
    color: currentColor;
    width: var(--ui-radio-circle-size);
    height: var(--ui-radio-circle-size);
    flex-shrink: 0;
    box-shadow: 0 0 0 1px inset var(--ui-secondary-text-color);
    border-radius: 50%;

    &:before {
      position: absolute;
      content: "";
      display: none;
      width: var(--ui-radio-point-size);
      height: var(--ui-radio-point-size);
      border-radius: 50%;
      background-color: var(--ui-primary-color);
    }

    &[checked] {
      box-shadow: 0 0 0 1px inset var(--ui-primary-color);
    }

    &[checked]:before {
      display: block;
    }
  }

  &--horizontal {
    flex-direction: row;
    gap: var(--ui-radio-horizontal-gap)
  }
}
</style>
