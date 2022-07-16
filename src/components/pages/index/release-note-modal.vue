<template>
  <Modal
    v-model:show="isShow"
    header="更新履歴"
    class="text-sm"
    close-button-name="閉じる"
    @close="closeModal"
  >
    <div class="text-left text-xs md:text-sm">
      <ul>
        <li>2022/07/17 個別ページから編集できるように変更</li>
        <li>2022/07/16 一般公開</li>
      </ul>
    </div>
  </Modal>
</template>

<script setup lang="ts">
// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)
</script>
