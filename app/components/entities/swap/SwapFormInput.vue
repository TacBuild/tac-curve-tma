<script setup lang="ts">
import { debouncedWatch } from '@vueuse/core'
import { formatNumber } from '~/utils/string-utils'
import type { PoolCoin } from '~~/entities/pool'
import { useTonConnect } from '~/composables/useTonConnect'
import { formatUnits } from 'ethers'

const { getUsdRate } = useCurve()
const { isConnected } = useTonConnect()
const { isLoaded: isTacLoaded } = useTac()
const { coinsBalances, isCoinsBalancesLoading } = useBalances()

defineProps<{ disabled?: boolean, to?: boolean, errorInput?: string }>()

const inputValue = defineModel<string>('input', { default: '' })
const coin = defineModel<PoolCoin | undefined>('coin', { default: undefined })

const usdRate = ref(0)
const isLoadingUsdRate = ref(false)

const balance = computed(() => coin.value ? coinsBalances.value?.[coin.value.address] || 0n : 0n)
const balanceModel = defineModel<bigint>('balance', { default: 0n })
watch(balance, val => balanceModel.value = val)

const setMax = () => {
  inputValue.value = formatUnits(balance.value, +(coin.value?.decimals || 18))
}
const onCoinChange = (selectedCoin: PoolCoin | undefined) => {
  coin.value = selectedCoin
}

const updateUsdRate = async () => {
  try {
    isLoadingUsdRate.value = true
    usdRate.value = 0
    if (coin.value?.address) {
      usdRate.value = await getUsdRate(coin.value.address)
    }
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isLoadingUsdRate.value = false
  }
}

debouncedWatch(coin, () => {
  if (coin.value) {
    updateUsdRate()
  }
}, { immediate: true, debounce: 200 })
</script>

<template>
  <div>
    <UiInput
      v-model="inputValue"
      name="swap-from"
      maxlength="36"
      autocomplete="off"
      step="0.1"
      inputmode="decimal"
      only-number
      :disabled="disabled"
      :error="errorInput"
    >
      <template #label>
        {{
          isConnected && coin ? `Avail. ${isCoinsBalancesLoading || !isTacLoaded
            ? 'loading...' : formatNumber(formatUnits(balance, +coin?.decimals || 18), +coin?.decimals || 18)}`
          : to ? 'You receive' : 'You send'
        }}
      </template>
      <template #append>
        <div class="flex-center">
          <UiButton
            v-if="!to"
            size="smaller"
            class="mr-12"
            :disabled="disabled"
            @click.stop="setMax"
          >
            MAX
          </UiButton>
          <CoinSelectButton
            :model-value="coin"
            @change="onCoinChange"
          />
        </div>
      </template>
      <template #below>
        <div
          style="height: 24px; align-items: flex-end"
          class="p3 flex"
        >
          <span
            v-if="isLoadingUsdRate"
            style="align-items: flex-end"
            class="ui-loader ui-loader--auto-height flex"
          />
          <span v-else-if="coin">
            x {{ formatUsd(usdRate, 5) }} = {{ formatUsd(usdRate * +inputValue || 0, 5, usdRate * +inputValue > 999999999 ? 'compact' : 'standard') }}
          </span>
        </div>
      </template>
    </UiInput>
  </div>
</template>
