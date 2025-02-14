<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
const model = defineModel<string | number>({ default: '' })
const emits = defineEmits(['blur', 'focus', 'enter', 'input', 'change', 'update:model-value'])
const props = defineProps<{
  label?: string
  color?: string
  error?: string
  disabled?: boolean
  onlyNumber?: boolean
}>()
const isFocused = ref(false)
const inputRef = ref()

const classes = computed(() => {
  return {
    'is-focused': isFocused.value,
    'is-disabled': props.disabled,
    'has-value': Boolean(model.value),
    'has-error': Boolean(props.error),
  }
})

const onFocus = (e: Event) => {
  if (props.disabled) {
    return
  }

  isFocused.value = true
  emits('focus', e)
}
const onBlur = (e: Event) => {
  isFocused.value = false
  emits('blur', e)
}
const onInput = (e: Event) => {
  let value = (e.target as HTMLInputElement).value
  value = value.replace(',', '.')
  if (props.onlyNumber && isNaN(Number(value)) && Boolean(value)) {
    (e.target as HTMLInputElement).value = String(model.value)
  }
  else {
    model.value = value
  }
  emits('input', e)
}
</script>

<template>
  <div
    class="v-input"
    :class="classes"
  >
    <label
      class="v-input__wrap"
      @click="inputRef.focus()"
    >
      <div class="v-input__content">
        <div
          v-if="label || $slots.label"
          class="v-input__label"
        >
          <slot name="label">
            {{ label }}
          </slot>
        </div>
        <div class="v-input__input">
          <input
            ref="inputRef"
            :value="model"
            v-bind="$attrs"
            class="v-input__native"
            :disabled="disabled"
            @blur="onBlur"
            @focus="onFocus"
            @input="onInput"
            @change="emits('change', $event)"
            @keydown.enter="$emit('enter', $event)"
          >
        </div>
      </div>

      <div
        v-if="$slots.append"
        class="v-input__append"
      >
        <slot name="append" />
      </div>
    </label>

    <UiError :error="error" />
  </div>
</template>

<style lang="scss">
.v-input {
  $block: &;

  &.is-disabled {
    opacity: 0.7;

    #{$block}__wrap {
      cursor: not-allowed;
    }

    #{$block}__native {
      cursor: not-allowed;
    }

    #{$block}__input {
      pointer-events: none;
    }
  }

  &.has-error {
    #{$block}__wrap:hover {
      //box-shadow: inset 0 0 0 3px var(--ui-danger-highlight-color);
    }

    #{$block}__native {
      color: var(--ui-danger-color);

      &::placeholder {
        color: var(--ui-danger-color);
      }
    }

    &.is-focused {
      #{$block}__wrap {
        box-shadow: var(--ui-input-focus-box-shadow);
      }
    }
  }

  &.is-focused {
    #{$block}__wrap {
      box-shadow: var(--ui-input-focus-box-shadow);
    }
  }

  &__wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 58px;
    padding: 0 16px;
    background-color: var(--ui-block-color);
    color: var(--ui-primary-text-color);
    cursor: text;
    box-shadow: var(--ui-input-box-shadow);
  }

  &__content {
    width: 100%;
  }

  &__append {
    flex-shrink: 0;
    margin-right: -8px;
    margin-left: 8px;
  }

  &__label {
    font-size: 13px;
    line-height: 18px;
    color: var(--ui-secondary-text-color);
    margin-bottom: 6px;
    user-select: none;
  }

  &__input {
    display: flex;
    position: relative;
    top: 0;
    width: 100%;
  }

  &__native {
    width: 100%;
    color: var(--ui-primary-text-color);
    font-weight: var(--ui-font-weight);
    font-size: var(--ui-font-size);
    pointer-events: all !important;

    &::placeholder {
      color: var(--ui-secondary-text-color);
    }
  }
}
</style>
