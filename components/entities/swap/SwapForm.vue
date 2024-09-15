<script setup lang="ts">
import { UserRejectsError } from '@tonconnect/ui';
import { type Token, tokens } from '~/entities/token';
import { useTonConnect } from '~/composables/useTonConnect';
import { useModal } from '~/components/ui/composables/useModal';
import { BaseModal } from '#components';
import { SLIPPAGE_PERCENT_VALUE } from '~/utils/ton-utils';
import { useSwap } from '~/composables/useSwap';

const modal = useModal();
const { isLoaded, isConnected, address, walletName, shorterAddress, getTonConnectUI, disconnect } = useTonConnect();
const { swap, getSwapRates } = useSwap();
const pair: { main?: boolean, id: number, token: Token, inputValue: string, balance: number }[] = reactive([
  {
    main: true,
    id: 1,
    token: tokens.stton,
    inputValue: '1',
    balance: 0
  },
  {
    id: 2,
    token: tokens.tac,
    inputValue: '',
    balance: 0
  }
]);
const rate = ref(0);
const isLoading = ref(false);
const isLoadingRates = ref(false);
const isSwapping = ref(false);

const isSubmitDisabled = computed(() => {
  if (!isConnected.value) {
    return !isLoaded.value;
  }

  return isSwapping.value || isLoading.value || !pair[0].inputValue || Number(pair[0].inputValue) > pair[0].balance;
});

const loadRates = async () => {
  try {
    isLoadingRates.value = true;
    rate.value = Number(await getSwapRates(String(10 ** 9))) / (10 ** 9);
    calcRate(0, pair[0].main);
  } catch (e) {
    console.warn(e);
  } finally {
    isLoadingRates.value = false;
  }
};
const loadBalances = async () => {
  try {
    isLoading.value = true;
    pair[0].balance = await getJettonBalance(address.value, pair[0].token.tokenAddress);
    await new Promise(resolve => setTimeout(resolve, 3000));
    pair[1].balance = await getJettonBalance(address.value, pair[1].token.tokenAddress);
  } catch (e) {
    console.warn(e);
  } finally {
    isLoading.value = false;
  }
};
const swapPair = () => {
  pair.reverse();
};
const calcRate = (inputIndex: number, isMain?: boolean) => {
  const value = Number(pair[inputIndex].inputValue || 0);
  const safeRate = rate.value || 0;
  const result = String(Math.trunc((isMain ? safeRate * value : value / safeRate) * 10 ** 9) / 10 ** 9);
  if (inputIndex === 0) {
    pair[1].inputValue = !value ? '' : result;
  } else {
    pair[0].inputValue = !value ? '' : result;
  }
};
const onSubmit = async () => {
  if (!pair[0].inputValue) {
    return;
  }

  if (!isConnected.value) {
    getTonConnectUI().modal.open();
    return;
  }

  try {
    pair[0].inputValue = String(Math.trunc((Number(pair[0].inputValue)) * 10 ** 9) / 10 ** 9);
    isSwapping.value = true;
    await swap(getTonConnectUI(), address.value, pair[0].token.tokenAddress, pair[0].token.jsonArguments, pair[0].inputValue);
    console.log('*****Swapped');
    modal.open(BaseModal, {
      props: {
        title: 'Confirmed',
        text: 'Congratulations! Your swap transaction has been confirmed. Check out your updated balance in your wallet'
      },
      onClose: () => {
        loadBalances();
      }
    });
  } catch (e) {
    modal.open(BaseModal, {
      props: {
        title: 'Failed',
        text: (e as Error).message.includes('Transaction was not sent')
          ? 'Transaction was not sent'
          : e instanceof UserRejectsError
            ? 'You rejected the transaction'
            : 'Something went wrong. Make sure you have enough token balance and try again'
      }
    });
  } finally {
    isSwapping.value = false;
  }
};

loadRates();

watch(isConnected, (val) => {
  if (val) {
    loadBalances();
  }
}, { immediate: true });
</script>

<template>
  <form :class="$style.SwapForm" @submit.prevent="onSubmit">
    <template v-if="isLoaded">
      <TransitionGroup tag="div" name="swap" :class="$style.inputs" class="mb-16">
        <UiInput
          :key="pair[0].id"
          v-model="pair[0].inputValue"
          name="swap-from"
          maxlength="12"
          autocomplete="off"
          inputmode="numeric"
          only-number
          :disabled="isSwapping || isLoadingRates"
          @input="calcRate(0, pair[0].main)"
        >
          <template #label>
            {{ isConnected ? `Avail. ${isLoading ? 'loading...' : pair[0].balance}` : 'You send' }}
          </template>
          <template #append>
            <TokenButton :token="pair[0].token" :desc="shorterAddress" />
          </template>
        </UiInput>
        <button key="swap-button" type="button" class="mx-auto" @click="swapPair">
          <UiIcon name="swap-arrows" class="c-secondary-text icon--32 " />
        </button>
        <UiInput
          :key="pair[1].id"
          v-model="pair[1].inputValue"
          name="swap-to"
          maxlength="12"
          autocomplete="off"
          inputmode="numeric"
          only-number
          :disabled="isSwapping || isLoadingRates"
          @input="calcRate(1, pair[1].main)"
        >
          <template #label>
            {{ isConnected ? `Avail. ${isLoading ? 'loading...' : pair[1].balance}` : 'You receive' }}
          </template>
          <template #append>
            <TokenButton :token="pair[1].token" />
          </template>
        </UiInput>
      </TransitionGroup>

      <p :class="$style.info" class="mb-8">
        <span class=" weight-600">Slippage tolerance</span>
        <span class="c-secondary-text">{{ SLIPPAGE_PERCENT_VALUE }}%</span>
      </p>

      <p :class="$style.info" class="mb-24">
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
        :loading="isSwapping || isLoading"
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
