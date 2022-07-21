<template>
  <InputNumber
    :id="id"
    v-model="value"
    type="text"
    class="p-inputtext-sm"
    :class="hasError ? 'p-invalid' : ''"
    :placeholder="placeholder"
  />
</template>

<script setup lang="ts">
interface Props {
  id?: string
  value: number | null
  hasError: boolean
  placeholder?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: number | null): number | null
}>()

const value = computed({
  get: () => props.value,
  set: (value: number | null) => emit('update:value', value)
})
</script>
