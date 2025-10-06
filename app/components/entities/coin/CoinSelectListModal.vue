<script setup lang="ts">
import type { PoolCoin } from '~~/entities/pool'
import { formatUnits } from 'ethers'

const emits = defineEmits(['close', 'select'])
const { title = 'Select token', onSelect }
  = defineProps<{ title?: string, onSelect: (e: PoolCoin) => void }>()
const { coins } = useCurve()
const { coinsBalances } = useBalances()

const priority = ['TAC', 'TON', 'USD₮', 'WETH']
const coinsWithBalances = computed(() => (
  coins.value.map(coin => ({
    coin,
    balance: coinsBalances.value[coin.address] || 0n,
  })).sort((a, b) => {
    const iA = priority.indexOf(a.coin.symbol)
    const iB = priority.indexOf(b.coin.symbol)

    return iA == -1 ? 1 : iB == -1 ? -1 : iA - iB
  })
))
const handleSelect = (coin: PoolCoin) => {
  if (onSelect) {
    onSelect(coin)
  }
  emits('close')
}
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      <div :class="$style.title">
        <p class="mb-4">
          {{ title }}
        </p>
      </div>
    </template>

    <ul :class="$style.list">
      <li
        v-for="{ coin, balance } in coinsWithBalances"
        :key="coin.address"
        :class="$style.item"
        @click="handleSelect(coin)"
      >
        <CoinAvatar
          class="icon--32"
          :coins="[coin]"
        />

        <div
          class="flex-between flex-center gap-8 flex-wrap"
          style="flex-grow: 1"
        >
          <p class="weight-700 p1">
            {{ coin?.symbol || 'Unknown' }}
          </p>
          <p
            v-if="balance > 0n"
            class="weight-600"
          >
            {{ formatNumber(formatUnits((balance).toString() || '0', +coin.decimals), 2, 4) }}
          </p>
        </div>
      </li>
    </ul>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.CoinSelectListModal {
  //
}

.list {
  display: flex;
  flex-direction: column;
  margin: 0 -8px;
  margin-bottom: 8px;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 8px;

  &:not(:last-child) {
    border-bottom: 1px solid var(--c-body-bg);
  }

  &:hover, &:active {
    cursor: pointer;
    background-color: var(--c-body-bg);
  }
}
</style>
