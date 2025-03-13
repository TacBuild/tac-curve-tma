<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui'
import { useDebounceFn } from '@vueuse/core'
import { Address } from '@ton/ton'
import { pools, type Token, tokens } from '~/entities/token'
import { useTonConnect } from '~/composables/useTonConnect'
import { useModal } from '~/components/ui/composables/useModal'
import { HistoryTransactionDetailsModal, SwapConfirmModal, SwapStatusModal } from '#components'
import { fetchTonBalance } from '~/utils/ton-utils'
import { useSwap } from '~/composables/useSwap'

const modal = useModal()
const {
  isLoaded,
  isConnected,
  address,
  walletName,
  shorterAddress,
  getTonConnectUI,
  disconnect,
} = useTonConnect()
const {
  slippagePercent,
  swap,
  getSwapRates,
} = useSwap()
const {
  tacSdk,
  isLoaded: isTacLoaded,
} = useTac()

const pool = ref(pools[0])

const poolTokens: Ref<Token[]> = ref([])
const isLoadingBalances = ref(false)
const isLoadingRates = ref(false)
const isSwapping = ref(false)
const errorRate = ref('')
const pair: { id: number, token: Token, inputValue: string, balance: number, swapKey: 0 | 1 }[]
  = reactive([{
    id: 1,
    token: tokens[0],
    inputValue: '1',
    balance: 0,
    swapKey: 0,
  }, {
    id: 2,
    token: tokens[1],
    inputValue: '0',
    balance: 0,
    swapKey: 1 },
  ])

const isSubmitDisabled = computed(() => {
  if (!isConnected.value) {
    return !isLoaded.value
  }

  return Boolean(errorRate.value) || isSwapping.value
    || isLoadingBalances.value || !pair[0].inputValue
    || Number(pair[0].inputValue) > pair[0].balance
    || Number(pair[0].inputValue) <= 0
})
const isReady = computed(() => isConnected.value && isTacLoaded.value)

const getRate = async (value: number, keys: Array<number>, inputIndex: number) => {
  const method = inputIndex === 0 ? 'get_dy' : 'get_dx'
  const decimals = pair[inputIndex === 0 ? 0 : 1].token.decimals
  const rate = await getSwapRates(method, pool.value[1], BigInt(Math.floor(value * 10 ** decimals)), keys)
  return nanoToValue(rate, pair[inputIndex === 0 ? 1 : 0].token.decimals)
}
const loadBalances = async () => {
  try {
    isLoadingBalances.value = true
    pair[0].balance = !pair[0].token.evmTokenAddress
      ? await fetchTonBalance(Address.parse(address.value))
      : nanoToValue(await tacSdk.value?.getUserJettonBalance(address.value, await tacSdk.value?.getTVMTokenAddress(pair[0].token.evmTokenAddress)) || 0, pair[0].token.decimals)
    pair[1].balance = !pair[1].token.evmTokenAddress
      ? await fetchTonBalance(Address.parse(address.value))
      : nanoToValue(await tacSdk.value?.getUserJettonBalance(address.value, await tacSdk.value?.getTVMTokenAddress(pair[1].token.evmTokenAddress)) || 0, pair[1].token.decimals)
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isLoadingBalances.value = false
  }
}
const swapPair = () => {
  pair.reverse()
  calcRate(0)
}
const calcRate = useDebounceFn(async (inputIndex: number) => {
  errorRate.value = ''
  const value = Number(pair[inputIndex].inputValue || 0)
  const keys = pair.map(o => o.swapKey)
  let rate
  try {
    rate = value <= 0 ? 0 : await getRate(value, keys, inputIndex)
    console.log(value, keys, inputIndex)
  }
  catch (e) {
    errorRate.value = 'Unable to calculate rate. Price impact may be very high.'
    console.warn(e)
    rate = 0
  }
  if (inputIndex === 0) {
    pair[1].inputValue = !value ? '' : String(rate)
  }
  else {
    pair[0].inputValue = !value ? '' : String(rate)
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

  pair[0].inputValue = String(Math.trunc((Number(pair[0].inputValue)) * 10 ** pair[0].token.decimals) / 10 ** pair[0].token.decimals)
  calcRate(0)
  modal.open(SwapConfirmModal, {
    props: {
      poolAddress: pool.value[1],
      fromToken: pair[0].token,
      toToken: pair[1].token,
      fromValue: pair[0].inputValue,
      toValue: pair[1].inputValue,
      swapMethod: pair[0].swapKey === 0 ? 'get_dy' : 'get_dx',
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
      pool.value[1],
      pair[0].token.evmTokenAddress,
      pair.map(o => o.swapKey),
      Number(pair[0].inputValue),
      pair[0].token.decimals || 9,
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
          modal.open(HistoryTransactionDetailsModal, {
            props: {
              fromToken: pair[0].token,
              toToken: pair[1].token,
              fromValue: pair[0].inputValue,
              toValue: pair[1].inputValue,
              transactionLinker: txLinker,
            },
          })
        }, 300)
        loadBalances()
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
    isSwapping.value = false
  }
}
const setMax = () => {
  pair[0].inputValue = String(pair[0].balance)
  calcRate(0)
}
const onTokenChange = (token: Token, index: number) => {
  const validPools = pools.filter(pool => pool[0].includes(token.tokenName))

  if (validPools.length < 0) {
    return
  }

  // set selected token
  Object.assign(pair[index], {
    id: index + 1,
    token,
    inputValue: pair[index].inputValue,
    balance: 0,
    swapKey: 0,
  })

  const currentPoolKey = `${pair[0].token.tokenName}-${pair[1].token.tokenName}`
  const invertedCurrentPoolKey = `${pair[1].token.tokenName}-${pair[0].token.tokenName}`
  pool.value = validPools.find(pool => [currentPoolKey, invertedCurrentPoolKey].includes(pool[0])) || validPools[0]
  const keys = pool.value[0].split('-')

  const pairKey = keys.find(key => key !== token.tokenName)
  const pairToken = tokens.find(token => token.tokenName === pairKey)

  Object.assign(pair[index === 0 ? 1 : 0], {
    id: index === 0 ? 2 : 1,
    token: pairToken,
    inputValue: '0',
    balance: 0,
    swapKey: 1,
  })

  pair[0].swapKey = (keys.findIndex(key => key === pair[0].token.tokenName) || 0) as 0 | 1
  pair[1].swapKey = (keys.findIndex(key => key === pair[1].token.tokenName) || 0) as 0 | 1
  if (isReady.value) {
    loadBalances()
  }

  calcRate(index)
}
const updatePoolTokens = () => {
  poolTokens.value.length = 0
  const validPools = pools.filter(pool => pool[0].includes(pair[0].token.tokenName))

  validPools.forEach((pool) => {
    const keys = pool[0].split('-')
    const pairKey = keys.find(key => key !== pair[0].token.tokenName)
    const token = tokens.find(token => token.tokenName === pairKey)
    if (token) {
      poolTokens.value.push(token)
    }
  })
}

calcRate(0)

watch(() => pair[0].token, () => {
  updatePoolTokens()
}, { immediate: true })
watch(isReady, (val) => {
  if (val) {
    loadBalances()
  }
}, { immediate: true })
</script>

<template>
  <form
    :class="$style.SwapForm"
    @submit.prevent="onSubmit"
  >
    <template v-if="isLoaded">
      <TransitionGroup
        tag="div"
        name="swap"
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
          :disabled="isSwapping || isLoadingRates"
          @input="calcRate(0)"
        >
          <template #label>
            {{
              isConnected ? `Available: ${isLoadingBalances || !isTacLoaded
                ? 'loading...' : pair[0].balance}`
              : 'You send'
            }}
          </template>
          <template #append>
            <div class="flex-center">
              <UiButton
                size="small"
                class="mr-8"
                :disabled="isSwapping || isLoadingBalances"
                @click.stop="setMax"
              >
                MAX
              </UiButton>
              <TokenButton
                key="tb0"
                :desc="shorterAddress"
                :tokens="tokens"
                :model-value="pair[0].token"
                @change="onTokenChange($event, 0)"
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
            class="c-secondary-text icon--32 "
          />
        </button>
        <UiInput
          :key="pair[1].id"
          v-model="pair[1].inputValue"
          name="swap-to"
          maxlength="12"
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
              isConnected ? `Available: ${isLoadingBalances || !isTacLoaded
                ? 'loading...' : pair[1].balance}`
              : 'You receive'
            }}
          </template>
          <template #append>
            <TokenButton
              key="tb1"
              :tokens="poolTokens"
              :model-value="pair[1].token"
              @change="onTokenChange($event, 1)"
            />
          </template>
        </UiInput>
      </TransitionGroup>

      <p
        :class="$style.info"
        class="mb-8"
      >
        <span class=" weight-600">Slippage tolerance</span>
        <span class="c-secondary-text flex-center">
          <span class="mr-4">{{ slippagePercent }}%</span>
          <!-- <UiIcon
            name="cog"
            @click="openSlippageToleranceSettings"
          /> -->
        </span>
      </p>

      <p
        :class="$style.info"
        class="mb-24"
      >
        <span class=" weight-600">Network fee</span>
        <span class="c-secondary-text">~0.14 TON</span>
      </p>

      <button
        v-if="isConnected"
        :class="$style.disconnect"
        type="button"
        class="p1 c-disabled weight-700 mx-auto mb-16"
        :disabled="isSwapping"
        @click="disconnect()"
      >
        Disconnect wallet
      </button>

      <UiButton
        type="submit"
        :loading="isSwapping || isLoadingBalances || !isTacLoaded"
        :disabled="isSubmitDisabled"
        wide
      >
        {{ !isConnected ? 'Connect wallet' : isSwapping ? `Check ${walletName}` : 'Swap' }}
      </UiButton>
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
