<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { init } = useTac()

const onChangeNav = (name: string) => {
  router.replace({ name })
}

const activeRoute = computed(() => {
  if (route.name === 'liquidity-index-withdraw') {
    return 'liquidity-index'
  }

  return route.name
})

init()
</script>

<template>
  <main>
    <TheHeader />

    <section class="page-wrapper">
      <div class="container">
        <UiTabs
          v-if="route.name === 'index' || route.name === 'pools'"
          class="mb-32"
          :model-value="activeRoute"
          :tabs="[{ label: 'Swap', value: 'index' }, { label: 'Pools', value: 'pools' }]"
          @update:model-value="onChangeNav($event as string)"
        />

        <NuxtPage keepalive />
      </div>
    </section>
    <UiModals />
  </main>
</template>

<style module lang="scss">
</style>
