<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="scenario-authors"
        >シナリオ製作者 <span class="text-red-500">*</span></label
      >
    </div>
    <div>
      <div class="p-inputgroup mx-auto w-20rem">
        <InputText :disabled="true" :placeholder="selecting" />
        <ButtonPrimary label="選択" @click="openMasterSelectModal" />
      </div>
    </div>
    <AuthorsSelectModal v-model:show="isShowSelectModel" @decide="decide" />
  </div>
</template>

<script setup lang="ts">
import AuthorsSelectModal from '~/components/pages/authors/authors-select-modal.vue'

interface Props {
  value: Array<Author>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: Array<Author>): Array<Author>
}>()

const value = computed({
  get: () => props.value,
  set: (value: Array<Author>) => emit('update:value', value)
})

const selecting = computed(() => {
  if (value.value.length <= 0) return '選択されていません'
  return value.value.map((a) => a.name).join('、')
})

const isShowSelectModel = ref(false)
const openMasterSelectModal = () => (isShowSelectModel.value = true)
const decide = (authors: Array<Author>) => {
  value.value = authors
}
</script>
