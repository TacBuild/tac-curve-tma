<script setup lang="ts">
import { MAX_SLIPPAGE_PERCENT_VALUE, MIN_SLIPPAGE_PERCENT_VALUE } from '~/utils/ton-utils'

const emits = defineEmits(['close'])

const { slippagePercent } = useSwap()

const customValue = ref([0.1, 0.5].includes(slippagePercent.value) ? 0.8 : slippagePercent.value)
const selectedOption: Ref<number | undefined> = ref(slippagePercent.value || DEFAULT_SLIPPAGE_PERCENT_VALUE)

const options = computed(() => [
  { id: 'st-1', label: '0.1 %', value: 0.1 },
  { id: 'st-5', label: '0.5 %', value: 0.5 },
  { id: 'st-custom', label: 'Custom, %', value: customValue.value },
])
const error = computed(() => {
  if ((Number(selectedOption.value) || 0) < MIN_SLIPPAGE_PERCENT_VALUE) {
    return 'Too low'
  }

  if ((Number(selectedOption.value) || 0) > MAX_SLIPPAGE_PERCENT_VALUE) {
    return 'Too high'
  }

  return undefined
})

const onSubmit = () => {
  slippagePercent.value = selectedOption.value
  nextTick(() => {
    emits('close')
  })
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <BaseModalWrapper @close="$emit('close')">
      <template #title>
        Slippage tolerance
      </template>
      <p class="p1 weight-600 mb-24">
        Max Slippage
      </p>
      <UiRadio
        v-model="selectedOption"
        class="mb-24"
        name="radios"
        :options="options"
      >
        <template #slot-st-custom="slotProps">
          <div style="flex-grow: 1">
            <UiInput
              v-model="customValue"
              :label="slotProps.option.label"
              step="0.1"
              autocomplete="off"
              inputmode="decimal"
              only-number
              :color="Boolean(error) ? 'warning' : ''"
              @input="selectedOption = $event.target.value"
              @focus="selectedOption = customValue"
            >
              <template
                v-if="Boolean(error)"
                #append
              >
                <div class="mt-24 flex-center c-orange mr-4">
                  <svg
                    width="18"
                    height="19"
                    viewBox="0 0 18 19"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    class="mr-4"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.47599 3.23699C8.14024 2.07107 9.85977 2.07107 10.524 3.23699L16.2781 13.3369C16.9237 14.47 16.0834 15.8625 14.7541 15.8625H3.24591C1.91659 15.8625 1.07633 14.47 1.7219 13.3369L7.47599 3.23699ZM9.74995 12.8625C9.74995 13.2768 9.41417 13.6125 8.99995 13.6125C8.58574 13.6125 8.24995 13.2768 8.24995 12.8625C8.24995 12.4483 8.58574 12.1125 8.99995 12.1125C9.41417 12.1125 9.74995 12.4483 9.74995 12.8625ZM9.56245 6.86255C9.56245 6.55189 9.31061 6.30005 8.99995 6.30005C8.68929 6.30005 8.43745 6.55189 8.43745 6.86255V10.6125C8.43745 10.9232 8.68929 11.175 8.99995 11.175C9.31061 11.175 9.56245 10.9232 9.56245 10.6125V6.86255Z"
                      fill="currentColor"
                    />
                  </svg>
                  {{ error }}
                </div>
              </template>
            </UiInput>
          </div>
        </template>
      </UiRadio>
      <template #bottom>
        <UiButton
          class="mb-4"
          type="submit"
          :disabled="Boolean(error)"
          wide
        >
          Save
        </UiButton>
        <UiButton
          type="button"
          wide
          color="secondary"
          @click="$emit('close')"
        >
          Discard
        </UiButton>
      </template>
    </BaseModalWrapper>
  </form>
</template>

<style scoped lang="scss">

</style>
