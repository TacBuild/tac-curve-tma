<script setup lang="ts">
import { CoinSelectListModal } from '#components'
import { useModal } from '~/components/ui/composables/useModal'
import type { PoolCoin } from '~~/entities/pool'

const modal = useModal()
const emits = defineEmits(['change'])
const model = defineModel<PoolCoin | undefined>()
const { desc } = defineProps<{ desc?: string }>()

const open = () => {
  modal.open(CoinSelectListModal, {
    props: {
      onSelect: (coin: PoolCoin) => {
        model.value = coin
        emits('change', coin)
      },
    },
  })
}
</script>

<template>
  <button
    :class="$style.CoinSelectButton"
    type="button"
    @click.stop="open"
  >
    <CoinAvatar
      v-if="model"
      :coins="[model]"
    />

    <div class="mx-auto">
      <p class="weight-700">
        {{ model?.symbol || 'Select' }}
      </p>
      <p
        v-if="desc"
        class="c-secondary-text p4 weight-400"
      >
        {{ desc }}
      </p>
    </div>
  </button>
</template>

<style lang="scss" module>
.CoinSelectButton {
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

  @media (prefers-color-scheme: dark) {
    color: #eaeaf0;
    background-color: #23242c;
    box-shadow: 1px 0 0 0 #32343a inset, 0 1px 0 0 #32343a inset, -4px 0 0 0 #23242c inset, 0 -4px 0 0 #23242c inset;
  }

  &:active {
    box-shadow: 1px 0 0 0 #484D56 inset, 0 1px 0 0 #484D56 inset, -2px 0 0 0 #D9D9D9 inset, 0 -2px 0 0 #D9D9D9 inset;
    @media (prefers-color-scheme: dark) {
      box-shadow: 4px 0 0 0 #23242c inset, 0 4px 0 0 #23242c inset, -1px 0 0 0 #32343a inset, 0 -1px 0 0 #32343a inset;
    }
  }
}
</style>
