<template>
  <FileUpload
    :id="id"
    v-model="value"
    name="image[]"
    accept="image/*"
    :file-limit="1"
    :show-upload-button="false"
    :has-error="hasError"
    @select="select"
    @remove="remove"
  />
</template>

<script setup lang="ts">
interface Props {
  id?: string
  value: File | null
  hasError: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: File | null): File | null
}>()

const value = computed({
  get: () => props.value,
  set: (value: File | null) => emit('update:value', value)
})

const select = (event: any) => (value.value = event.files[0])
const remove = () => (value.value = null)
</script>
