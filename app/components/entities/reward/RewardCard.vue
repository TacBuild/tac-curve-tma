<script setup lang="ts">
import { useModal } from '~/components/ui/composables/useModal'
import type { Reward } from '~~/entities/merkl'
import { FixedNumber } from 'ethers'
import { RewardConfirmClaimModal, TransactionDetailsModal } from '#components'

const { reward } = defineProps<{ reward: Reward }>()

const { claimReward } = useMerkl()
const modal = useModal()

const isLocked = ref(false)
const isClaiming = ref(false)

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

const claim = async () => {
  try {
    isClaiming.value = true

    const transactionLinker = await claimReward(reward)

    modal.open(TransactionDetailsModal, {
      props: { transactionLinker },
      onClose: () => {
        isLocked.value = true
        // updateRewards()
      },
    })
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isClaiming.value = false
  }
}

const onClaimClick = async () => {
  try {
    modal.open(RewardConfirmClaimModal, {
      props: {
        reward,
        onConfirm: async () => {
          await claim()
        },
      },
    })
  }
  catch (e) {
    console.warn(e)
  }
}
</script>

<template>
  <div
    :class="$style.RewardCard"
    class="p-16"
  >
    <div class="column gap-12">
      <div class="flex-between flex-center mb-12">
        <BaseAvatar
          :src="tokenIconUrl"
          class="icon--40"
        />
        <p class="p1 weight-600 ml-12">
          {{ reward.token.symbol === 'WTAC' ? 'TAC' : reward.token.symbol }}
        </p>
        <div class="column gap-8 ml-auto right">
          <p class="p2">
            {{ amountInUsd < 0.01 ? ' < $0.01' : `$${formatNumber(amountInUsd, 2)}` }}
          </p>
          <p class="p3 text-euler-dark-900">
            ~ {{ amountToClaim < 0.01 ? '< 0.01' : formatNumber(amountToClaim, 2) }} {{ reward.token.symbol === 'WTAC' ? 'TAC' : reward.token.symbol }} <!-- TODO wtac -> tac @ useMerkl -->
          </p>
        </div>
      </div>
      <UiButton
        wide
        size="small"
        :disabled="isClaiming || isLocked"
        :loading="isClaiming"
        @click="onClaimClick"
      >
        {{ isLocked ? 'Claimed' : 'Review claim' }}
      </UiButton>
    </div>
  </div>
</template>

<style lang="scss" module>
.RewardCard {
  background-color: var(--c-white);
}
</style>
