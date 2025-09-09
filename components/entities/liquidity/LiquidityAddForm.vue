<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui'
import { useDebounceFn } from '@vueuse/core'
import type { Reactive } from 'vue'
import { formatUnits, parseUnits } from 'ethers'
import { useTonConnect } from '~/composables/useTonConnect'
import { useModal } from '~/components/ui/composables/useModal'
import { TransactionDetailsModal, SwapStatusModal } from '#components'
import { useTransaction } from '~/composables/useTransaction'
import { formatNumber } from '~/utils/string-utils'
import type { Pool, PoolCoin } from '~/entities/pool'

const modal = useModal()
const {
  isLoaded: isTonLoaded,
  isConnected, walletName, balance,
  fetchTonBalance, getTonConnectUI, updateTonBalance } = useTonConnect()
const { addLiquidity, getLiquidityRates, slippagePercent } = useTransaction()
const { fetchJettonBalanceByEvmAddress, isLoaded: isTacLoaded } = useTac()
const { getCoin, aprs } = useCurve()

const { pool } = defineProps<{ pool: Pool }>()

const error = ref('')
const rate: Ref<bigint> = ref(0n)
const errorRate = ref('')
const isLoadingBalances = ref(false)
const isSubmitting = ref(false)

const getErrorForToken = (item: typeof pair[number]) => {
  if (item.balance < +item.inputValue) {
    return `Insufficient ${item.coin?.symbol} balance`
  }

  return ''
}

const pair: Reactive<{ id: number, coin: PoolCoin | undefined, inputValue: string, balance: number, error: ComputedRef<string> }[]>
  = reactive([{
    id: 1,
    coin: await getCoin(pool.underlyingCoinAddresses[0], true),
    inputValue: '1',
    balance: 0,
    error: computed(() => !isConnected.value || !isReady.value || isLoadingBalances.value ? '' : getErrorForToken(pair[0])),
  }, {
    id: 2,
    coin: await getCoin(pool.underlyingCoinAddresses[1], true),
    inputValue: '1',
    balance: 0,
    error: computed(() => !isConnected.value || !isReady.value || isLoadingBalances.value ? '' : getErrorForToken(pair[1])),
  },
  ])

const isSubmitDisabled = computed(() => {
  if (!isConnected.value) {
    return !isTonLoaded.value
  }

  return isNotEnoughForFee.value || Boolean(errorRate.value) || isSubmitting.value
    || isLoadingBalances.value || !pair[0].inputValue
    || Number(pair[0].inputValue) > pair[0].balance
    || Number(pair[1].inputValue) > pair[1].balance
    || Number(pair[0].inputValue) <= 0 || Number(pair[1].inputValue) <= 0
})
const isReady = computed(() => isConnected.value && isTacLoaded.value)
const isNotEnoughForFee = computed(() => (balance.value < 1.5) && isConnected.value)

const calcRates = useDebounceFn(async () => {
  console.log(pool, await pool.stats.parameters())
  const amounts = [
    parseUnits(pair[0].inputValue || '0', +pair[0].coin!.decimals),
    parseUnits(pair[1].inputValue || '0', +pair[1].coin!.decimals),
  ]
  errorRate.value = ''
  try {
    rate.value = await getLiquidityRates(
      pool.address,
      amounts, true,
      pool.isPlain && pool.isNg && !pool.isCrypto ? 'plainstableng' : '',
    )
  }
  catch (e) {
    rate.value = 0n
    errorRate.value = 'Unable to calculate rate. Price impact may be very high.'
    console.warn(e)
  }
}, 200)
const updateBalances = async () => {
  try {
    isLoadingBalances.value = true

    const res = await Promise.all([
      pair[0].coin?.address === 'NONE'
        ? fetchTonBalance()
        : fetchJettonBalanceByEvmAddress(pair[0].coin!.address),
      pair[1].coin?.address === 'NONE'
        ? fetchTonBalance()
        : fetchJettonBalanceByEvmAddress(pair[1].coin!.address),
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
const onSubmit = async () => {
  if (!pair[0].inputValue) {
    return
  }

  if (!isConnected.value) {
    getTonConnectUI().modal.open()
    return
  }

  await handleAddLiquidity()
}
const handleAddLiquidity = async () => {
  try {
    isSubmitting.value = true
    const txLinker = await addLiquidity(
      pool.address,
      pair[0].coin!.address, pair[1].coin!.address,
      parseUnits(pair[0].inputValue, +pair[0].coin!.decimals),
      parseUnits(pair[1].inputValue, +pair[1].coin!.decimals),
      rate.value,
      pool.isPlain && pool.isNg && !pool.isCrypto ? 'plainstableng' : '',
    )

    modal.open(TransactionDetailsModal, {
      props: {
        type: 'add-liquidity',
        title: 'Deposit details',
        tokenA: pair[0].coin,
        tokenB: pair[1].coin,
        valueA: pair[0].inputValue,
        valueB: pair[1].inputValue,
        pool: pool,
        poolValue: formatUnits(rate.value),
        transactionLinker: txLinker,
      },
      onClose: () => {
        updateBalances()
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
const setMax = (inputIdx: 0 | 1) => {
  pair[inputIdx].inputValue = String(pair[inputIdx].balance)
  calcRates()
}

watch(isReady, (val) => {
  if (val) {
    calcRates()
    updateBalances()
  }
}, { immediate: true })
</script>

<template>
  <form
    :class="$style.LiquidityAddForm"
    @submit.prevent="onSubmit"
  >
    <template v-if="error">
      <div class="mx-auto">
        {{ error }}
      </div>
    </template>
    <template v-else>
      <div
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
          :error="pair[0].error"
          :disabled="isSubmitting"
          @input="calcRates"
        >
          <template #label>
            {{
              isConnected ? `Avail. ${isLoadingBalances || !isTacLoaded
                ? 'loading...' : formatNumber(pair[0].balance, +pair[0].coin!.decimals)}`
              : 'Token A'
            }}
          </template>
          <template #append>
            <div class="flex-center">
              <UiButton
                size="smaller"
                class="mr-12"
                :disabled="isSubmitting || isLoadingBalances"
                @click.stop="setMax(0)"
              >
                MAX
              </UiButton>

              <CoinAvatar
                v-if="pair[0].coin"
                class="icon--32"
                :coins="[pair[0].coin]"
              />
            </div>
          </template>
        </UiInput>
        <UiInput
          :key="pair[1].id"
          v-model="pair[1].inputValue"
          name="swap-to"
          maxlength="36"
          autocomplete="off"
          step="0.1"
          inputmode="decimal"
          only-number
          :error="pair[1].error"
          :disabled="isSubmitting"
          @input="calcRates"
        >
          <template #label>
            {{
              isConnected ? `Avail. ${isLoadingBalances || !isTacLoaded
                ? 'loading...' : formatNumber(pair[1].balance, +pair[1].coin!.decimals)}`
              : 'Token B'
            }}
          </template>
          <template #append>
            <div class="flex-center">
              <UiButton
                size="smaller"
                class="mr-12"
                :disabled="isSubmitting || isLoadingBalances"
                @click.stop="setMax(1)"
              >
                MAX
              </UiButton>
              <CoinAvatar
                v-if="pair[1].coin"
                class="icon--32"
                :coins="[pair[1].coin]"
              />
            </div>
          </template>
        </UiInput>
      </div>

      <div
        :class="$style.infos"
        class="mb-24"
      >
        <p :class="$style.info">
          <span class=" weight-600">Minimum LP Tokens</span>
          <span
            class="c-secondary-text right"
            :class="{ 'c-red': errorRate }"
          >~{{ formatNumber(formatUnits(rate || 0n), 9) || '-' }} {{ pool?.symbol }}</span>
        </p>

        <p
          v-if="errorRate"
          class="c-red weight-600"
        >
          {{ errorRate }}
        </p>

        <p :class="$style.info">
          <span class=" weight-600">TVL</span>
          <span class="c-secondary-text right">
            {{ formatUsd(pool?.totalLiquidity, 2) }}
          </span>
        </p>

        <p :class="$style.info">
          <span class="weight-600">APR</span>
          <span class="c-secondary-text right">
            {{ formatPercent((aprs[pool.address] || 0) / 100) }}
          </span>
        </p>

        <p :class="$style.info">
          <span class=" weight-600">Slippage Tolerance</span>
          <span class="c-secondary-text right">
            {{ formatPercent(slippagePercent / 100) }}
          </span>
        </p>

        <p :class="$style.info">
          <template v-if="isNotEnoughForFee">
            <span class="weight-600 c-red">
              Not enough TON for fee. <br>
              You have {{ formatNumber(balance, 2) }} TON
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
      </div>

      <div class="submit-button-sticky-wrap">
        <UiButton
          type="submit"
          :loading="isSubmitting || isLoadingBalances || !isTacLoaded"
          :disabled="isSubmitDisabled"
          wide
        >
          {{
            !isConnected ? 'Connect wallet' : isSubmitting ? `Check ${walletName}` : 'Deposit'
          }}
        </UiButton>
      </div>
    </template>
  </form>
</template>

<style module lang="scss">
.LiquidityAddForm {
  display: flex;
  flex-direction: column;
}

.inputs {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 0;
}

.infos {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.info {
  display: flex;
  justify-content: space-between;
  padding: 1px 0;
}

.disconnect {
  cursor: pointer;
}
</style>
