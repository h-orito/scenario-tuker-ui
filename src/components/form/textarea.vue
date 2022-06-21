<template>
  <Textarea
    :id="id"
    v-model="value"
    :class="hasError && 'p-invalid'"
    :auto-resize="true"
  />
</template>

<script setup lang="ts">
interface Props {
  id?: string
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
</script>
