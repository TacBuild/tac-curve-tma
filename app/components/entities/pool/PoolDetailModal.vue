<script setup lang="ts">
import { until } from '@vueuse/core'
import { formatNumber, formatUsd } from '~/utils/string-utils'
import type { Pool } from '~~/entities/pool'
import { formatUnits } from 'ethers'

const emits = defineEmits(['close'])
const { pool } = defineProps<{ pool: Pool }>()

const { isConnected } = useTonConnect()
const { isLoaded, coinsMap } = useCurve()
const { aprs } = useMerkl()
const { fetchJettonBalance } = useTac()

const balance = ref(0n)
const decimals = ref(18)
const isLoading = ref(false)

const coins = computed(() => [coinsMap.get(pool.underlyingCoinAddresses[0]!)!, coinsMap.get(pool.underlyingCoinAddresses[1]!)!])

const load = async () => {
  try {
    isLoading.value = true
    await until(isLoaded).toBe(true)
    const res = (await fetchJettonBalance(pool.address))
    balance.value = res.balance
    decimals.value = res.decimals
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isLoading.value = false
  }
}

const changeRoute = (route: string) => {
  emits('close')

  setTimeout(() => {
    useRouter().push(route)
  }, 300)
}
load()
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      Pool
    </template>

    <div :class="$style.content">
      <div
        :class="$style.token"
        class="flex-center"
      >
        <CoinAvatar
          class="icon--32"
          :coins="coins"
        />

        <p class="weight-600 p2">
          {{ pool.name }}
        </p>
      </div>

      <div
        v-if="isConnected"
        class="flex-between flex-center mt-12 weight-600"
      >
        <p>
          Position
        </p>

        <p
          class="right c-secondary-text"
          style="line-height: 24px"
        >
          <span
            v-if="isLoading"
            class="ui-loader"
          />
          <span v-else>
            {{ formatNumber(formatUnits(balance, decimals), 9) }} LP
          </span>
        </p>
      </div>

      <div class="flex-between flex-center mt-12 weight-600">
        <p>
          TVL
        </p>

        <p
          class="right c-secondary-text"
          style="line-height: 24px"
        >
          <span>
            {{ formatUsd(pool.totalLiquidity, 2) }}
          </span>
        </p>
      </div>

      <div class="flex-between flex-center mt-12 weight-600">
        <p>
          APR
        </p>

        <p
          class="right c-secondary-text"
          style="line-height: 24px"
        >
          <span v-if="aprs[pool.address]">
            {{ formatPercent(aprs[pool.address]! / 100) }}
          </span>
          <span v-else>-</span>
        </p>
      </div>

      <div :class="$style.btns">
        <UiButton
          wide
          @click="changeRoute(`/pools/${pool.id}/deposit`)"
        >
          Deposit
        </UiButton>
        <UiButton
          :disabled="balance <= 0n"
          class="mt-16"
          wide
          @click="changeRoute(`/pools/${pool.id}/withdraw`)"
        >
          Withdraw
        </UiButton>
      </div>
    </div>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.token {
  gap: 8px;
  padding: 12px 0;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 1px 0 0 rgba(255, 255, 255, 0.1);
  }
}

.btns {
  margin-top: 60px;
}
</style>
