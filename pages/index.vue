<script setup lang="ts">
defineOptions({
  name: 'IndexPage',
})
</script>

<template>
  <div>
    <SwapForm :class="$style.form" />
  </div>
</template>

<style module lang='scss'>
.form {
  min-height: calc(100dvh - 174px);
}
</style>
