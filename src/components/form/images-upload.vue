<template>
  <FileUpload
    :id="id"
    v-model="value"
    name="images[]"
    accept="image/*"
    :show-upload-button="false"
    :has-error="hasError"
    :multiple="true"
    @select="select"
    @remove="remove"
  />
</template>

<script setup lang="ts">
interface Props {
  id?: string
  value: Array<File>
  hasError: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: Array<File>): Array<File>
}>()

const value = computed({
  get: () => props.value,
  set: (value: Array<File>) => emit('update:value', value)
})

const select = (event: any) => (value.value = event.files)
const remove = () => (value.value = [])
</script>
