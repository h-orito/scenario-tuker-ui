<template>
  <div class="field mb-4">
    <div class="grid">
      <div class="col-12">
        <label class="field-label" for="scenario-name">感想</label>
      </div>
      <div class="col-12">
        <p>内容</p>
        <SpoilerSelectButton v-model:has-spoiler="hasSpoiler" />
      </div>
      <div class="col-12">
        <p>公開範囲</p>
        <DisclosureRangeSelectButton v-model:value="disclosureRange" />
      </div>
      <div class="col-12">
        <p>感想</p>
        <ImpressionTextarea
          v-model:value="impression"
          :has-error="hasImpressionError"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SpoilerSelectButton from './spoiler-select-button.vue'
import DisclosureRangeSelectButton from './disclosure-range-select-button.vue'
import ImpressionTextarea from './impression-textarea.vue'

// props
interface Props {
  hasSpoiler: boolean
  disclosureRange: string
  impression: string
  hasImpressionError: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:has-spoiler', value: boolean): boolean
  (e: 'update:disclosure-range', value: string): string
  (e: 'update:impression', value: string): string
}>()

// modal
const hasSpoiler = computed({
  get: () => props.hasSpoiler,
  set: (value: boolean) => emit('update:has-spoiler', value)
})
const disclosureRange = computed({
  get: () => props.disclosureRange,
  set: (value: string) => emit('update:disclosure-range', value)
})
const impression = computed({
  get: () => props.impression,
  set: (value: string) => emit('update:impression', value)
})
</script>
