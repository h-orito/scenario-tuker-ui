<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="required-hour">プレイ時間目安（h）</label>
    </div>
    <div>
      <FormIncrementalNumber
        id="required-hour"
        v-model:value="value"
        :has-error="hasError"
      />
    </div>
    <div v-if="hasError" class="p-error text-xs">
      1000時間までで入力してください。
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number | null
  hasError: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: number | null): number | null
}>()

const value = computed({
  get: () => props.value,
  set: (value: number | null) => emit('update:value', value)
})
</script>
