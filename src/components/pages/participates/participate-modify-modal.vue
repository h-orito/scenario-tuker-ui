<template>
  <Modal
    v-model:show="isShow"
    header="通過したシナリオ編集"
    class="text-sm"
    submit-button-name="更新する"
    :submit-disabled="!canSubmit"
    close-button-name="キャンセル"
    @submit="save"
    @close="closeModal"
  >
    <div v-if="participate">
      <div class="field mb-4">
        <div>
          <label for="scenario-name">シナリオ</label>
        </div>
        <p>
          <strong>{{ participate.scenario.name }}</strong>
        </p>
      </div>
      <div class="grid mb-4">
        <div class="col-12">
          <label for="scenario-name">役割</label>
        </div>
        <div
          v-for="(role, idx) in roleTypeCandidates"
          :key="role.label"
          class="col-4 sm:col-3 lg:col-2"
        >
          <div class="field-checkbox">
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
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { putParticipates } from '~/components/api/myself-api'
import { ScenarioType } from '~/@types/scenario-type'
import { AllMuderMysteryRoleType, AllTrpgRoleType } from '~/@types/role-type'

// props
interface Props {
  show: boolean
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
const participate: Ref<ParticipateResponse | null> = ref(null)
const roleTypes: Ref<Array<string>> = ref([])

// role type
const roleTypeCandidates = computed(() => {
  if (participate.value?.scenario?.type === ScenarioType.MurderMystery.value) {
    return AllMuderMysteryRoleType
  } else {
    return AllTrpgRoleType
  }
})

// init
const init = (target: ParticipateResponse) => {
  participate.value = target
  roleTypes.value = [...target.role_types]
}

// submit
const submitting = ref(false)
const canSubmit = computed(() => {
  return !submitting.value && roleTypes.value.length > 0
})
const save = async () => {
  submitting.value = true
  await putParticipates({
    id: participate.value.id,
    scenario_id: participate.value.scenario.id,
    role_types: roleTypes.value
  })
  emit('save')
  submitting.value = false
  closeModal()
}

defineExpose({
  init
})
</script>
