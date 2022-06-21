<template>
  <Modal
    v-model:show="isShow"
    header="ルールブック登録確認"
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
import { postRuleBook } from '~/components/api/rule-book-api'

// props
interface Props {
  show: boolean
  ruleBook: {
    name: string
    dictionaryNames: string
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
      name: 'ルールブック名',
      value: props.ruleBook.name
    },
    {
      name: '検索用ワード',
      value: props.ruleBook.dictionaryNames
    }
  ]
})

const closeModal = () => (isShow.value = false)
const submitting = ref(false)
const save = async () => {
  submitting.value = true
  const dictionaryNames = props.ruleBook.dictionaryNames
    .trim()
    .replace('\r\n', '\n')
    .split('\n')
    .filter((n) => n.length > 0)
  dictionaryNames.unshift(props.ruleBook.name)
  await postRuleBook({
    name: props.ruleBook.name,
    dictionary_names: [...new Set(dictionaryNames)]
  } as RuleBook)

  useRouter().push({
    path: '/rule-books'
  })
}
</script>
