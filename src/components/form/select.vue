<template>
  <Dropdown
    :id="id"
    v-model="value"
    :options="options"
    option-label="label"
    option-value="value"
    class="p-inputtext-sm"
    :class="hasError && 'p-invalid'"
    @change="$emit('change')"
  />
</template>

<script setup lang="ts">
interface Props {
  id?: string
  value: string
  options: LabelValue[]
  hasError: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: string): string
  (e: 'change'): void
}>()

const value = computed({
  get: () => props.value,
  set: (value: string) => emit('update:value', value)
})
</script>
