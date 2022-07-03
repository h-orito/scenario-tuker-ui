<template>
  <FormTextarea
    id="impression"
    v-model:value="value"
    class="w-full"
    :has-error="hasError"
    :auto-resize="true"
    placeholder="感想を1万字以内で記入できます。"
  />
  <div :class="over ? 'p-error' : ''">{{ counter }}</div>
  <div v-if="hasError" class="p-error text-xs">
    感想は10000文字以内で入力してください。
  </div>
</template>

<script setup lang="ts">
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

const counter = computed(() => {
  const count = value.value.length
  return `${count} / 10000`
})
const over = computed(() => value.value.length > 10000)
</script>
