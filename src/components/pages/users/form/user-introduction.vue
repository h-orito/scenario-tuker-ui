<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="user-introduction">自己紹介</label>
    </div>
    <p>
      Markdown形式（
      <NuxtLink
        to="https://qiita.com/oreo/items/82183bfbaac69971917f"
        target="_blank"
        >参考</NuxtLink
      >）で入力できます。<br />
      （セキュリティ対策のため一部記法を制限しています）
    </p>
    <FormTextarea
      id="user-introduction"
      v-model:value="value"
      class="w-20rem h-15rem"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      自己紹介は10000字以内で入力してください。
    </div>
    <div class="mt-4">
      <label>プレビュー</label>
    </div>
    <div v-dompurify-html="markedIntroduction" class="introduction"></div>
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked'

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

const markedIntroduction = computed(() => {
  return marked(value.value)
})
</script>
