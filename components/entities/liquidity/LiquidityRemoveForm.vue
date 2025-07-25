<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui'
import { useDebounceFn } from '@vueuse/core'
import { formatUnits, parseUnits } from 'ethers'
import { useTonConnect } from '~/composables/useTonConnect'
import { useModal } from '~/components/ui/composables/useModal'
import { TransactionDetailsModal, SwapStatusModal } from '#components'
import { useSwap } from '~/composables/useSwap'
import { formatNumber } from '~/utils/string-utils'
import type { PoolCoin } from '~/entities/pool'

const modal = useModal()
const { isLoaded, isConnected, walletName, address, getTonConnectUI } = useTonConnect()
const {
  removeLiquidity,
  // removeLiquidityOneCoin, getLiquidityRates,
  getTotalSupply, getPoolTokenBalances, getOneCoinWithdrawRate,
  calcUnstakeBalancedTokenValues, slippagePercent,
} = useSwap()
const { getTacSdk, isLoaded: isTacLoaded } = useTac()

const { poolAddress } = defineProps<{ poolAddress: string }>()

const { getPool } = usePools()
const type = ref('balanced')
const balance = ref(0)
const decimals = ref(18)
const amount = ref('1')
const errorRate = ref('')
const totalSupply = ref(0n)
const oneCoinKey: Ref<0 | 1> = ref(0)
const poolTokenBalances: Ref<[bigint, bigint]> = ref([0n, 0n])
const pair: { id: number, coin: PoolCoin, inputValue: string }[]
  = reactive([{
    id: 1,
    coin: {} as PoolCoin,
    inputValue: '0',
  }, {
    id: 2,
    coin: {} as PoolCoin,
    inputValue: '0',
  },
  ])

const isSubmitting = ref(false)
const isLoadingBalance = ref(false)
const isRatesLoading = ref(false)

const errorInput = computed(() => {
  if (isLoadingBalance.value || !isReady.value || !isConnected.value) {
    return ''
  }

  if (balance.value < +amount.value) {
    return `Insufficient LP balance`
  }

  return ''
})
const isSubmitDisabled = computed(() => {
  if (!isConnected.value) {
    return !isLoaded.value
  }

  return isSubmitting.value || isLoadingBalance.value || Number(amount.value) > balance.value || Number(amount.value) <= 0
})
const isReady = computed(() => isConnected.value && isTacLoaded.value)

const load = async () => {
  try {
    isLoaded.value = false
    const pool = await getPool(poolAddress)
    if (!pool) {
      isLoaded.value = true
      return
    }
    pair[0].coin = pool.coins[0]
    pair[1].coin = pool.coins[1]
    const res = await Promise.all([getTotalSupply(poolAddress), getPoolTokenBalances(poolAddress, 0), getPoolTokenBalances(poolAddress, 1)])
    totalSupply.value = res[0]
    poolTokenBalances.value = [res[1], res[2]]
    await calcRates()
  }
  catch (e) {
    console.warn(e)
    errorRate.value = 'Unable to calculate rates.'
  }
  finally {
    isLoaded.value = true
  }
}

const updateBalance = async () => {
  const sdk = getTacSdk()
  balance.value = 0
  decimals.value = 18

  try {
    if (!isReady.value) {
      return
    }
    isLoadingBalance.value = true
    const tvmAddress = await sdk.getTVMTokenAddress(poolAddress)
    if (!tvmAddress) {
      return
    }
    const obj = await sdk.getUserJettonBalanceExtended(address.value, tvmAddress)
    if (obj?.exists) {
      balance.value = obj.amount
      decimals.value = obj.decimals
    }
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isLoadingBalance.value = false
  }
}
// const calcRatesByTokens = useDebounceFn(async () => {
//   errorRate.value = ''
//   const amounts = [valueToNano(pair[0].inputValue, pair[0].token.decimals), valueToNano(pair[1].inputValue, pair[1].token.decimals)]
//   try {
//     isRatesLoading.value = true
//     amount.value = (Number(await getLiquidityRates(poolAddress, amounts, false)) / 10 ** 18).toFixed(9)
//   }
//   catch (e) {
//     amount.value = ''
//     errorRate.value = 'Unable to calculate rate. Price impact may be very high.'
//     console.warn(e)
//   }
//   finally {
//     isRatesLoading.value = false
//   }
// }, 200)
const calcRatesByBalanced = () => {
  errorRate.value = ''
  const arr = calcUnstakeBalancedTokenValues(parseUnits(amount.value), totalSupply.value, poolTokenBalances.value)
  pair[0].inputValue = String(formatUnits(arr[0] || 0n, +pair[0].coin.decimals))
  pair[1].inputValue = String(formatUnits(arr[1] || 0n, +pair[1].coin.decimals))
  isRatesLoading.value = false
}
const calcRatesByOneCoin = async () => {
  errorRate.value = ''
  pair[oneCoinKey.value].inputValue = ''
  try {
    isRatesLoading.value = true
    pair[oneCoinKey.value].inputValue = formatUnits(
      await getOneCoinWithdrawRate(poolAddress, parseUnits(amount.value, decimals.value), oneCoinKey.value),
      decimals.value,
    )
  }
  catch (e) {
    amount.value = ''
    errorRate.value = 'Unable to calculate rate. Price impact may be very high.'
    console.warn(e)
  }
  finally {
    isRatesLoading.value = false
  }
}
const calcRates = useDebounceFn(async () => {
  switch (type.value) {
    case 'balanced':
      return calcRatesByBalanced()
    case 'one':
      return calcRatesByOneCoin()
  }
}, 200)
const setMax = () => {
  amount.value = String(balance.value)
  calcRates()
}
const onSubmit = async () => {
  if (!amount.value) {
    return
  }

  if (!isConnected.value) {
    getTonConnectUI().modal.open()
    return
  }

  await handleRemoveLiquidity()
}
const handleRemoveLiquidity = async () => {
  try {
    isSubmitting.value = true
    const txLinker = await removeLiquidity(
      poolAddress,
      parseUnits(amount.value, decimals.value),
      parseUnits(pair[0].inputValue, +pair[0].coin.decimals),
      parseUnits(pair[1].inputValue, +pair[1].coin.decimals),
    )

    modal.open(TransactionDetailsModal, {
      props: {
        type: 'remove-liquidity',
        title: 'Withdraw details',
        tokenA: pair[0].coin,
        tokenB: pair[1].coin,
        valueA: pair[0].inputValue,
        valueB: pair[1].inputValue,
        pool: await getPool(poolAddress),
        poolValue: amount.value,
        transactionLinker: txLinker,
      },
      onClose: () => {
        updateBalance()
      },
    })
  }
  catch (e) {
    console.warn(e)
    modal.open(SwapStatusModal, {
      props: {
        title: 'Failed',
        text: (e as Error).message.includes('Transaction was not sent')
          ? 'Transaction was not sent'
          : e instanceof UserRejectsError
            ? 'You rejected the transaction'
            : 'Something went wrong. Make sure you have enough token balance and try again',
        status: 'error',
      },
    })
  }
  finally {
    isSubmitting.value = false
  }
}

load()

watch(isReady, () => {
  updateBalance()
}, { immediate: true })

watch(type, () => {
  calcRates()
})
</script>

<template>
  <form
    :class="$style.LiquidityRemoveForm"
    @submit.prevent="onSubmit"
  >
    <template v-if="isLoaded">
      <div class="mb-32">
        <UiInput
          v-model="amount"
          name="remove-liquidity-from"
          maxlength="36"
          autocomplete="off"
          step="0.1"
          inputmode="decimal"
          only-number
          :error="errorInput || errorRate"
          :disabled="isSubmitting"
          @input="() => { isRatesLoading = true; calcRates() }"
        >
          <template #label>
            {{
              isConnected ? `LP Tokens Avail. ${isLoadingBalance || !isTacLoaded
                ? 'loading...' : formatNumber(balance, 9)}`
              : 'You send'
            }}
          </template>
          <template #append>
            <UiButton
              size="smaller"
              :disabled="isSubmitting || isLoadingBalance"
              @click.stop="setMax"
            >
              MAX
            </UiButton>
          </template>
        </UiInput>
      </div>

      <UiRadio
        v-model="type"
        class="mb-24"
        :options="[{ id: 1, label: 'Balanced', value: 'balanced' }]"
        direction="horizontal"
      />

      <div
        :class="$style.inputsTokens"
        class="mb-24"
      >
        <template v-if="type === 'balanced'">
          <div
            :class="$style.token"
            class="flex-between flex-center"
          >
            <div
              :class="$style.tokenName"
              class="flex-center weight-600 p1"
            >
              <CoinAvatar
                class="icon--32"
                :coins="[pair[0].coin]"
              />
              {{ pair[0].coin.symbol }}
            </div>
            <span
              class="weight-600 p1"
              :style="{ opacity: isRatesLoading ? '0.5' : '1' }"
            >
              {{ pair[0].inputValue }}
            </span>
          </div>
          <div
            :class="$style.token"
            class="flex-between flex-center"
          >
            <div
              :class="$style.tokenName"
              class="flex-center weight-600 p1"
            >
              <CoinAvatar
                class="icon--32"
                :coins="[pair[1].coin]"
              />
              {{ pair[1].coin.symbol }}
            </div>
            <span
              class="weight-600 p1"
              :style="{ opacity: isRatesLoading ? '0.5' : '1' }"
            >
              {{ pair[1].inputValue }}
            </span>
          </div>
        </template>
        <template v-else>
          <UiRadio
            v-model="oneCoinKey"
            :options="[
              { id: 0, value: 0, label: pair[0].coin.symbol },
              { id: 1, value: 1, label: pair[1].coin.symbol },
            ]"
            @update:model-value="calcRatesByOneCoin()"
          >
            <template #default="{ option }">
              <div
                :class="$style.token"
                class="flex-between flex-center"
                style="flex-grow: 1"
              >
                <div
                  :class="$style.tokenName"
                  class="flex-center weight-600 p1"
                >
                  <CoinAvatar
                    class="icon--32"
                    :coins="[pair[option.value as 0 | 1].coin]"
                  />
                  {{ pair[option.value as 0 | 1].coin.symbol }}
                </div>
                <span
                  class="weight-600 p1"
                  :style="{ opacity: isRatesLoading ? '0.5' : '1' }"
                >
                  {{ pair[option.value as 0 | 1].inputValue }}
                </span>
              </div>
            </template>
          </UiRadio>
        </template>
      </div>

      <div
        :class="$style.infos"
        class="mb-24"
      >
        <p :class="$style.info">
          <span class=" weight-600">Network fee</span>
          <span class="c-secondary-text">~0.5 TON</span>
        </p>

        <p :class="$style.info">
          <span class=" weight-600">Slippage Tolerance</span>
          <span class="c-secondary-text">{{ slippagePercent }}%</span>
        </p>
      </div>

      <div class="submit-button-sticky-wrap">
        <UiButton
          type="submit"
          :loading="isSubmitting || isLoadingBalance || !isTacLoaded"
          :disabled="isSubmitDisabled"
          wide
        >
          {{ !isConnected ? 'Connect wallet' : isSubmitting ? `Check ${walletName}` : 'Withdraw' }}
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
.LiquidityRemoveForm {
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

.inputsTokens {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tokenName {
  gap: 8px;
}

.infos {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}
</style>
