<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="scenario-type"
        >種別 <span class="text-red-500">*</span></label
      >
    </div>
    <SelectButton
      id="scenario-type"
      v-model="value"
      :options="candidates"
      option-label="label"
      option-value="value"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      種別はいずれかを選択してください。
    </div>
  </div>
</template>

<script setup lang="ts">
import { AllScenarioType } from '~/@types/scenario-type'

interface Props {
  value: string
  hasError: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: string): string
}>()

const value = computed({
  get: () => props.value,
  set: (value: string) => emit('update:value', value)
})

const candidates = ref(AllScenarioType)
</script>
