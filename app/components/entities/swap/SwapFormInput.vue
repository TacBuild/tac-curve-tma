<script setup lang="ts">
import { debouncedWatch } from '@vueuse/core'
import { formatNumber } from '~/utils/string-utils'
import type { PoolCoin } from '~~/entities/pool'
import { useTonConnect } from '~/composables/useTonConnect'

const { coins, getUsdRate } = useCurve()
const { isConnected, fetchTonBalance } = useTonConnect()
const { isLoaded: isTacLoaded, fetchJettonBalanceByEvmAddress } = useTac()

defineProps<{ disabled?: boolean, to?: boolean, errorInput?: string }>()

const inputValue = defineModel<string>('input', { default: '' })
const coin = defineModel<PoolCoin | undefined>('coin', { default: undefined })
const balance = defineModel<number>('balance', { default: 0 })

const usdRate = ref(0)
const isLoadingUsdRate = ref(false)
const isLoadingBalance = ref(false)

const setMax = () => {
  inputValue.value = String(balance.value)
}
const onCoinChange = (selectedCoin: PoolCoin | undefined) => {
  coin.value = selectedCoin
}
const updateBalance = async () => {
  try {
    isLoadingBalance.value = true
    balance.value = coin.value?.address === 'NONE'
      ? await fetchTonBalance()
      : await fetchJettonBalanceByEvmAddress(coin.value!.address)
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isLoadingBalance.value = false
  }
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
    updateBalance()
    updateUsdRate()
  }
}, { immediate: true, debounce: 200 })
watch(isConnected, (val) => {
  if (val) {
    updateBalance()
  }
})

defineExpose({
  updateBalance,
})
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
          isConnected && coin ? `Avail. ${isLoadingBalance || !isTacLoaded
            ? 'loading...' : formatNumber(balance, +coin?.decimals || 18)}`
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
            :coins="coins"
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
