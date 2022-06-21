<template>
  <Dropdown
    :id="id"
    v-model="value"
    :options="options"
    option-label="name"
    option-value="value"
    class="p-inputtext-sm"
    :class="hasError && 'p-invalid'"
  />
</template>

<script setup lang="ts">
interface Props {
  id?: string
  value: string
  options: Option[]
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
</script>
