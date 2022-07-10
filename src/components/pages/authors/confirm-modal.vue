<template>
  <Modal
    v-model:show="isShow"
    header="シナリオ製作者登録確認"
    class="text-sm"
    submit-button-name="登録する"
    :submit-disabled="submitting"
    close-button-name="キャンセル"
    @submit="save"
    @close="closeModal"
  >
    <div>
      <DataTable
        :value="items"
        striped-rows
        responsive-layout="scroll"
        class="text-sm"
      >
        <Column field="name" header="項目"></Column>
        <Column field="value" header="入力内容">
          <template #body="slotProps">
            <p style="white-space: pre-wrap">{{ slotProps.data.value }}</p>
          </template>
        </Column>
      </DataTable>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { postAuthor } from '~/components/api/author-api'

// props
interface Props {
  show: boolean
  author: {
    name: string
  }
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
}>()

const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})

const items = computed(() => {
  return [
    {
      name: 'シナリオ製作者名',
      value: props.author.name
    }
  ]
})

const closeModal = () => (isShow.value = false)
const submitting = ref(false)
const save = async () => {
  submitting.value = true
  await postAuthor({
    name: props.author.name
  } as Author)

  useRouter().push({
    path: '/authors'
  })
}
</script>
