<script setup lang="ts">
import { useModal } from './composables/useModal'

const { list } = useModal()
</script>

<template>
  <div
    v-if="list.length"
    class="v-modals"
  >
    <TransitionGroup
      name="modal"
    >
      <UiModal
        v-for="modal in list"
        v-show="modal"
        :id="modal.id"
        :key="modal.id"
        :component="modal.component"
        :data="modal.data"
      />
    </TransitionGroup>
  </div>
</template>
