<script setup lang="ts">
import type { PoolWithTokens } from '~/entities/pool'

const emits = defineEmits(['close'])
const { pool } = defineProps<{ pool: PoolWithTokens }>()

const { address } = useTonConnect()
const { tacSdk } = useTac()

const isLoading = ref(false)
const balance = ref(0)

const load = async () => {
  try {
    isLoading.value = true

    const jettonAddress = await tacSdk.value?.getTVMTokenAddress(pool.address)
    if (!jettonAddress) {
      return
    }

    const balanceRaw = await tacSdk.value?.getUserJettonBalance(address.value, jettonAddress)
    balance.value = nanoToValue(balanceRaw || 0n, 18)
  }
  catch (e) {
    console.warn(e)
  }
  finally {
    isLoading.value = false
  }
}

const changeRoute = (route: string) => {
  emits('close')

  setTimeout(() => {
    useRouter().push(route)
  }, 300)
}
load()
</script>

<template>
  <BaseModalWrapper @close="$emit('close')">
    <template #title>
      Pool
    </template>

    <div :class="$style.content">
      <div
        :class="$style.token"
        class="flex-center"
      >
        <BaseAvatar
          class="icon--32"
          :src="[pool.tokens[0].logo, pool.tokens[1].logo]"
        />

        <p class="weight-600 p2">
          {{ pool.name }}
        </p>
      </div>

      <div
        :class="$style.position"
        class="flex-between flex-center mt-12 weight-600"
      >
        <p>
          Position
        </p>

        <p
          class="right c-secondary-text"
          style="line-height: 24px"
        >
          <span
            v-if="isLoading"
            class="ui-loader"
          />
          <span v-else>
            {{ balance }} LP
          </span>
        </p>
      </div>

      <div :class="$style.btns">
        <UiButton
          wide
          @click="changeRoute(`/pools/${pool.name}/deposit`)"
        >
          Deposit
        </UiButton>
        <UiButton
          :disabled="balance <= 0"
          class="mt-16"
          wide
          @click="changeRoute(`/pools/${pool.name}/withdraw`)"
        >
          Withdraw
        </UiButton>
      </div>
    </div>
  </BaseModalWrapper>
</template>

<style module lang="scss">
.token {
  gap: 8px;
  padding: 12px 0;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
}

.btns {
  margin-top: 60px;
}
</style>
