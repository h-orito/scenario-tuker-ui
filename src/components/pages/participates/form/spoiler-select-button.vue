<template>
  <SelectButton
    v-model="selecting"
    option-label="label"
    :options="candidates"
  />
</template>

<script setup lang="ts">
interface Props {
  hasSpoiler: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:has-spoiler', value: boolean): boolean
}>()

const selecting = computed({
  get: () => candidates.find((c) => c.value == props.hasSpoiler)!,
  set: (option: OptionValue) => emit('update:has-spoiler', option.value)
})

type OptionValue = {
  label: string
  value: boolean
}

const candidates: Array<OptionValue> = [
  {
    label: 'ネタバレなし',
    value: false
  },
  {
    label: '未通過NG',
    value: true
  }
]
</script>
