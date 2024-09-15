<script setup lang="ts">
</script>

<template>
  <section class="page-wrapper">
    <div class="container" :class="$style.container">
      <h1 class="h1 mb-12">
        Swap
      </h1>

      <SwapForm />
    </div>
  </section>
</template>

<style module lang='scss'>
.container {
  max-width: 500px !important;
}
</style>
