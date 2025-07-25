<script setup lang="ts">
import { usePools } from '~/composables/usePools'

defineOptions({
  name: 'IndexPage',
})
usePools()
</script>

<template>
  <div>
    <SwapForm :class="$style.form" />
  </div>
</template>

<style module lang='scss'>
.form {
  min-height: calc(100dvh - 180px);
}
</style>
