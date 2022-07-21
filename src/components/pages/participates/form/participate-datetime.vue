<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="scenario-name">日程</label>
    </div>
    <div>
      <Calendar
        v-model="from"
        class="w-10rem"
        autocomplete="off"
        :touch-u-i="true"
        :manual-input="false"
        date-format="yy/mm/dd"
      />
      ～
      <Calendar
        v-model="to"
        class="w-10rem"
        autocomplete="off"
        :touch-u-i="true"
        :manual-input="false"
        date-format="yy/mm/dd"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// props
interface Props {
  from: Date | null
  to: Date | null
  hasError: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:from', value: Date | undefined): Date | null
  (e: 'update:to', value: Date | undefined): Date | null
}>()

// modal
const from = computed({
  get: () => props.from || undefined,
  set: (value: Date | undefined) => emit('update:from', value)
})
const to = computed({
  get: () => props.to || undefined,
  set: (value: Date | undefined) => emit('update:to', value)
})
</script>
