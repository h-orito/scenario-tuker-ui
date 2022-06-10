<template>
  <Button
    :label="label"
    class="p-button-sm p-button-danger"
    :icon="iconClass"
    icon-pos="left"
  />
</template>

<script setup lang="ts">
interface Props {
  label: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  label: '',
  icon: undefined
})

const iconClass = computed(() => {
  if (!props.icon) return undefined
  return `pi pi-${props.icon}`
})
</script>
