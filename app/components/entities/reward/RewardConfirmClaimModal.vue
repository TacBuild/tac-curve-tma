<script setup lang="ts">
import type { Reward } from '~~/entities/merkl'
import { FixedNumber } from 'ethers'

const emit = defineEmits(['close'])
const { reward, onConfirm } = defineProps<{ reward: Reward, onConfirm: () => void }>()

const amount = computed(() => FixedNumber.fromValue(reward.amount, reward.token.decimals).toUnsafeFloat())
const claimed = computed(() => FixedNumber.fromValue(reward.claimed, reward.token.decimals).toUnsafeFloat())
const amountToClaim = computed(() => amount.value - claimed.value)
const amountInUsd = computed(() => amountToClaim.value * reward.token.price)
const tokenIconUrl = computed(() => {
  if (!reward.token?.address) {
    return '/tokens/default.png'
  }
  return `https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets-tac/${reward.token.address.toLowerCase()}.png`
})

const handleConfirm = () => {
  onConfirm()
  emit('close')
}
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      Review claim
    </template>

    <RewardBreakdownList :reward="reward" />

    <div class="mt-12 gap-8 flex-between flex-center flex-wrap">
      Total
      <div class="flex-center flex-wrap gap-4">
        <BaseAvatar :src="tokenIconUrl" />
        <span class="weight-700">
          {{ formatNumber(amountToClaim, 2) }} {{ reward.token.symbol === 'WTAC' ? 'TAC' : reward.token.symbol }}
        </span>
        <span>
          ({{ amountInUsd < 0.01 ? `< ${formatUsd(0.01)}` : `${formatUsd(amountInUsd)}` }})
        </span>
      </div>
    </div>
    <UiButton
      :class="$style.sticky"
      class="mt-12"
      wide
      @click="handleConfirm"
    >
      Claim
    </UiButton>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.sticky {
  position: sticky;
  bottom: 0;
}
</style>
