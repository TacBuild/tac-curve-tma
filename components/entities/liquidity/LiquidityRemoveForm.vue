<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui'
import { useDebounceFn } from '@vueuse/core'
import { poolsWithTokens } from '~/entities/pool'
import { useTonConnect } from '~/composables/useTonConnect'
import { useModal } from '~/components/ui/composables/useModal'
import { TransactionDetailsModal, SwapStatusModal } from '#components'
import { useSwap } from '~/composables/useSwap'
import { formatNumber } from '~/utils/string-utils'
import { type Token, tokens } from '~/entities/token'
import { valueToNano } from '~/utils/ton-utils'

const modal = useModal()
const { isLoaded, isConnected, walletName, address, getTonConnectUI } = useTonConnect()
const {
  removeLiquidity, removeLiquidityOneCoin,
  getLiquidityRates, getTotalSupply, getPoolTokenBalances, getOneCoinWithdrawRate,
  calcUnstakeBalancedTokenValues, slippagePercent,
} = useSwap()
const { getTacSdk, isLoaded: isTacLoaded } = useTac()

const { poolAddress } = defineProps<{ poolAddress: string }>()

const type = ref('balanced')
const balance = ref(0)
const decimals = ref(18)
const amount = ref('1')
const errorRate = ref('')
const totalSupply = ref(0n)
const oneCoinKey: Ref<0 | 1> = ref(0)
const poolTokenBalances: Ref<[bigint, bigint]> = ref([0n, 0n])
const pair: { id: number, token: Token, inputValue: string }[]
  = reactive([{
    id: 1,
    token: JSON.parse(JSON.stringify(tokens[0])),
    inputValue: '0',
  }, {
    id: 2,
    token: JSON.parse(JSON.stringify(tokens[1])),
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
    const pool = poolsWithTokens.find(pool => pool.address === poolAddress)
    if (!pool) {
      isLoaded.value = true
      return
    }
    Object.assign(pair[0].token, pool!.tokens[0])
    Object.assign(pair[1].token, pool!.tokens[1])
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
  const arr = calcUnstakeBalancedTokenValues(BigInt(Number(amount.value) * 10 ** 18), totalSupply.value, poolTokenBalances.value)
  pair[0].inputValue = String(nanoToValue(arr[0] || 0n, pair[0].token.decimals))
  pair[1].inputValue = String(nanoToValue(arr[1] || 0n, pair[1].token.decimals))
  isRatesLoading.value = false
}
const calcRatesByOneCoin = async () => {
  errorRate.value = ''
  pair[oneCoinKey.value].inputValue = ''
  try {
    isRatesLoading.value = true
    pair[oneCoinKey.value].inputValue = nanoToValue(
      await getOneCoinWithdrawRate(poolAddress, valueToNano(amount.value, decimals.value), oneCoinKey.value),
      decimals.value,
    ).toString()
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
      valueToNano(amount.value, decimals.value),
      valueToNano(pair[0].inputValue, pair[0].token.decimals),
      valueToNano(pair[1].inputValue, pair[1].token.decimals),
    )

    modal.open(TransactionDetailsModal, {
      props: {
        type: 'remove-liquidity',
        title: 'Withdraw details',
        tokenA: pair[0].token,
        tokenB: pair[1].token,
        valueA: pair[0].inputValue,
        valueB: pair[1].inputValue,
        pool: poolsWithTokens.find(pool => pool.address === poolAddress),
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

watch(type, (val) => {
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
          maxlength="12"
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
        :options="[{ id: 0, label: 'One coin', value: 'one' }, { id: 1, label: 'Balanced', value: 'balanced' }]"
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
              <BaseAvatar
                class="icon--32"
                :src="pair[0].token.logo"
              />
              {{ pair[0].token.symbol }}
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
              <BaseAvatar
                class="icon--32"
                :src="pair[1].token.logo"
              />
              {{ pair[1].token.symbol }}
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
              { id: 0, value: 0, label: pair[0].token.symbol },
              { id: 1, value: 1, label: pair[1].token.symbol },
            ]"
            @update:model-value="calcRatesByOneCoin($event as 0 | 1)"
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
                  <BaseAvatar
                    class="icon--32"
                    :src="pair[option.value as 0 | 1].token.logo"
                  />
                  {{ pair[option.value as 0 | 1].token.symbol }}
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
          <span class="c-secondary-text">~0.14 TON</span>
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
