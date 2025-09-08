<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
const { src } = defineProps<{ src: string | string[] }>()
const images = computed(() => typeof src === 'string' ? [src] : src)
</script>

<template>
  <div :class="$style.BaseAvatar">
    <span
      v-for="(image, idx) in images"
      :key="idx"
      :class="$style.icon"
      class="icon"
      v-bind="$attrs"
      :style="{ backgroundImage: `url(${image})` }"
    />
  </div>
</template>

<style module lang="scss">
.BaseAvatar {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  overflow: hidden;
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  flex-shrink: 0;

  &:not(:first-child) {
    margin-left: -8px;
  }
}
</style>
