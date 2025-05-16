<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { init: initTac } = useTac()
const { init: initTonConnect } = useTonConnect()

const onChangeNav = (name: string) => {
  router.push({ name })
}

const activeRoute = computed(() => {
  if (route.name === 'liquidity-index-withdraw') {
    return 'liquidity-index'
  }

  return route.name
})

initTac()
initTonConnect()
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

        <NuxtPage :keepalive="{ include: ['IndexPage', 'PoolsPage'] }" />
      </div>
    </section>
    <UiModals />
  </main>
</template>

<style module lang="scss">
</style>
