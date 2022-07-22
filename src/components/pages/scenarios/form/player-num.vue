<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="player-num-min">PL人数</label>
    </div>
    <div>
      <FormIncrementalNumber
        id="player-num-min"
        v-model:value="min"
        :has-error="hasError"
      />
      ～
      <FormIncrementalNumber
        id="player-num-max"
        v-model:value="max"
        :has-error="hasError"
      />
    </div>
    <div v-if="hasError" class="p-error text-xs">
      PL人数はそれぞれ100名までで入力してください。
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  min: number | null
  max: number | null
  hasError: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:min', value: number | null): number | null
  (e: 'update:max', value: number | null): number | null
}>()

const min = computed({
  get: () => props.min,
  set: (value: number | null) => emit('update:min', value)
})
const max = computed({
  get: () => props.max,
  set: (value: number | null) => emit('update:max', value)
})
</script>
