<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui'
import { until, useDebounceFn } from '@vueuse/core'
import { formatUnits, parseUnits } from 'ethers'
import { useTonConnect } from '~/composables/useTonConnect'
import { useModal } from '~/components/ui/composables/useModal'
import { SwapStatusModal, TransactionConfirmModal, TransactionDetailsModal } from '#components'
import { useSwap } from '~/composables/useSwap'
import { formatNumber } from '~/utils/string-utils'
import type { Pool, PoolCoin } from '~/entities/pool'

const modal = useModal()
const { pools, coins, isLoaded: isPoolsLoaded } = usePools()
const { swap, getSwapRates, slippagePercent } = useSwap()
const { fetchJettonBalanceByEvmAddress, isLoaded: isTacLoaded } = useTac()
const { isLoaded, isConnected, walletName, fetchTonBalance, getTonConnectUI } = useTonConnect()

const pool: Ref<Pool | undefined> = ref()
const poolCoins: Ref<PoolCoin[]> = ref([])
const isPreparing = ref(false)
const isLoadingBalances = ref(false)
const isLoadingRates = ref(false)
const isSwapping = ref(false)
const errorRate = ref('')
const transitionName = ref('')
const pair: { id: number, coin: PoolCoin, inputValue: string, balance: number, swapKey: 0 | 1 }[]
  = reactive([{
    id: 1,
    coin: coins.value[1],
    inputValue: '1',
    balance: 0,
    swapKey: 0,
  }, {
    id: 2,
    coin: coins.value[0],
    inputValue: '0',
    balance: 0,
    swapKey: 1 },
  ])

const errorInput = computed(() => {
  if (isLoadingBalances.value || !isConnected.value) {
    return ''
  }

  if (pair[0].balance < +pair[0].inputValue) {
    return `Insufficient ${pair[0].coin.symbol} balance`
  }

  return ''
})
const isSubmitDisabled = computed(() => {
  if (!isConnected.value) {
    return !isLoaded.value
  }

  return Boolean(errorRate.value) || isPreparing.value || isSwapping.value
    || isLoadingBalances.value || !pair[0].inputValue
    || Number(pair[0].inputValue) > pair[0].balance
    || Number(pair[0].inputValue) <= 0
})
const isReady = computed(() => isConnected.value && isTacLoaded.value && isPoolsLoaded.value)

const load = async () => {
  try {
    await until(isPoolsLoaded).toBe(true)
    pool.value = pools.value[0]
    pair[0].coin = pool.value.coins[0]
    pair[1].coin = pool.value.coins[1]
    calcRate(0)
  }
  catch (e) {
    console.warn(e)
    showError({
      status: 404,
      message: 'Pool not found. Make sure this pool exists or try a bit later.',
    })
  }
}

const getRate = async (value: string, keys: Array<number>, inputIndex: number) => {
  if (!pool.value) {
    return 0n
  }
  const method = inputIndex === 0 ? 'get_dy' : 'get_dx'
  const decimals = pair[inputIndex === 0 ? 0 : 1].coin.decimals
  return await getSwapRates(method, pool.value.address, parseUnits(value, +decimals), keys, pool.value.implementation)
}
const updateBalances = async () => {
  try {
    isLoadingBalances.value = true

    const res = await Promise.all([
      pair[0].coin.address === 'NONE'
        ? fetchTonBalance()
        : fetchJettonBalanceByEvmAddress(pair[0].coin.address),
      pair[1].coin.address === 'NONE'
        ? fetchTonBalance()
        : fetchJettonBalanceByEvmAddress(pair[1].coin.address),
    ])
    pair[0].balance = res[0]
    pair[1].balance = res[1]
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isLoadingBalances.value = false
  }
}
const swapPair = () => {
  if (isLoadingBalances.value) {
    return
  }
  if (transitionName.value === 'swap') {
    return
  }

  transitionName.value = 'swap'
  pair.reverse()
  calcRate(0)

  setTimeout(() => {
    transitionName.value = ''
  }, 300)
}
const calcRate = useDebounceFn(async (inputIndex: number) => {
  errorRate.value = ''
  const value = pair[inputIndex].inputValue || '0'
  const keys = pair.map(o => o.swapKey)
  let rate
  try {
    rate = +value <= 0 ? 0n : await getRate(value, keys, inputIndex)
  }
  catch (e) {
    errorRate.value = 'Unable to calculate rate. Price impact may be very high.'
    console.warn(e)
    rate = 0
  }
  if (inputIndex === 0) {
    pair[1].inputValue = !value ? '' : formatUnits(rate, +pair[1].coin.decimals)
  }
  else {
    pair[0].inputValue = !value ? '' : formatUnits(rate, +pair[0].coin.decimals)
  }
}, 200)
const onSubmit = async () => {
  if (!pair[0].inputValue) {
    return
  }

  if (!isConnected.value) {
    getTonConnectUI().modal.open()
    return
  }

  // pair[0].inputValue = String(Math.trunc((Number(pair[0].inputValue)) * 10 ** pair[0].coin.decimals) / 10 ** pair[0].coin.decimals)
  try {
    isPreparing.value = true
    await calcRate(0)
  }
  finally {
    isPreparing.value = false
  }
  modal.open(TransactionConfirmModal, {
    props: {
      type: 'swap',
      tokenA: pair[0].coin,
      tokenB: pair[1].coin,
      valueA: pair[0].inputValue,
      valueB: pair[1].inputValue,
      onConfirm: () => {
        setTimeout(() => handleSwap(), 300)
      },
    },
  })
}
const handleSwap = async () => {
  try {
    isSwapping.value = true
    const txLinker = await swap(
      pool.value!.address,
      pair.map(o => o.swapKey),
      pair[0].coin.address,
      parseUnits(pair[0].inputValue, +pair[0].coin.decimals),
      parseUnits(pair[1].inputValue, +pair[1].coin.decimals),
      pool.value?.implementation,
    )

    if (!txLinker) {
      return
    }

    modal.open(SwapStatusModal, {
      props: {
        title: 'Transaction submitted',
        text: 'Please wait a minute for the swap to complete and check your wallet balance.',
        status: 'success',
        buttonLabel: 'Show status',
      },
      onClose: () => {
        setTimeout(() => {
          modal.open(TransactionDetailsModal, {
            props: {
              type: 'swap',
              title: 'Swap details',
              tokenA: pair[0].coin,
              tokenB: pair[1].coin,
              valueA: pair[0].inputValue,
              valueB: pair[1].inputValue,
              transactionLinker: txLinker,
            },
            onClose: () => {
              updateBalances()
            },
          })
        }, 300)
      },
    })
  }
  catch (e) {
    console.warn(e)
    modal.open(SwapStatusModal, {
      props: {
        title: 'Failed',
        text: ((e as Error)?.message || '').includes('Transaction was not sent')
          ? 'Transaction was not sent'
          : e instanceof UserRejectsError
            ? 'You rejected the transaction'
            : 'Something went wrong. Make sure you have enough token balance and try again',
        status: 'error',
      },
    })
  }
  finally {
    isSwapping.value = false
  }
}
const setMax = () => {
  pair[0].inputValue = String(pair[0].balance)
  calcRate(0)
}
const onCoinChange = (coin: PoolCoin, index: number) => {
  const otherIndex = index === 0 ? 1 : 0
  const validPools = pools.value.filter(pool => pool.coinsAddresses.includes(coin.address))

  if (validPools.length <= 0) {
    return
  }

  const closestPool = validPools.find((pool) => {
    const str1 = [pair[otherIndex].coin.address, coin.address].join('')
    const str2 = [coin.address, pair[otherIndex].coin.address].join('')
    return (pool.coinsAddresses.join('') === str1) || (pool.coinsAddresses.join('') === str2)
  })
  pool.value = closestPool || validPools[0]
  const coinIndex = pool.value.coinsAddresses.findIndex((coinAddress: string) => coinAddress === coin.address)
  const otherCoinIndex = coinIndex === 0 ? 1 : 0
  const otherCoin = pool.value.coins[otherCoinIndex]
  Object.assign(pair[index], {
    id: index + 1,
    coin,
    inputValue: pair[index].inputValue,
    balance: 0,
    swapKey: coinIndex,
  })
  Object.assign(pair[otherIndex], {
    id: otherIndex + 1,
    coin: otherCoin,
    inputValue: pair[otherIndex].inputValue,
    balance: 0,
    swapKey: otherCoinIndex,
  })

  if (isReady.value) {
    updateBalances()
  }

  calcRate(0)
}
const updatePoolCoins = () => {
  poolCoins.value.length = 0
  const coinsSet = new Set()
  const validPools = pools.value.filter(pool => pool.coinsAddresses.includes(pair[0].coin.address))
  validPools.forEach(pool => pool.coins.forEach((coin) => {
    if (!coinsSet.has(coin.address) && coin.address !== pair[0].coin.address) {
      coinsSet.add(coin.address)
      poolCoins.value.push(coin)
    }
  }))
}

load()

watch(() => pair[0].coin, () => {
  updatePoolCoins()
}, { immediate: true })
watch(isReady, (val) => {
  if (val) {
    updateBalances()
  }
}, { immediate: true })
</script>

<template>
  <form
    :class="$style.SwapForm"
    @submit.prevent="onSubmit"
  >
    <template v-if="isTacLoaded">
      <TransitionGroup
        tag="div"
        :name="transitionName"
        :class="$style.inputs"
        class="mb-16"
      >
        <UiInput
          :key="pair[0].id"
          v-model="pair[0].inputValue"
          name="swap-from"
          maxlength="36"
          autocomplete="off"
          step="0.1"
          inputmode="decimal"
          only-number
          :disabled="isSwapping || isLoadingRates"
          :error="errorInput"
          @input="calcRate(0)"
        >
          <template #label>
            {{
              isConnected ? `Avail. ${isLoadingBalances || !isTacLoaded
                ? 'loading...' : formatNumber(pair[0].balance, +pair[0].coin.decimals)}`
              : 'You send'
            }}
          </template>
          <template #append>
            <div class="flex-center">
              <UiButton
                size="smaller"
                class="mr-12"
                :disabled="isSwapping || isLoadingBalances"
                @click.stop="setMax"
              >
                MAX
              </UiButton>
              <CoinSelectButton
                key="tb0"
                :coins="coins"
                :model-value="pair[0].coin"
                @change="onCoinChange($event, 0)"
              />
            </div>
          </template>
        </UiInput>
        <button
          key="swap-button"
          type="button"
          class="mx-auto"
          @click="swapPair"
        >
          <UiIcon
            name="swap-arrows"
            class="c-secondary-text icon--32"
          />
        </button>
        <UiInput
          :key="pair[1].id"
          v-model="pair[1].inputValue"
          name="swap-to"
          maxlength="36"
          autocomplete="off"
          step="0.1"
          inputmode="decimal"
          only-number
          :disabled="isSwapping || isLoadingRates"
          :error="errorRate"
          @input="calcRate(1)"
        >
          <template #label>
            {{
              isConnected ? `Avail. ${isLoadingBalances || !isTacLoaded
                ? 'loading...' : formatNumber(pair[1].balance, +pair[1].coin.decimals)}`
              : 'You receive'
            }}
          </template>
          <template #append>
            <CoinSelectButton
              key="tb1"
              :coins="poolCoins"
              :model-value="pair[1].coin"
              @change="onCoinChange($event, 1)"
            />
          </template>
        </UiInput>
      </TransitionGroup>

      <p
        :class="$style.info"
        class="mb-8"
      >
        <span class=" weight-600">Slippage Tolerance</span>
        <span class="c-secondary-text">{{ slippagePercent }}%</span>
      </p>

      <p
        :class="$style.info"
        class="mb-24"
      >
        <span class=" weight-600">Network fee</span>
        <span class="c-secondary-text">~0.5 TON</span>
      </p>

      <div class="submit-button-sticky-wrap">
        <UiButton
          type="submit"
          :loading="isSwapping || isLoadingBalances || !isTacLoaded || isPreparing"
          :disabled="isSubmitDisabled"
          wide
        >
          {{ !isConnected ? 'Connect wallet' : isSwapping ? `Check ${walletName}` : 'Swap' }}
        </UiButton>
      </div>
    </template>
    <template v-else>
      <div class="mx-auto">
        loading...
      </div>
    </template>
  </form>
</template>

<style module lang="scss">
.SwapForm {
  display: flex;
  flex-direction: column;
}

.inputs {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info {
  display: flex;
  justify-content: space-between;
}

.disconnect {
  cursor: pointer;
}
</style>
