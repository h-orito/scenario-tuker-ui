<template>
  <InputText
    :id="id"
    v-model="value"
    type="text"
    class="p-inputtext-sm"
    :class="hasError && 'p-invalid'"
    :placeholder="placeholder"
  />
</template>

<script setup lang="ts">
interface Props {
  id?: string
  value: string
  hasError: boolean
  placeholder?: string
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
