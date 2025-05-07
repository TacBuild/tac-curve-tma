<script setup lang="ts">
import { poolsWithTokens, type PoolWithTokens } from '~/entities/pool'
import { useModal } from '~/components/ui/composables/useModal'
import { PoolDetailModal } from '#components'

const modal = useModal()

const openDetail = (pool: PoolWithTokens) => {
  modal.open(PoolDetailModal, {
    props: {
      pool,
    },
  })
}
</script>

<template>
  <ul :class="$style.PoolList">
    <li
      v-for="pool in poolsWithTokens"
      :key="pool.address"
      :class="$style.item"
      @click="openDetail(pool)"
    >
      <PoolItem :pool="pool" />
    </li>
  </ul>
</template>

<style module lang="scss">
.PoolList {
  //
}

.item {
  padding: 16px 0;

  &:not(:last-child) {
    box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
