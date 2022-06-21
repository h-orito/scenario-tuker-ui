<template>
  <Modal
    v-model:show="isShow"
    header="通過したシナリオ登録"
    class="text-sm"
    submit-button-name="登録する"
    :submit-disabled="!canSubmit"
    close-button-name="キャンセル"
    @submit="save"
    @close="closeModal"
  >
    <div>
      <div class="field mb-4">
        <div>
          <label for="scenario-name">シナリオ</label>
        </div>
        <AutoComplete
          v-model="scenario"
          :suggestions="filteredScenarios"
          :dropdown="true"
          field="name"
          force-selection
          @complete="search($event)"
        />
        <p>
          見つからない場合はお手数ですが<br />シナリオを<NuxtLink
            to="/scenarios/create"
            target="_blank"
            >新規登録</NuxtLink
          >してください。
        </p>
      </div>
      <div class="field mb-4">
        <div>
          <label for="scenario-name">役割</label>
        </div>
        <div
          v-for="(role, idx) in roleTypeCandidates"
          :key="role.label"
          class="field-checkbox"
        >
          <Checkbox
            :id="`role-type${idx}`"
            v-model="roleTypes"
            name="role"
            :value="role.value"
          />
          <label :for="`role-type${idx}`">{{ role.label }}</label>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { postParticipates } from '~/components/api/myself-api'
import { searchScenarios } from '~/components/api/scenario-api'
import { ScenarioType } from '~/@types/scenario-type'
import { AllMuderMysteryRoleType, AllTrpgRoleType } from '~/@types/role-type'

// props
interface Props {
  show: boolean
  type: ScenarioType
  allScenarios: ScenariosResponse
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
const scenario: Ref<Scenario | null> = ref(null)
const roleTypes: Ref<Array<string>> = ref([])

// scenario
const allScenarios = computed(() => {
  return props.allScenarios.list.filter((s) => s.type === props.type.value)
})
const filteredScenarios = ref([...allScenarios.value])
const search = async (event) => {
  if (!event.query.trim().length) {
    filteredScenarios.value = [...allScenarios.value]
  } else {
    const searched = await searchScenarios({
      name: event.query,
      type: props.type.value
    })
    filteredScenarios.value = searched.list
  }
}

// role type
const roleTypeCandidates = computed(() => {
  if (props.type.value === ScenarioType.MurderMystery.value) {
    return AllMuderMysteryRoleType
  } else {
    return AllTrpgRoleType
  }
})

// submit
const submitting = ref(false)
const canSubmit = computed(() => {
  return !submitting.value && !!scenario.value && roleTypes.value.length > 0
})
const save = async () => {
  submitting.value = true
  await postParticipates({
    scenario_id: scenario.value.id,
    role_types: roleTypes.value
  })
  emit('save')
  scenario.value = null
  roleTypes.value = []
  submitting.value = false
  closeModal()
}
</script>
