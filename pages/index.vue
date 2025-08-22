<script setup lang="ts">
import { useCurve } from '~/composables/useCurve'

defineOptions({
  name: 'IndexPage',
})
useCurve()
</script>

<template>
  <div>
    <!--    <SwapForm :class="$style.form" /> -->
    <SwapRouterForm :class="$style.form" />
  </div>
</template>

<style module lang='scss'>
.form {
  min-height: calc(100dvh - 180px);
}
</style>
