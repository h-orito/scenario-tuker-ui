<template>
  <Modal
    v-model:show="isShow"
    header="シナリオ登録確認"
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
import { ScenarioType, AllScenarioType } from '~/@types/scenario-type'
import { postScenario } from '~/components/api/scenario-api'

// props
interface Props {
  show: boolean
  scenario: {
    name: string
    dictionaryNames: string
    type: string
    ruleBook: RuleBook | null
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
  const list = [
    {
      name: 'シナリオ名',
      value: props.scenario.name
    },
    {
      name: '検索用ワード',
      value: props.scenario.dictionaryNames
    },
    {
      name: '種別',
      value: AllScenarioType.find((st) => st.value === props.scenario.type)
        ?.label
    }
  ]
  if (props.scenario.type === ScenarioType.Trpg) {
    list.push({
      name: 'ルールブック',
      value: props.scenario.ruleBook?.name
    })
  }
  return list
})

const closeModal = () => (isShow.value = false)
const submitting = ref(false)
const save = async () => {
  submitting.value = true
  const dictionaryNames = props.scenario.dictionaryNames
    .trim()
    .replace('\r\n', '\n')
    .split('\n')
    .filter((n) => n.length > 0)
  dictionaryNames.unshift(props.scenario.name)
  await postScenario({
    name: props.scenario.name,
    dictionary_names: [...new Set(dictionaryNames)],
    type: props.scenario.type,
    rule_book_id: props.scenario.ruleBook?.id
  } as Scenario)

  useRouter().push({
    path: '/scenarios'
  })
}
</script>
