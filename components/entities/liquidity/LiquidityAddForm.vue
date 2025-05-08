<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui'
import { Address } from '@ton/ton'
import { useDebounceFn } from '@vueuse/core'
import { type Token, tokens } from '~/entities/token'
import { useTonConnect } from '~/composables/useTonConnect'
import { useModal } from '~/components/ui/composables/useModal'
import { TransactionDetailsModal, SwapStatusModal } from '#components'
import { fetchTonBalance, valueToNano } from '~/utils/ton-utils'
import { useSwap } from '~/composables/useSwap'
import { formatNumber } from '~/utils/string-utils'
import { poolsWithTokens } from '~/entities/pool'

const modal = useModal()
const { isLoaded: isTonLoaded, isConnected, address, walletName, getTonConnectUI } = useTonConnect()
const { addLiquidity, getLiquidityRates, slippagePercent } = useSwap()
const { tacSdk, isLoaded: isTacLoaded } = useTac()

const { poolAddress } = defineProps<{ poolAddress: string }>()

const error = ref('')
const rate: Ref<number | undefined> = ref(undefined)
const errorRate = ref('')
const isLoadingBalances = ref(false)
const isSubmitting = ref(false)
const isLoaded = ref(false)
const pair: { id: number, token: Token, inputValue: string, balance: number }[]
  = reactive([{
    id: 1,
    token: tokens[0],
    inputValue: '0',
    balance: 0,
  }, {
    id: 2,
    token: tokens[1],
    inputValue: '0',
    balance: 0,
  },
  ])

const isSubmitDisabled = computed(() => {
  if (!isConnected.value) {
    return !isTonLoaded.value
  }

  return Boolean(errorRate.value) || isSubmitting.value
    || isLoadingBalances.value || !pair[0].inputValue
    || Number(pair[0].inputValue) > pair[0].balance
    || Number(pair[1].inputValue) > pair[1].balance
    || Number(pair[0].inputValue) <= 0 || Number(pair[1].inputValue) <= 0
})
const isReady = computed(() => isConnected.value && isTacLoaded.value && isLoaded.value)

const load = () => {
  isLoaded.value = false
  const pool = poolsWithTokens.find(pool => pool.address === poolAddress)
  if (!pool) {
    error.value = 'Pool not found'
    isLoaded.value = true
    return
  }
  Object.assign(pair[0].token, pool!.tokens[0])
  Object.assign(pair[1].token, pool!.tokens[1])
  isLoaded.value = true
}
const calcRates = useDebounceFn(async () => {
  const amounts = [valueToNano(pair[0].inputValue, pair[0].token.decimals), valueToNano(pair[1].inputValue, pair[1].token.decimals)]
  errorRate.value = ''
  try {
    rate.value = +nanoToValue(await getLiquidityRates(poolAddress, amounts, true), 18).toFixed(9)
  }
  catch (e) {
    rate.value = undefined
    errorRate.value = 'Unable to calculate rate. Price impact may be very high.'
    console.warn(e)
  }
}, 200)
const updateBalances = async () => {
  try {
    isLoadingBalances.value = true
    pair[0].balance = !pair[0].token.evmTokenAddress
      ? await fetchTonBalance(Address.parse(address.value))
      : nanoToValue(
          await tacSdk.value?.getUserJettonBalance(
            address.value,
            await tacSdk.value?.getTVMTokenAddress(pair[0].token.evmTokenAddress)).catch(() => 0) || 0,
          pair[0].token.decimals,
        )
    pair[1].balance = !pair[1].token.evmTokenAddress
      ? await fetchTonBalance(Address.parse(address.value))
      : nanoToValue(
          await tacSdk.value?.getUserJettonBalance(
            address.value,
            await tacSdk.value?.getTVMTokenAddress(pair[1].token.evmTokenAddress)).catch(() => 0) || 0,
          pair[1].token.decimals,
        )
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
      poolAddress,
      pair[0].token.evmTokenAddress, pair[1].token.evmTokenAddress,
      valueToNano(pair[0].inputValue, pair[0].token.decimals),
      valueToNano(pair[1].inputValue, pair[1].token.decimals),
      valueToNano(rate.value || 0, 18),
    )

    modal.open(TransactionDetailsModal, {
      props: {
        type: 'add-liquidity',
        title: 'Deposit details',
        tokenA: pair[0].token,
        tokenB: pair[1].token,
        valueA: pair[0].inputValue,
        valueB: pair[1].inputValue,
        pool: poolsWithTokens.find(pool => pool.address === poolAddress),
        poolValue: rate.value,
        transactionLinker: txLinker,
      },
      onClose: () => {
        updateBalances()
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
}

load()
watch(isReady, (val) => {
  if (val) {
    updateBalances()
  }
}, { immediate: true })
</script>

<template>
  <form
    :class="$style.LiquidityAddForm"
    @submit.prevent="onSubmit"
  >
    <template v-if="isLoaded">
      <div
        :class="$style.inputs"
        class="mb-16"
      >
        <UiInput
          :key="pair[0].id"
          v-model="pair[0].inputValue"
          name="swap-from"
          maxlength="12"
          autocomplete="off"
          step="0.1"
          inputmode="decimal"
          only-number
          :disabled="isSubmitting"
          @input="calcRates"
        >
          <template #label>
            {{
              isConnected ? `Avail. ${isLoadingBalances || !isTacLoaded
                ? 'loading...' : formatNumber(pair[0].balance, pair[0].token.decimals)}`
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

              <BaseAvatar
                class="icon--32"
                :src="pair[0].token.logo"
              />
            </div>
          </template>
        </UiInput>
        <UiInput
          :key="pair[1].id"
          v-model="pair[1].inputValue"
          name="swap-to"
          maxlength="12"
          autocomplete="off"
          step="0.1"
          inputmode="decimal"
          only-number
          :disabled="isSubmitting"
          @input="calcRates"
        >
          <template #label>
            {{
              isConnected ? `Avail. ${isLoadingBalances || !isTacLoaded
                ? 'loading...' : formatNumber(pair[1].balance, pair[1].token.decimals)}`
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
              <BaseAvatar
                class="icon--32"
                :src="pair[1].token.logo"
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
            class="c-secondary-text"
            :class="{ 'c-red': errorRate }"
          >~{{ rate || '-' }} {{ tokens[0].symbol }}-{{ tokens[1].symbol }}</span>
        </p>

        <p
          v-if="errorRate"
          class="c-red"
        >
          {{ errorRate }}
        </p>

        <p :class="$style.info">
          <span class=" weight-600">Slippage Tolerance</span>
          <span class="c-secondary-text">{{ slippagePercent }}%</span>
        </p>

        <p :class="$style.info">
          <span class=" weight-600">Network fee</span>
          <span class="c-secondary-text">~0.14 TON</span>
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
    <template v-else-if="error">
      <div class="mx-auto">
        {{ error }}
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
