<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="game-system-name"
        >ゲームシステム名 <span class="text-red-500">*</span></label
      >
    </div>
    <FormText
      id="game-system-name"
      v-model:value="value"
      class="w-20rem"
      :has-error="hasError"
    />
    <div v-if="hasError" class="p-error text-xs">
      ゲームシステム名は1~255字で入力してください。<br />
      既に登録されているゲームシステム名も登録できません。
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
