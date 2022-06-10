<template>
  <Button
    :label="label"
    class="p-button-sm"
    :icon="iconClass"
    :disabled="disabled"
    icon-pos="left"
  />
</template>

<script setup lang="ts">
interface Props {
  label: string
  icon?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  icon: undefined,
  disabled: undefined
})

const iconClass = computed(() => {
  if (!props.icon) return undefined
  return `pi pi-${props.icon}`
})
</script>
