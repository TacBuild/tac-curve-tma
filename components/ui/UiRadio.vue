<script setup lang="ts">
type RadioOption = {
  id: string;
  label: string;
  value: unknown;
  disabled?: boolean;
}
const props = defineProps({
  name: {
    type: String,
    default: ''
  },

  options: {
    type: Array as PropType<RadioOption[]>,
    default: () => []
  }
});
const model = defineModel<unknown>({ default: undefined });
</script>

<template>
  <div class="v-radio">
    <label
      v-for="option in (props.options as RadioOption[])"
      :key="option.id"
    >
      <input
        :id="option.id"
        :value="option.value"
        type="radio"
        :name="props.name"
        :checked="model === option.value"
        :disabled="option.disabled"
        @input="model = option.value"
      >
      <slot :name="`slot-${option.id}`" :option="option">
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
}
</style>
