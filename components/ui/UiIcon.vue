<template>
  <span
    :class="$style.UiIcon"
    class="icon"
    v-html="icon"
  />
</template>

<script lang="ts" setup>
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
})
const icon = ref('')

watchEffect(async () => {
  try {
    const iconsImport = import.meta.glob('assets/icons/**/**.svg', {
      query: '?raw',
      import: 'default',
      eager: false,
    })
    icon.value = await iconsImport[`/assets/icons/${props.name}.svg`]() as string
  }
  catch {
    console.error(`Icon '${props.name}' doesn't exist in 'assets/icons'`)
  }
})
</script>

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
