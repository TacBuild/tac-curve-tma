<script setup lang="ts">
definePageMeta({
  keepalive: true,
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
