<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" :for="id"
        >{{ label }}<span v-if="required" class="text-red-500"> *</span></label
      >
    </div>
    <FormText
      :id="id"
      v-model:value="value"
      class="w-20rem"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  id: string
  label: string
  required?: boolean
  value: string
  hasError: boolean
  errorMessage: string
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
