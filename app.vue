<script setup lang="ts">
// const route = useRoute()
// const router = useRouter()
const { init } = useTac()

init()
</script>

<template>
  <main>
    <TheHeader />
    <section class="page-wrapper">
      <div
        class="container"
        :class="$style.container"
      >
        <NuxtPage keepalive />
      </div>
    </section>
    <UiModals />
  </main>
</template>

<style module lang="scss">
.container {
  max-width: 500px !important;
}
</style>
