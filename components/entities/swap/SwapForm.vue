<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui'
import { useDebounceFn } from '@vueuse/core'
import { Address, fromNano, toNano } from '@ton/ton'
import { pools, type Token, tokens } from '~/entities/token'
import { useTonConnect } from '~/composables/useTonConnect'
import { useModal } from '~/components/ui/composables/useModal'
import { BaseModal } from '#components'
import { fetchTonBalance, SLIPPAGE_PERCENT_VALUE } from '~/utils/ton-utils'
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
  swap,
  getSwapRates,
} = useSwap()
const {
  tacSdk,
  isLoaded: isTacLoaded,
} = useTac()

const pool = ref(pools[0])

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

  return isSwapping.value || isLoadingBalances.value || !pair[0].inputValue || Number(pair[0].inputValue) > pair[0].balance
})
const isReady = computed(() => isConnected.value && isTacLoaded.value)

const getRate = async (method: 'get_dy' | 'get_dx', value: number, keys: Array<number>) => {
  const rate = await getSwapRates(method, pool.value[1], toNano(value), keys)
  return Number(rate || 0)
}
const loadBalances = async () => {
  try {
    isLoadingBalances.value = true
    pair[0].balance = pair[0].token.tvmTokenAddress === 'ton'
      ? await fetchTonBalance(Address.parse(address.value))
      : Number(await tacSdk.value?.getUserJettonBalance(address.value, pair[0].token.tvmTokenAddress)) / 10 ** pair[0].token.decimals || 0
    pair[1].balance = pair[1].token.tvmTokenAddress === 'ton'
      ? await fetchTonBalance(Address.parse(address.value))
      : Number(await tacSdk.value?.getUserJettonBalance(address.value, pair[1].token.tvmTokenAddress)) / 10 ** pair[1].token.decimals || 0
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
    rate = value <= 0 ? 0 : await getRate(inputIndex === 0 ? 'get_dy' : 'get_dx', value, keys)
  }
  catch (e) {
    errorRate.value = 'Unable to calculate rate'
    console.warn(e)
    rate = 0
  }
  const result = fromNano(rate)
  if (inputIndex === 0) {
    pair[1].inputValue = !value ? '' : result
  }
  else {
    pair[0].inputValue = !value ? '' : result
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

  try {
    pair[0].inputValue = String(Math.trunc((Number(pair[0].inputValue)) * 10 ** pair[0].token.decimals) / 10 ** pair[0].token.decimals)
    isSwapping.value = true
    const txLinker = await swap(
      pool.value[1],
      pair[0].token.tvmTokenAddress,
      pair.map(o => o.swapKey),
      Number(pair[0].inputValue),
      pair[0].token.decimals || 9,
    )

    if (!txLinker) {
      return
    }

    modal.open(BaseModal, {
      props: {
        title: 'Transaction submitted',
        text: 'Please wait a couple of minutes for the swap to complete and check your wallet balance.',
        status: 'success',
      },
      onClose: () => {
        loadBalances()
      },
    })
  }
  catch (e) {
    console.warn(e)
    modal.open(BaseModal, {
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

calcRate(0)

watch(pool, () => {
  const keys = pool.value[0].split('-')
  const token1 = tokens.find(token => token.tokenName === keys[0])
  const token2 = tokens.find(token => token.tokenName === keys[1])

  if (token1 && token2) {
    Object.assign(pair, [
      {
        id: 1,
        token: token1,
        inputValue: '1',
        balance: 0,
        swapKey: 0,
      },
      {
        id: 2,
        token: token2,
        inputValue: '0',
        balance: 0,
        swapKey: 1,
      },
    ])

    if (isReady.value) {
      loadBalances()
      calcRate(0)
    }
  }
})
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
      <UiSelect
        v-model="pool"
        label="Pool"
        class="mb-12"
      >
        <option
          v-for="item in pools"
          :key="item[1]"
          :value="item"
        >
          {{ item[0] }}
        </option>
      </UiSelect>
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
          step="0.1"
          autocomplete="off"
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
            <TokenButton
              key="tb0"
              :token="pair[0].token"
              :desc="shorterAddress"
            />
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
              :token="pair[1].token"
            />
          </template>
        </UiInput>
      </TransitionGroup>

      <p
        :class="$style.info"
        class="mb-8"
      >
        <span class=" weight-600">Slippage tolerance</span>
        <span class="c-secondary-text">{{ SLIPPAGE_PERCENT_VALUE }}%</span>
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
