<script setup lang="ts">
import type { PoolWithTokens } from '~/entities/pool'
import { formatNumber } from '~/utils/string-utils'

const emits = defineEmits(['close'])
const { pool } = defineProps<{ pool: PoolWithTokens }>()

const { fetchJettonBalanceByEvmAddress } = useTac()

const isLoading = ref(false)
const balance = ref(0)

const load = async () => {
  try {
    isLoading.value = true
    balance.value = await fetchJettonBalanceByEvmAddress(pool.address)
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
            {{ formatNumber(balance, 9) }} LP
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
