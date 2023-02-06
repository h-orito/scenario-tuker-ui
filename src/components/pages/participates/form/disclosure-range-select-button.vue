<template>
  <SelectButton v-model="value" option-label="label" :options="candidates" />
  <p>{{ rangeMessage }}</p>
</template>

<script setup lang="ts">
import { AllDisclosureRange, DisclosureRange } from '~/@types/disclosure-range'
interface Props {
  value: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: string): string
}>()

const value = computed({
  get: () => candidates.find((c) => c.value === props.value)!,
  set: (option: LabelValue) => emit('update:value', option.value)
})

const candidates = AllDisclosureRange

const rangeMessage = computed(() => {
  switch (value.value.value) {
    case DisclosureRange.Everyone.value:
      return '誰でも: ログインしていない人を含め誰でも閲覧できます。'
    case DisclosureRange.OnlyMe.value:
      return '自分のみ: あなた以外は閲覧できません。'
  }
})
</script>
