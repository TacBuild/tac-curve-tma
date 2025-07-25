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
        <div
          v-if="route.name === 'index' || route.name === 'pools'"
          :class="$style.sticky"
          class="mb-32"
        >
          <UiTabs
            :model-value="activeRoute"
            :tabs="[{ label: 'Swap', value: 'index' }, { label: 'Pools', value: 'pools' }]"
            @update:model-value="onChangeNav($event as string)"
          />
        </div>

        <NuxtPage
          :page-key="route => route.fullPath"
          :keepalive="{ include: ['IndexPage', 'PoolsPage'] }"
        />
      </div>
    </section>

    <UiModals />
  </main>
</template>

<style module lang="scss">
.sticky {
  position: sticky;
  top: 62px;
  z-index: 1;
  margin-left: calc(-1 * var(--container-padding-side));
  margin-right: calc(-1 * var(--container-padding-side));
  padding: var(--container-padding);
  background-color: var(--c-body-bg);
}
</style>
