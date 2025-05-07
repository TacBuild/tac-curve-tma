<script setup lang="ts">
import type { Token } from '~/entities/token'
import { TokenSelectListModal } from '#components'
import { useModal } from '~/components/ui/composables/useModal'

const modal = useModal()
const emits = defineEmits(['change'])
const model = defineModel<Token | undefined>()
const { desc, tokens } = defineProps<{ desc?: string, tokens: Token[] }>()

const open = () => {
  modal.open(TokenSelectListModal, {
    props: {
      tokens,
      onSelect: (token: Token) => {
        model.value = token
        emits('change', token)
      },
    },
  })
}
</script>

<template>
  <button
    :class="$style.TokenSelectButton"
    type="button"
    @click.stop="open"
  >
    <BaseAvatar
      v-if="model"
      :src="model.logo"
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
.TokenSelectButton {
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
