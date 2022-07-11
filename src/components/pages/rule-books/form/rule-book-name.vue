<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="rule-book-name"
        >ルールブック名 <span class="text-red-500">*</span></label
      >
    </div>
    <FormText
      id="rule-book-name"
      v-model:value="value"
      class="w-20rem"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      ルールブック名は1~255字で入力してください。<br />
      既に登録されているルールブック名も登録できません。
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
