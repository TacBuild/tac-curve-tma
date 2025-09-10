<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { init: initTac } = useTac()
const { init: initTonConnect } = useTonConnect()

const nav = [
  {
    label: 'Swap',
    value: 'index',
  },
  {
    label: 'Pools',
    value: 'pools',
  },
  {
    label: 'Rewards',
    value: 'rewards',
  },
]

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
          v-if="['index', 'pools', 'rewards'].includes(route.name as string)"
          :class="$style.sticky"
          class="mb-32"
        >
          <UiTabs
            :model-value="activeRoute"
            :tabs="nav"
            @update:model-value="onChangeNav($event as string)"
          />
        </div>

        <NuxtPage
          :page-key="route => route.fullPath"
          :keepalive="{ include: ['IndexPage', 'PoolsPage', 'RewardsPage'] }"
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
