<template>
  <Modal
    v-model:show="isShow"
    header="通過したシナリオ登録"
    class="text-sm"
    submit-button-name="登録する"
    close-button-name="キャンセル"
    :submit-disabled="submitting"
    @submit="save"
    @close="closeModal"
  >
    <div>
      <ScenarioSelect
        v-model:value="scenario"
        :has-error="v$.scenario.$error"
        :type="type"
        :all-scenarios="allScenarios"
      />
      <RoleTypeCheckbox
        v-model:role-types="roleTypes"
        :type="type"
        :has-error="v$.roleTypes.$error"
      />
      <Impression
        v-model:has-spoiler="hasSpoiler"
        v-model:disclosure-range="disclosureRange"
        v-model:impression="impression"
        :has-impression-error="v$.impression.$error"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, maxLength } from '@vuelidate/validators'
import { postParticipates } from '~/components/api/myself-api'
import { ScenarioType } from '~/@types/scenario-type'
import { DisclosureRange } from '~/@types/disclosure-range'
import ScenarioSelect from './form/scenario-select.vue'
import RoleTypeCheckbox from './form/role-type-checkbox.vue'
import Impression from './form/impression.vue'

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
const hasSpoiler: Ref<boolean> = ref(true)
const disclosureRange: Ref<string> = ref(DisclosureRange.Everyone.value)
const impression: Ref<string> = ref('')

// validation
const rules = {
  scenario: {
    required
  },
  roleTypes: {
    required,
    notEmpty: () => roleTypes.value.length > 0
  },
  impression: {
    maxLength: maxLength(10000)
  }
}

const v$ = useVuelidate(rules, {
  scenario,
  roleTypes,
  impression
})

// submit
const submitting = ref(false)
const save = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return

  submitting.value = true
  await postParticipates({
    scenario_id: scenario.value?.id || 0,
    role_types: roleTypes.value,
    impression: {
      has_spoiler: hasSpoiler.value,
      disclosure_range: disclosureRange.value,
      content: impression.value
    }
  })
  emit('save')
  scenario.value = null
  roleTypes.value = []
  hasSpoiler.value = true
  disclosureRange.value = DisclosureRange.Everyone.value
  impression.value = ''
  submitting.value = false
  v$.value.$reset()
  closeModal()
}
</script>
