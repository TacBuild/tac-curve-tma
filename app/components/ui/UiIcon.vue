<script lang="ts" setup>
const { name } = defineProps<{ name?: string }>()
const icon = ref('')

watchEffect(async () => {
  try {
    const iconsImport = import.meta.glob('assets/icons/**/**.svg', {
      query: '?raw',
      import: 'default',
      eager: false,
    })
    icon.value = await iconsImport[`/assets/icons/${name}.svg`]() as string
  }
  catch {
    console.error(`Icon '${name}' doesn't exist in 'assets/icons'`)
  }
})
</script>

<template>
  <span
    :class="$style.UiIcon"
    class="icon"
    v-html="icon"
  />
</template>

<style lang="scss" module>
.UiIcon {
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        width: inherit;
        height: inherit;
    }
}
</style>
