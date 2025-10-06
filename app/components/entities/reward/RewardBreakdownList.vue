<script setup lang="ts">
import type { Opportunity, Reward } from '~~/entities/merkl'
import RewardBreakdownItem from '~/components/entities/reward/RewardBreakdownItem.vue'
import { FixedNumber } from 'ethers'

const { reward } = defineProps<{ reward: Reward }>()
const { opportunitiesMap, isOpportunitiesLoading } = useMerkl()

const claimableBreakdowns = computed(() => {
  return reward.breakdowns.filter((breakdown: Reward['breakdowns'][number]) =>
    BigInt(breakdown.amount) > BigInt(breakdown.claimed))
})
const items = computed(() => {
  const arr = (Object.entries(opportunitiesMap.value).map(([identifier, opportunity]: [string, Opportunity]) => {
    return {
      name: opportunity.name,
      total: claimableBreakdowns.value.reduce((prev, curr) => {
        const lpAddress = (curr.reason.split('_')[1] || '').split('~')[0] || ''
        if (identifier.toLowerCase() === lpAddress.toLowerCase()) {
          return prev + FixedNumber.fromValue(curr.amount, reward.token.decimals)
            .sub(FixedNumber.fromValue(curr.claimed, reward.token.decimals))
            .toUnsafeFloat()
        }
        return prev
      }, 0),
      token: reward.token,
      images: opportunity.tokens.map(token => token.icon).filter(o => o),
    }
  }))

  const curveTotal = arr.reduce((prev, curr) => prev + curr.total, 0) + 0.00001
  const rewardTotal = FixedNumber.fromValue(reward.amount, reward.token.decimals).sub(FixedNumber.fromValue(reward.claimed, reward.token.decimals)).toUnsafeFloat()
  if (curveTotal < rewardTotal) {
    arr.push({
      name: 'Other sources',
      total: rewardTotal - curveTotal,
      token: reward.token,
      images: [],
    })
  }

  return arr.filter(obj => obj.total)
})
</script>

<template>
  <div :class="$style.RewardBreakdownList">
    <div v-if="isOpportunitiesLoading" />

    <template v-else>
      <div
        v-for="(item, idx) in items"
        :key="idx"
        :class="$style.item"
      >
        <RewardBreakdownItem
          :name="item.name"
          :total="item.total"
          :images="item.images"
          :token="item.token"
        />
      </div>
    </template>
  </div>
</template>

<style module lang="scss">
.RewardBreakdownList {
  //
}

.item {
  padding: 16px 0;
}

.item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  @media (prefers-color-scheme: dark) {
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
