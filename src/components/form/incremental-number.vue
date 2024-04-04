<template>
  <InputNumber
    id="player-num"
    v-model="value"
    show-buttons
    button-layout="horizontal"
    decrement-button-class="p-button-primary"
    increment-button-class="p-button-primary"
    increment-button-icon="pi pi-plus"
    decrement-button-icon="pi pi-minus"
    input-class="text-right w-5rem"
    :class="hasError ? 'p-invalid' : ''"
    min="0"
  />
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
