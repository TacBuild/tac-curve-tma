<script setup lang="ts">
import { NuxtLink } from '#components'

const emits = defineEmits(['click'])
const props = withDefaults(defineProps<Partial<{
  type: string
  to: string
  href: string
  target: string
  size: 'small' | 'smaller' | undefined
  color: 'secondary' | undefined
  wide: boolean
  disabled: boolean
  loading: boolean
}>>(), { type: 'button' })

const bindedAttrs = computed(() => {
  if (props.href) {
    return {
      href: props.href,
    }
  }

  if (props.to) {
    return {
      to: props.to,
    }
  }

  return {}
})
const tag = computed(() => {
  return props.href ? 'a' : props.to ? NuxtLink : 'button'
})
const classes = computed(() => {
  return {
    'is-wide': props.wide,
    'is-loading': props.loading,
    [`v-button--${props.size}`]: Boolean(props.size),
    [`v-button--${props.color}`]: Boolean(props.color),
  }
})

const onClick = (e: Event) => {
  if (props.loading || props.disabled) {
    return
  }

  emits('click', e)
}
</script>

<template>
  <component
    :is="tag"
    ref="button"
    :class="classes"
    class="v-button"
    :type="type"
    :disabled="disabled || undefined"
    :target="target"
    v-bind="bindedAttrs"
    @click="onClick"
  >
    <div class="v-button__wrap">
      <div
        v-if="$slots.default"
        class="v-button__text"
      >
        <span
          v-if="loading"
          class="v-button__loading"
        />
        <slot />
      </div>
    </div>
  </component>
</template>

<style lang='scss'>
.v-button {
  $block: &;

  position: relative;
  display: inline-flex;
  overflow: hidden;
  min-width: 62px;
  min-height: 62px;
  padding: 0 16px;
  border-radius: var(--border-radius);
  background-color: var(--ui-button-primary-bg-color);
  color: var(--ui-button-primary-text-color);
  outline: none;
  font-family: inherit;
  font-weight: var(--ui-button-font-weight);
  font-size: var(--ui-button-font-size);
  line-height: var(--ui-button-line-height);
  text-align: center;
  cursor: pointer;
  user-select: none;
  box-shadow: var(--ui-button-primary-box-shadow);
  transform: translate3d(0, 0, 0);

  &:active {
    box-shadow: var(--ui-button-primary-active-box-shadow);
  }

  &.is-loading {
    pointer-events: none;
  }

  &[disabled] {
    cursor: default;
    pointer-events: none;
    background-color: var(--ui-button-primary-disabled-bg-color);
    box-shadow: var(--ui-button-primary-disabled-box-shadow);
    color: var(--ui-button-primary-disabled-text-color);
  }

  &.is-wide {
    width: 100%;
  }

  &__wrap {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    gap: 8px;
    min-height: inherit;
  }

  &__text {
    display: flex;
    position: relative;
    z-index: 1;
    //width: 100%;
    pointer-events: none;
  }

  &__loading {
    display: inline-block;
    margin-right: 8px;

    &:before {
      content: '/';
      display: inline-block;
      animation: loading 0.5s infinite linear;
      width: 24px;
      height: 24px;
      text-align: center;
    }
  }

  &--small {
    min-height: 42px;
    min-width: 52px;
    padding: 0 12px;
    font-size: var(--ui-button-small-font-size);
  }

  &--smaller {
    min-width: 52px;
    min-height: 32px;
    padding: 0 9px 0 7px;
    font-size: var(--ui-button-small-font-size);
  }

  &--secondary {
    background-color: var(--ui-button-secondary-bg-color);
    color: var(--ui-button-secondary-text-color);
    box-shadow: var(--ui-button-secondary-box-shadow);

    &:active {
      background-color: var(--ui-button-secondary-active-bg-color);
      box-shadow: var(--ui-button-secondary-active-box-shadow);
    }
  }
}
</style>
