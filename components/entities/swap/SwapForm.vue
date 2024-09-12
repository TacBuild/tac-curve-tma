<script setup lang="ts">
import type { Token } from '~/entities/token';
import { useTonConnect } from '~/composables/useTonConnect';
import { useModal } from '~/components/ui/composables/useModal';
import { BaseModal } from '#components';

const modal = useModal();
const { isLoaded, isConnected, getTonConnectUI, disconnect } = useTonConnect();
const pair: { id: number, token: Token, inputValue?: number | string }[] = reactive([
  {
    id: 1,
    token: { ticker: 'TON', iconUrl: '/tokens/ton.webp' },
    inputValue: '1'
  },
  {
    id: 2,
    token: { ticker: 'TAC', iconUrl: '/tokens/tac.webp' },
    inputValue: ''
  }
]);

const swapPair = () => {
  pair.reverse();
};

const onSubmit = () => {
  if (!isConnected.value) {
    getTonConnectUI().modal.open();
    return;
  }

  modal.open(BaseModal, {
    props: {
      title: 'Pending',
      text: 'Your transaction is in pending status. Please wait for its confirmation'
    }
  });
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
          <SvgIcon name="swap-arrows" class="c-secondary-text icon--32 " />
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
        @click="disconnect()"
      >
        Disconnect wallet
      </button>

      <UiButton type="submit" wide>
        {{ !isConnected ? 'Connect wallet' : 'Swap' }}
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
