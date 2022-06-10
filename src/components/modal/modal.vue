<template>
  <Dialog
    v-model:visible="isShow"
    :header="header"
    :modal="true"
    :dismissable-mask="true"
    class="text-sm"
  >
    <slot />
    <template #footer>
      <div v-if="submitButtonName || closeButtonName" class="pt-4">
        <ButtonSecondary
          v-if="closeButtonName"
          :label="closeButtonName"
          @click="$emit('close')"
        />
        <ButtonPrimary
          v-if="submitButtonName"
          :label="submitButtonName"
          :disabled="submitDisabled"
          @click="$emit('submit')"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
  header?: string
  submitButtonName?: string
  submitDisabled?: boolean
  closeButtonName?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'submit'): void
  (e: 'close'): void
}>()

const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
</script>
