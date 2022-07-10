<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="rule-book-dictionary-names"
        >ルールブック検索用ワード（改行区切り）</label
      >
    </div>
    <FormTextarea
      id="rule-book-dictionary-names"
      v-model:value="value"
      class="w-20rem h-15rem"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      ルールブック検索用ワードは各行255字以内で入力してください。
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
