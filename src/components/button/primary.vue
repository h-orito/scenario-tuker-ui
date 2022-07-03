<template>
  <Button
    :label="label"
    class="p-button-sm"
    :class="props.outlined ? ' p-button-outlined' : ''"
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
  outlined?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  icon: undefined,
  disabled: undefined,
  outlined: false
})

const iconClass = computed(() => {
  if (!props.icon) return undefined
  return `pi pi-${props.icon}`
})
</script>
