<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui'
import { useDebounceFn } from '@vueuse/core'
import { formatUnits, getAddress, parseUnits } from 'ethers'
import { useTonConnect } from '~/composables/useTonConnect'
import { useModal } from '~/components/ui/composables/useModal'
import { TransactionDetailsModal, SwapStatusModal } from '#components'
import { useTransaction } from '~/composables/useTransaction'
import { formatNumber } from '~/utils/string-utils'
import type { Pool, PoolCoin } from '~~/entities/pool'

type PairItem = { id: number, coin: PoolCoin | undefined, inputValue: string }

const { pool } = defineProps<{ pool: Pool }>()

const modal = useModal()
const { isLoaded, isConnected, walletName, address,
  balance: tonBalance, getTonConnectUI, updateTonBalance } = useTonConnect()
const {
  removeLiquidity,
  getTotalSupply, getPoolTokenBalances, getOneCoinWithdrawRate,
  calcUnstakeBalancedTokenValues, slippagePercent,
} = useTransaction()
const { getTacSdk, isLoaded: isTacLoaded } = useTac()
const { getCoin } = useCurve()

const type = ref('balanced')
const balance = ref(0n)
const decimals = ref(18)
const amount = ref('1')
const errorRate = ref('')
const totalSupply = ref(0n)
const oneCoinKey: Ref<0 | 1> = ref(0)
const poolTokenBalances: Ref<[bigint, bigint]> = ref([0n, 0n])
const pair: [PairItem, PairItem]
  = reactive([{
    id: 1,
    coin: await getCoin(pool.underlyingCoinAddresses[0]!, true),
    inputValue: '0',
  }, {
    id: 2,
    coin: await getCoin(pool.underlyingCoinAddresses[1]!, true),
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
const isNotEnoughForFee = computed(() => (tonBalance.value < 1.5) && isConnected.value)
const isSubmitDisabled = computed(() => {
  if (!isConnected.value) {
    return !isLoaded.value
  }

  return isNotEnoughForFee.value
    || isSubmitting.value
    || isLoadingBalance.value
    || parseUnits(amount.value, decimals.value) > balance.value
    || Number(amount.value) <= 0
})
const isReady = computed(() => isConnected.value && isTacLoaded.value)

const load = async () => {
  try {
    isLoaded.value = false
    const res = await Promise.all([getTotalSupply(pool.address), getPoolTokenBalances(pool.address, 0), getPoolTokenBalances(pool.address, 1)])
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
  balance.value = 0n
  decimals.value = 18

  try {
    if (!isReady.value) {
      return
    }
    isLoadingBalance.value = true
    const tvmAddress = await sdk.getTVMTokenAddress(getAddress(pool.address))
    if (!tvmAddress) {
      return
    }
    const obj = await sdk.getUserJettonBalanceExtended(address.value, tvmAddress)
    if (obj?.exists) {
      balance.value = obj.rawAmount
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
  try {
    const arr = calcUnstakeBalancedTokenValues(
      parseUnits(amount.value || '0'),
      totalSupply.value,
      poolTokenBalances.value,
    )
    pair[0].inputValue = String(formatUnits((arr[0] || 0n), +pair[0].coin!.decimals))
    pair[1].inputValue = String(formatUnits((arr[1] || 0n), +pair[1].coin!.decimals))
  }
  catch (e) {
    console.warn(e)
    pair[0].inputValue = '0'
    pair[1].inputValue = '0'
    errorRate.value = 'Unable to calculate rate. Price impact may be very high.'
  }
  finally {
    isRatesLoading.value = false
  }
}
const calcRatesByOneCoin = async () => {
  errorRate.value = ''
  pair[oneCoinKey.value].inputValue = ''
  try {
    isRatesLoading.value = true
    pair[oneCoinKey.value].inputValue = formatUnits(
      await getOneCoinWithdrawRate(pool.address, parseUnits(amount.value, decimals.value), oneCoinKey.value),
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
  amount.value = formatUnits(balance.value, decimals.value)
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
      pool.address,
      parseUnits(amount.value, decimals.value),
      parseUnits(pair[0].inputValue, +pair[0].coin!.decimals),
      parseUnits(pair[1].inputValue, +pair[1].coin!.decimals),
      pool.isPlain && pool.isNg && !pool.isCrypto ? 'plainstableng' : '',
    )

    modal.open(TransactionDetailsModal, {
      props: {
        type: 'remove-liquidity',
        title: 'Withdraw details',
        tokenA: pair[0].coin,
        tokenB: pair[1].coin,
        valueA: pair[0].inputValue,
        valueB: pair[1].inputValue,
        pool,
        poolValue: amount.value,
        transactionLinker: txLinker,
      },
      onClose: () => {
        updateBalance()
        updateTonBalance()
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
                ? 'loading...' : formatNumber(formatUnits(balance, decimals), 9)}`
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
              v-if="pair[0].coin"
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
              v-if="pair[1].coin"
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
              { id: 0, value: 0, label: pair[0].coin!.symbol },
              { id: 1, value: 1, label: pair[1].coin!.symbol },
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
                    :coins="[pair[option.value as 0 | 1].coin!]"
                  />
                  {{ pair[option.value as 0 | 1].coin!.symbol }}
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
          <template v-if="isNotEnoughForFee">
            <span class="weight-600 c-red">
              Not enough TON for fee. <br>
              You have {{ formatNumber(tonBalance, 2) }} TON
            </span>
            <span class="c-secondary-text right c-red">~{{ formatNumber(1.5, 2) }} TON</span>
          </template>
          <template v-else>
            <span class="weight-600">
              Network fee
            </span>
            <span class="c-secondary-text right">~{{ formatNumber(1.5, 2) }} TON</span>
          </template>
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
      <div class="mx-auto ui-loader" />
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

  @media (prefers-color-scheme: dark) {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
