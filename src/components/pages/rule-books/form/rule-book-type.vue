<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="rule-book-type">種別</label>
    </div>
    <SelectButton
      id="rule-book-type"
      v-model="value"
      :options="candidates"
      option-label="label"
      option-value="value"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      種別はいずれかを選択してください。
    </div>
  </div>
</template>

<script setup lang="ts">
import { AllRuleBookType } from '~/@types/rule-book-type'

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

const candidates = ref(AllRuleBookType)
</script>
