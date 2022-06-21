<template>
  <div class="field mb-4">
    <div>
      <label for="scenario-dictionary-names"
        >シナリオ検索用ワード（改行区切り）</label
      >
    </div>
    <FormTextarea
      id="scenario-dictionary-names"
      v-model:value="value"
      class="w-20rem h-15rem"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      シナリオ検索用ワードは各行255字以内で入力してください。
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
