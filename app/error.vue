<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{ error: NuxtError }>()
</script>

<template>
  <main>
    <TheHeader />

    <section class="page-wrapper">
      <div
        class="container"
        :class="$style.container"
      >
        <p class="h1 w-700 mb-8">
          {{ error.statusCode ? error.statusCode : 'Oops' }}
        </p>
        <p class="mb-12">
          {{ error.message || 'Something went wrong, try again later' }}
        </p>

        <UiButton
          to="/"
          replace
          class="link"
          size="smaller"
        >
          Go back
        </UiButton>
      </div>
    </section>
    <UiModals />
  </main>
</template>

<style module>
.container {
  max-width: 500px !important;
}
</style>
