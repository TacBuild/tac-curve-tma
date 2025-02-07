<script setup lang="ts">
interface Tab {
  label: string;
  value: unknown
}

const model = defineModel<unknown>({ default: undefined });
const props = defineProps({
  tabs: {
    type: Array as PropType<Tab[]>,
    default: () => []
  }
});
</script>

<template>
  <div class="v-tabs">
    <ul
      class="v-tabs__items"
      aria-role="tablist"
    >
      <li
        v-for="(tab, idx) in props.tabs"
        :key="idx"
        class="v-tabs__item"
        :class="{'v-tabs__item--active': model === tab.value}"
        aria-role="tab"
        @click="model = tab.value"
      >
        {{ tab.label }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.v-tabs {
  &__items {
    display: flex;
    width: 100%;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 42px;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    font-size: var(--ui-tabs-font-size);
    line-height: var(--ui-tabs-line-height);
    font-weight: var(--ui-tabs-font-weight);
    color: var(--ui-disabled-text-color);
    box-shadow: 0 -2px 0 0 inset var(--ui-disabled-text-color);
    cursor: pointer;

    &--active {
      color: var(--ui-primary-text-color);
      box-shadow: 0 -2px 0 0 inset var(--ui-primary-text-color);
    }
  }
}
</style>
