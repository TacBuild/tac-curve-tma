<script setup lang="ts">
import type { IRoute } from '@curvefi/api/lib/interfaces'
import { NuxtLink } from '#components'

const { poolsMap, coinsMap } = useCurve()
const { route, loading } = defineProps<{ route: IRoute, loading?: boolean, empty?: boolean }>()

const paths = computed(() => {
  return route.map((routePool) => {
    const pool = poolsMap.get(routePool.poolId)
    return {
      name: pool?.name || routePool?.poolId || 'Unknown',
      // link: pool?.address ? `/pools/${pool?.address}/deposit` : undefined,
      link: undefined,
      inputCoinSymbol: coinsMap.get(routePool.inputCoinAddress)?.symbol || 'UKWN',
      outputCoinSymbol: coinsMap.get(routePool.outputCoinAddress)?.symbol || 'UKWN',
    }
  })
})
</script>

<template>
  <div :class="[$style.SwapRouterPath, { [$style._one]: empty || loading || route.length === 1 }]">
    <template v-if="route.length || loading || empty">
      <p class="weight-600 mb-4">
        Trade routed through:
      </p>

      <div
        v-if="empty"
        class="c-secondary-text"
      >
        -
      </div>

      <div
        v-else-if="loading"
        class="ui-loader"
      />

      <div
        v-else-if="route.length"
        :class="$style.paths"
      >
        <div
          v-show="route.length > 1"
          :class="$style.pathVisual"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.486 2 2 6.486 2 12c.001 5.515 4.487 10.001 10 10.001 5.514 0 10-4.486 10.001-10.001S17.515 2 12 2m0 18.001c-4.41 0-7.999-3.589-8-8.001 0-4.411 3.589-8 8-8 4.412 0 8.001 3.589 8.001 8-.001 4.412-3.59 8.001-8.001 8.001" />
          </svg>
          <span />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class=""
          >
            <path d="M12 2C6.486 2 2 6.486 2 12c.001 5.515 4.487 10.001 10 10.001 5.514 0 10-4.486 10.001-10.001S17.515 2 12 2m0 18.001c-4.41 0-7.999-3.589-8-8.001 0-4.411 3.589-8 8-8 4.412 0 8.001 3.589 8.001 8-.001 4.412-3.59 8.001-8.001 8.001" />
          </svg>
        </div>
        <div
          v-for="(path, idx) in paths"
          :key="idx"
          :class="$style.path"
          class="mb-4"
        >
          <component
            :is="path.link ? NuxtLink : 'span'"
            class="weight-600"
            :style="{ textDecoration: path.link ? 'underline': 'none' }"
            :to="path.link"
          >
            {{ path.name }}
          </component>

          <span class="c-secondary-text p3">
            {{ path.inputCoinSymbol }}
            <svg
              focusable="false"
              preserveAspectRatio="xMidYMid meet"
              fill="currentColor"
              width="12"
              height="12"
              viewBox="0 0 16 16"
              aria-hidden="true"
              class="sc-ednfzi hCntiV"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.3 3.7L13.1 7.5 1 7.5 1 8.5 13.1 8.5 9.3 12.3 10 13 15 8 10 3z" />
            </svg>
            {{ path.outputCoinSymbol }}
          </span>
        </div>
      </div>
    </template>

    <UiError
      v-else
      error="Suitable swap route is not available on Curve."
      style="margin-top: 0"
    />
  </div>
</template>

<style module lang="scss">
.SwapRouterPath {
  display: flex;
  flex-direction: column;
  min-height: 24px;

  &._one {
    flex-direction: row;
    justify-content: space-between;
  }
}

.paths {
  position: relative;
  padding-left: 16px;
}

.path {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.pathVisual {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 4px;
  left: 2px;
  top: 5px;
  bottom: 8px;
  transform: translate3d(0,0,0);

  svg {
    width: 8px;
    height: 8px;
    flex-shrink: 0;
  }

  span {
    border-left: 2px dotted;
    margin: -1px 0px -1px 3px;
    height: 100%;
    opacity: 0.5;
  }
}
</style>
