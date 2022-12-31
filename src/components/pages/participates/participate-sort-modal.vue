<template>
  <Modal
    v-model:show="isShow"
    header="通過したシナリオ並び替え"
    class="text-sm"
    submit-button-name="更新する"
    close-button-name="キャンセル"
    :submit-disabled="submitting"
    @submit="save"
    @close="closeModal"
  >
    <p>並び替えて「更新する」で保存することができます。</p>
    <div class="flex justify-content-end">
      <FormSelect
        v-model:value="sortSelectValue"
        :options="options"
        :has-error="false"
        @change="sort"
      />
    </div>
    <DataTable
      :value="tableParticipates"
      data-key="id"
      class="p-datatable-sm text-xs sm:text-sm"
      responsive-layout="scroll"
    >
      <template #empty>通過したシナリオが登録されていません。</template>
      <Column header="シナリオ" field="scenarioName" />
      <Column
        v-if="type == ScenarioType.Trpg"
        header="ゲームシステム"
        field="gameSystemName"
      />
      <Column header="役割" field="roleNames" />
      <Column header="日程" field="term" />
      <Column class="justify-content-end text-right">
        <template #body="slotProps">
          <ButtonPrimary
            icon="arrow-up"
            label=""
            @click="up(slotProps.index)"
          />
          <ButtonPrimary
            class="ml-1"
            icon="arrow-down"
            label=""
            @click="down(slotProps.index)"
          />
        </template>
      </Column>
    </DataTable>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { putParticipates } from '~/components/api/myself-api'
import { AllScenarioType, ScenarioType } from '~/@types/scenario-type'
import { ValidationError } from 'schema-utils'

// props
interface Props {
  show: boolean
  type: ScenarioType
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'save'): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

// data
const participates: Ref<Array<ParticipateResponse>> = ref([])
const orgParticipates: Ref<Array<ParticipateResponse>> = ref([])
const sortSelectValue = ref('')

// table
const tableParticipates = computed(() => {
  return participates.value.map((p) => ({
    id: p.id,
    scenarioName: p.scenario.name,
    scenarioType: p.scenario.type,
    gameSystemName: p.scenario.game_system?.name,
    roleNames: p.role_names.join('、'),
    term: term(p.term)
  }))
})

const term = (term: ParticipateTerm | null): string => {
  if (!term) return ''
  if (term.from === term.to) return `${term.from}`
  if (term.from == null) return `～ ${term.to}`
  if (term.to == null) return `${term.from} ～`
  return `${term.from} ～ ${term.to}`
}

// init
const { $dayjs } = useNuxtApp()
const init = (target: Array<ParticipateResponse>) => {
  participates.value = target
  orgParticipates.value = target
}

// reorder
const up = (idx: number) => {
  if (idx === 0) return
  const newArray = replaceArrayElements(participates.value, idx - 1, idx)
  participates.value = newArray
}

const down = (idx: number) => {
  if (idx === participates.value.length - 1) return
  participates.value = replaceArrayElements(participates.value, idx + 1, idx)
}

const replaceArrayElements = (
  array: Array<ParticipateResponse>,
  targetIndex: number,
  sourceIndex: number
) => {
  const cloneArray = [...array]
  return cloneArray.map((elm, idx) => {
    if (idx === targetIndex) return array[sourceIndex]
    if (idx === sourceIndex) return array[targetIndex]
    return elm
  })
}

const sort = () => {
  const value = sortSelectValue.value
  if (value === '') return
  const isAsc = value.endsWith('asc')

  participates.value = participates.value.sort(
    (p1: ParticipateResponse, p2: ParticipateResponse) => {
      if (value.startsWith('id')) {
        if (isAsc) return p1.id - p2.id
        else return p2.id - p1.id
      } else if (value.startsWith('scenario')) {
        if (isAsc) return p1.scenario.name.localeCompare(p2.scenario.name)
        else return p2.scenario.name.localeCompare(p1.scenario.name)
      } else if (value.startsWith('game_system')) {
        const system1 = p1.scenario.game_system!.name
        const system2 = p2.scenario.game_system!.name
        if (isAsc) return system1.localeCompare(system2)
        else return system2.localeCompare(system1)
      } else if (value.startsWith('role')) {
        const role1 = p1.role_names.join(',')
        const role2 = p2.role_names.join(',')
        if (isAsc) return role1.localeCompare(role2)
        else return role2.localeCompare(role1)
      } else if (value.startsWith('date')) {
        const date1 = p1.term?.from ?? p1.term?.to ?? '9999'
        const date2 = p2.term?.from ?? p2.term?.to ?? '9999'
        if (isAsc) return date1.localeCompare(date2)
        else return date2.localeCompare(date1)
      }

      return -1
    }
  )
}

// submit
const submitting = ref(false)
const save = async () => {
  submitting.value = true
  for (let i = 0; i < participates.value.length; i++) {
    const p = participates.value[i]
    if (p.disp_order === i + 1) continue
    await putParticipates({
      id: p.id,
      scenario_id: p.scenario.id,
      rule_book_ids: p.rule_books.map((rb) => rb.id),
      role_names: p.role_names,
      disp_order: i + 1,
      impression: p.impression,
      term_from: p.term?.from ?? null,
      term_to: p.term?.to ?? null,
      player_num: p.player_num,
      game_master: p.game_master,
      player_names: p.player_names,
      required_hours: p.required_hours,
      memo: p.memo
    })
  }
  orgParticipates.value = participates.value
  emit('save')
  submitting.value = false
  closeModal()
}

defineExpose({
  init
})

const options = computed(() => {
  const array = [
    {
      label: '一括並び替え',
      value: ''
    },
    {
      label: '登録日昇順',
      value: 'id_asc'
    },
    {
      label: '登録日降順',
      value: 'id_desc'
    },
    {
      label: 'シナリオ名昇順',
      value: 'scenario_asc'
    },
    {
      label: 'シナリオ名降順',
      value: 'scenario_desc'
    },
    {
      label: 'ゲームシステム名昇順',
      value: 'game_system_asc'
    },
    {
      label: 'ゲームシステム名降順',
      value: 'game_system_desc'
    },
    {
      label: '役割昇順',
      value: 'role_asc'
    },
    {
      label: '役割降順',
      value: 'role_desc'
    },
    {
      label: '日程昇順',
      value: 'date_asc'
    },
    {
      label: '日程降順',
      value: 'date_desc'
    }
  ]
  if (props.type.value !== ScenarioType.Trpg.value) {
    return array.filter((lb) => !lb.value.startsWith('game_system'))
  } else {
    return array
  }
})
</script>
