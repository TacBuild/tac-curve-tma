<script setup lang="ts">
import type { Token } from '~/entities/token';
import { useTonConnect } from '~/composables/useTonConnect';
import { useModal } from '~/components/ui/composables/useModal';
import { BaseModal } from '#components';
import { swapToTAC } from '#imports';

const modal = useModal();
const { isLoaded, isConnected, address, walletName, getTonConnectUI, disconnect } = useTonConnect();
const pair: { id: number, token: Token, inputValue: string }[] = reactive([
  {
    id: 1,
    token: { ticker: 'stTON', iconUrl: '/tokens/stton.png' },
    inputValue: '1'
  },
  {
    id: 2,
    token: { ticker: 'TAC', iconUrl: '/tokens/tac.webp' },
    inputValue: ''
  }
]);
const isSwapping = ref(false);

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

  if (pair[1].token.ticker === 'TAC') {
    try {
      isSwapping.value = true;
      await swapToTAC(getTonConnectUI().connector, address.value, pair[0].inputValue);
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
  }
};
</script>

<template>
  <form :class="$style.SwapForm" @submit.prevent="onSubmit">
    <template v-if="isLoaded">
      <TransitionGroup tag="div" name="swap" :class="$style.inputs" class="mb-16">
        <UiInput
          :key="pair[0].id"
          v-model="pair[0].inputValue"
          label="You send"
          maxlength="12"
          inputmode="numeric"
          only-number
        >
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
          label="You receive"
          maxlength="12"
          inputmode="numeric"
          only-number
        >
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

      <UiButton type="submit" :loading="isSwapping" :disabled="isSwapping" wide>
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
