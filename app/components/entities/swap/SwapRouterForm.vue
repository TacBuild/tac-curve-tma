<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui'
import { until, useDebounceFn } from '@vueuse/core'
import { parseUnits } from 'ethers'
import type { IRoute } from '@curvefi/api/lib/interfaces'
import { useTonConnect } from '~/composables/useTonConnect'
import { useModal } from '~/components/ui/composables/useModal'
import { SwapStatusModal, TransactionConfirmModal, TransactionDetailsModal } from '#components'
import { useTransaction } from '~/composables/useTransaction'
import type { PoolCoin } from '~~/entities/pool'
import { CURVE_HIGH_PRICE_IMPACT_PERCENT, EVM_TAC_ADDRESS } from '~~/entities/config'
import SwapFormInput from '~/components/entities/swap/SwapFormInput.vue'
import { formatNumber } from '~/utils/string-utils'

type PairItem = {
  id: number
  coin: PoolCoin | undefined
  inputValue: string
  balance: bigint
  swapKey: 0 | 1
  isLoadingBalance: boolean
}
const modal = useModal()
const { swapViaRouter, slippagePercent } = useTransaction()
const { isLoaded: isTacLoaded } = useTac()
const { isLoaded, isConnected, walletName, balance, getTonConnectUI } = useTonConnect()

const { isLoaded: isPoolsLoaded, coinsMap, getBestRouteAndOutput } = useCurve()

let calcRateKey = 0
const isPreparing = ref(false)
const isLoadingRate = ref(false)
const isSwapping = ref(false)
const isLoadingRoute = ref(false)
const transitionName = ref('')

const swapInput1: Ref<typeof SwapFormInput | undefined> = ref()
const swapInput2: Ref<typeof SwapFormInput | undefined> = ref()
const pair: [PairItem, PairItem] = reactive([{
  id: 1,
  coin: undefined,
  inputValue: '',
  balance: 0n,
  swapKey: 0,
  isLoadingBalance: false,
}, {
  id: 2,
  coin: undefined,
  inputValue: '',
  balance: 0n,
  swapKey: 1,
  isLoadingBalance: false,
}])
const route: Ref<IRoute> = ref([])
const priceImpact: Ref<number> = ref(0)

const isNotEnoughForFee = computed(() => (balance.value < 1.5) && isConnected.value)
const isLoadingBalances = computed(() => pair[0].isLoadingBalance || pair[1].isLoadingBalance)
const errorInput = computed(() => {
  if (isLoadingBalances.value || !isConnected.value) {
    return ''
  }

  if (pair[0].coin && (pair[0].balance < +pair[0].inputValue)) {
    return `Insufficient ${pair[0].coin?.symbol} balance`
  }

  return ''
})
const isSubmitDisabled = computed(() => {
  if (!isConnected.value) {
    return !isLoaded.value
  }

  return isPreparing.value || isSwapping.value
    || isNotEnoughForFee.value
    || isLoadingBalances.value || !pair[0].inputValue
    || parseUnits(pair[0].inputValue, +(pair[0].coin?.decimals || 18)) > pair[0].balance
    || Number(pair[0].inputValue) <= 0
    || isLoadingRoute.value || Boolean(!route.value.length)
})

const load = async () => {
  try {
    await until(isPoolsLoaded).toBe(true)
    pair[0].coin = coinsMap.get(EVM_TAC_ADDRESS)
  }
  catch (e) {
    console.warn(e)
    showError({
      status: 404,
      message: 'Pool not found. Make sure this pool exists or try a bit later.',
    })
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
const calcRate = async (inputIndex: 0 | 1) => {
  calcRateKey = Math.random()
  route.value = []
  priceImpact.value = 0
  isLoadingRate.value = true
  isLoadingRoute.value = true
  await debouncedCalcRate(inputIndex)
}

const debouncedCalcRate = useDebounceFn(async (inputIndex: 0 | 1) => {
  if (!pair[0].coin || !pair[1].coin) {
    return
  }

  if (!pair[inputIndex].inputValue) {
    pair[inputIndex ? 0 : 1].inputValue = '0'
    route.value = []
    priceImpact.value = 0
    return
  }

  let rate
  const currentCalcRateKey = calcRateKey
  pair[inputIndex ? 0 : 1].inputValue = ''
  try {
    const { route: routeRes, output, priceImpact: priceImpactRes } = await getBestRouteAndOutput(
      pair[0].coin!.address,
      pair[1].coin!.address,
      pair[inputIndex].inputValue,
      inputIndex === 1,
    )
    if (calcRateKey !== currentCalcRateKey) {
      console.log(`${calcRateKey}, cache discarded by ${currentCalcRateKey}`)
      return
    }
    rate = output
    route.value = routeRes
    priceImpact.value = priceImpactRes
    isLoadingRate.value = false
    isLoadingRoute.value = false
  }
  catch (e) {
    console.warn(e)
    rate = '0'
    route.value = []
    priceImpact.value = 0
    isLoadingRate.value = false
    isLoadingRoute.value = false
  }
  pair[inputIndex ? 0 : 1].inputValue = String(rate)
}, 1000)
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
    if (!pair[0].coin || !pair[1].coin) {
      return
    }

    const txLinker = await swapViaRouter(
      route.value,
      parseUnits(pair[0].inputValue, +pair[0].coin.decimals),
      pair[0].coin.address,
      parseUnits(pair[1].inputValue, +pair[1].coin.decimals),
      pair[1].coin.address,
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
              if (swapInput1.value && swapInput2.value) {
                swapInput1.value.updateBalance()
                swapInput2.value.updateBalance()
              }
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
const onCoinChange = async (coin: PoolCoin, index: 0 | 1) => {
  pair[index].coin = coin

  if (!pair[0].coin || !pair[1].coin) {
    return
  }

  const key = `${pair[0].coin?.address}-${pair[1].coin?.address}`
  calcRateKey = Math.random()

  if (pair[0].coin?.address === pair[1].coin?.address) {
    pair[index ? 0 : 1].coin = undefined
    return
  }

  try {
    isLoadingRoute.value = true
    pair[1].inputValue = ''
    const { route: routeRes, output, priceImpact: priceImpactRes }
      = await getBestRouteAndOutput(pair[0].coin.address, pair[1].coin.address, pair[0].inputValue)

    if (key !== `${pair[0].coin?.address}-${pair[1].coin?.address}`) {
      console.log(`${key}, cache discarded by ${pair[0].coin?.address}-${pair[1].coin?.address}`)
      return
    }
    priceImpact.value = priceImpactRes
    pair[1].inputValue = String(output)
    route.value = routeRes
    isLoadingRoute.value = false
  }
  catch (e) {
    console.warn(e)
    priceImpact.value = 0
    route.value = []
    isLoadingRoute.value = false
  }
}

load()
</script>

<template>
  <form
    :class="$style.SwapForm"
    @submit.prevent="onSubmit"
  >
    <template v-if="isPoolsLoaded">
      <TransitionGroup
        tag="div"
        :name="transitionName"
        :class="$style.inputs"
        class="mb-16"
      >
        <SwapFormInput
          ref="swapInput1"
          :key="pair[0].id"
          v-model:coin="pair[0].coin"
          v-model:input="pair[0].inputValue"
          v-model:balance="pair[0].balance"
          :to="false"
          :error-input="errorInput"
          :disabled="isSwapping || isLoadingBalances"
          @update:coin="(value: PoolCoin) => onCoinChange(value!, 0)"
          @update:input="calcRate(0)"
        />
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
        <SwapFormInput
          ref="swapInput2"
          :key="pair[1].id"
          v-model:coin="pair[1].coin"
          v-model:input="pair[1].inputValue"
          v-model:balance="pair[1].balance"
          :to="true"
          :disabled="isSwapping || isLoadingBalances"
          @update:coin="(value: PoolCoin | undefined) => onCoinChange(value!, 1)"
          @update:input="calcRate(1)"
        />
      </TransitionGroup>

      <SwapRouterPath
        :route="route"
        :loading="isLoadingRoute"
        :empty="!pair[0].coin || !pair[1].coin || ((+pair[0].inputValue || 0) <= 0)"
        class="mb-8"
      />

      <p
        :class="$style.info"
        class="mb-8"
      >
        <span
          :class="{ 'c-red': priceImpact >= CURVE_HIGH_PRICE_IMPACT_PERCENT }"
          class="weight-600"
        >
          {{ priceImpact >= CURVE_HIGH_PRICE_IMPACT_PERCENT ? 'High price impact' : 'Price impact' }}
        </span>
        <span
          :class="{ 'c-red': priceImpact >= CURVE_HIGH_PRICE_IMPACT_PERCENT }"
          class="c-secondary-text"
        >
          <template v-if="!route.length || isLoadingRoute">
            -
          </template>
          <template v-else>
            {{ formatPercent(priceImpact / 100) }}
          </template>
        </span>
      </p>

      <p
        :class="$style.info"
        class="mb-8"
      >
        <span class=" weight-600">Slippage Tolerance</span>
        <span class="c-secondary-text">{{ slippagePercent }}%</span>
      </p>

      <p
        v-if="isNotEnoughForFee"
        :class="$style.info"
        class="mb-24"
      >
        <span class="weight-600 c-red">
          Not enough TON for fee. <br>
          You have {{ formatNumber(balance, 2) }} TON
        </span>
        <span class="c-secondary-text right c-red">~{{ formatNumber(1.5, 2) }} TON</span>
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
      <div class="mx-auto ui-loader" />
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
