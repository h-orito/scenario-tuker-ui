<template>
  <SelectButton v-model="value" option-label="label" :options="candidates" />
</template>

<script setup lang="ts">
import { AllDisclosureRange } from '~/@types/disclosure-range'
interface Props {
  value: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: string): string
}>()

const value = computed({
  get: () => candidates.find((c) => c.value === props.value)!,
  set: (option: LabelValue) => emit('update:value', option.value)
})

const candidates = AllDisclosureRange
</script>
