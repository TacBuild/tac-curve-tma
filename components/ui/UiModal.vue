<script setup lang="ts">
import { useModal } from './composables/useModal'

const modal = useModal()
const props = defineProps({
  id: {
    type: Number,
    default: 0,
  },

  component: {
    type: Object,
    default: () => ({}),
    required: true,
  },

  data: {
    type: Object,
    default: () => {},
  },
})

const isComponentVisible = ref(false)
const isPreventClose = ref(false)

const styles = computed(() => {
  return {
    zIndex: props.data.zIndex,
    top: props.data.top || 0,
    bottom: props.data.top || 0,
    height: props.data.height || 'auto',
    position: props.data.position || 'fixed',
  }
})

const close = () => {
  if (isPreventClose.value) {
    return
  }

  if (props.data.onClose) {
    props.data.onClose()
  }
  else if (props.data.props?.onClose) {
    props.data.props.onClose()
  }

  isComponentVisible.value = false
}
const onClickWrapper = () => {
  if (!props.data.isNotClosable) {
    close()
  }
}
const beforeComponentLeave = () => {
  modal.close(props.id)

  if (props.data.beforeComponentLeave) {
    props.data.beforeComponentLeave()
  }
}
const handlePreventClose = (value: boolean) => {
  isPreventClose.value = value
}

onMounted(() => {
  isComponentVisible.value = true
})

onBeforeUnmount(() => {
  isComponentVisible.value = false
})
</script>

<template>
  <div
    class="v-modal"
    :style="styles"
  >
    <transition
      :name="data.transition || 'modal'"
      mode="out-in"
      appear
      @after-leave="beforeComponentLeave"
    >
      <div
        v-if="isComponentVisible"
        class="v-modal__wrapper"
        @click.self="onClickWrapper"
      >
        <component
          :is="component"
          v-bind="data.props"
          :modal-id="id"
          @prevent-close="handlePreventClose"
          @close="close"
        />
      </div>
    </transition>
  </div>
</template>

<style lang="scss">
.v-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  background-color: rgba(0, 0, 0, 0.6);
  transform: translate3d(0, 0, 0);

  &__wrapper {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    max-width: var(--container-w);
    margin: 0 auto;
  }
}
</style>
