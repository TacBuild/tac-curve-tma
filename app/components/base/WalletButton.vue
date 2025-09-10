<script setup lang="ts">
import { useModal } from '~/components/ui/composables/useModal'
import { WalletModal } from '#components'

const { isConnected, isLoaded, shorterAddress, getTonConnectUI } = useTonConnect()
const modal = useModal()

const onClick = () => {
  if (!isConnected.value) {
    getTonConnectUI().openModal()
    return
  }

  // open wallet modal
  modal.open(WalletModal, {})
}
</script>

<template>
  <UiButton
    v-show="isLoaded"
    size="small"
    :color="isConnected ? 'secondary' : undefined"
    @click="onClick"
  >
    {{ isConnected ? shorterAddress : 'Connect wallet' }}
  </UiButton>
</template>

<style module lang="scss">

</style>
