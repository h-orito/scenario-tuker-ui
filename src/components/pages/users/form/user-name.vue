<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="user-name"
        >ユーザー名 <span class="text-red-500">*</span></label
      >
    </div>
    <p>他の方からユーザー名であなたを検索することができます。</p>
    <FormText
      id="user-name"
      v-model:value="value"
      class="w-20rem"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      ユーザー名は1~50字で入力してください。
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
