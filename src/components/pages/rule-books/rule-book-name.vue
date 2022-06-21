<template>
  <div class="field mb-4">
    <div>
      <label for="rule-book-name">ルールブック名</label>
    </div>
    <FormText
      id="rule-book-name"
      v-model:value="value"
      class="w-20rem"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      ルールブック名は1~255字で入力してください。
    </div>
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
</script>
