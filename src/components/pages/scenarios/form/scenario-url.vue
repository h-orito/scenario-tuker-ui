<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="scenario-url">シナリオURL</label>
    </div>
    <FormText
      id="scenario-url"
      v-model:value="value"
      class="w-20rem"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      URLはBOOTH、TALTO、Pixiv、キャラクターシート倉庫、Twitterのみ許可されています。<br />
      それ以外で掲載したいものがある場合、管理人にご連絡ください。
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
