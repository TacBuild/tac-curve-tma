<script setup lang="ts">
import type { PoolWithTokens } from '~~/entities/pool'
import { LiquidityPoolSelectListModal } from '#components'
import { useModal } from '~/components/ui/composables/useModal'

const modal = useModal()
const model = defineModel<PoolWithTokens>()

const open = () => {
  modal.open(LiquidityPoolSelectListModal, {
    props: {
      onSelect: (pool: PoolWithTokens) => {
        model.value = pool
      },
    },
  })
}
</script>

<template>
  <button
    :class="$style.LiquidityPoolSelectButton"
    type="button"
    class="weight-700"
    @click.stop="open"
  >
    <BaseAvatar
      v-if="model"
      :src="[model.tokens[0].logo, model.tokens[1].logo]"
    />

    {{ model?.name || 'Select pool' }}
  </button>
</template>

<style lang="scss" module>
.LiquidityPoolSelectButton {
  display: flex;
  align-items: center;
  background-color: #F8F8F9;
  box-shadow: 1px 0 0 0 #D9D9D9 inset, 0 1px 0 0 #D9D9D9 inset, -2px 0 0 0 #484D56 inset, 0 -2px 0 0 #484D56 inset;
  color: #484D56;
  height: 42px;
  padding: 9px;
  gap: 8px;
  min-width: 118px;
  cursor: pointer;

  &:active {
    box-shadow: 1px 0 0 0 #484D56 inset, 0 1px 0 0 #484D56 inset, -2px 0 0 0 #D9D9D9 inset, 0 -2px 0 0 #D9D9D9 inset;
  }
}
</style>
