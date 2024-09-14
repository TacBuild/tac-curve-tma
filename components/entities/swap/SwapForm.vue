<script setup lang="ts">
import { type Token, tokens } from '~/entities/token';
import { useTonConnect } from '~/composables/useTonConnect';
import { useModal } from '~/components/ui/composables/useModal';
import { BaseModal } from '#components';
import { swap } from '~/utils/ton-utils';

const modal = useModal();
const { isLoaded, isConnected, address, walletName, getTonConnectUI, disconnect } = useTonConnect();
const pair: { id: number, token: Token, inputValue: string, balance: number }[] = reactive([
  {
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
const isLoading = ref(false);
const isSwapping = ref(false);

const load = async () => {
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
const onSubmit = async () => {
  if (!pair[0].inputValue) {
    return;
  }

  if (!isConnected.value) {
    getTonConnectUI().modal.open();
    return;
  }

  try {
    isSwapping.value = true;
    await swap(getTonConnectUI().connector, address.value, pair[0].token.tokenAddress, pair[0].token.jsonArguments, pair[0].inputValue);
    modal.open(BaseModal, {
      props: {
        title: 'Pending',
        text: 'Your transaction is in pending status. Please wait for its confirmation'
      }
    });
  } catch (e) {
    console.warn(e);
    modal.open(BaseModal, {
      props: {
        title: 'Failed',
        text: 'Something went wrong. Make sure you have enough token balance and try again'
      }
    });
  } finally {
    isSwapping.value = false;
  }
};

watch(isConnected, (val) => {
  if (val) { load(); }
}, { immediate: true });
</script>

<template>
  <form :class="$style.SwapForm" @submit.prevent="onSubmit">
    <template v-if="isLoaded">
      <TransitionGroup tag="div" name="swap" :class="$style.inputs" class="mb-16">
        <UiInput
          :key="pair[0].id"
          v-model="pair[0].inputValue"
          maxlength="12"
          inputmode="numeric"
          only-number
        >
          <template #label>
            {{ isConnected ? `Avail. ${isLoading ? 'loading...' : pair[0].balance}` : 'You send' }}
          </template>
          <template #append>
            <TokenButton :token="pair[0].token" />
          </template>
        </UiInput>
        <button key="swap-button" type="button" class="mx-auto" @click="swapPair">
          <UiIcon name="swap-arrows" class="c-secondary-text icon--32 " />
        </button>
        <UiInput
          :key="pair[1].id"
          v-model="pair[1].inputValue"
          maxlength="12"
          inputmode="numeric"
          only-number
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
        <span class="c-secondary-text">0.5%</span>
      </p>

      <p :class="$style.info" class="mb-24">
        <span class=" weight-600">Network fee</span>
        <span class="c-secondary-text">0.01 TON</span>
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
        :loading="isSwapping"
        :disabled="isSwapping || isLoading"
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
