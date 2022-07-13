<template>
  <Modal
    v-model:show="isShow"
    header="通過したシナリオ編集"
    class="text-sm"
    submit-button-name="更新する"
    close-button-name="キャンセル"
    :submit-disabled="submitting"
    @submit="save"
    @close="closeModal"
  >
    <div v-if="participate">
      <div class="field mb-4">
        <div>
          <label class="field-label" for="scenario-name">シナリオ</label>
        </div>
        <p>{{ participate.scenario.name }}</p>
      </div>
      <RuleBooksSelect
        v-if="type.value === ScenarioType.Trpg.value"
        v-model:value="ruleBooks"
        :has-error="v$.ruleBooks.$error"
        :game-system-id="scenarioGameSystemId"
      />
      <RoleTypeCheckbox
        v-if="type"
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
import { putParticipates } from '~/components/api/myself-api'
import { AllScenarioType, ScenarioType } from '~/@types/scenario-type'
import { DisclosureRange } from '~/@types/disclosure-range'
import RuleBooksSelect from '~/components/pages/rule-books/form/rule-book-select.vue'
import RoleTypeCheckbox from './form/role-type-checkbox.vue'
import Impression from './form/impression.vue'

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
const participate: Ref<ParticipateResponse | null> = ref(null)
const ruleBooks: Ref<Array<RuleBook>> = ref([])
const roleTypes: Ref<Array<string>> = ref([])
const hasSpoiler: Ref<boolean> = ref(true)
const disclosureRange: Ref<string> = ref(DisclosureRange.Everyone.value)
const impression: Ref<string> = ref('')

const scenarioGameSystemId = computed(
  () => participate.value?.scenario?.game_system?.id || null
)
const type = computed(() => {
  return AllScenarioType.find(
    (st) => st.value === participate.value?.scenario.type
  )
})

// init
const init = (target: ParticipateResponse) => {
  participate.value = target
  ruleBooks.value = [...target.rule_books]
  roleTypes.value = [...target.role_types]
  hasSpoiler.value = target.impression?.has_spoiler || true
  disclosureRange.value =
    target.impression?.disclosure_range || DisclosureRange.Everyone.value

  impression.value = target.impression?.content || ''
}

// validation
const rules = {
  ruleBooks: {
    trpg: () => {
      props.type.value === ScenarioType.MurderMystery.value ||
        ruleBooks.value.length > 0
    }
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
  ruleBooks,
  roleTypes,
  impression
})

// submit
const submitting = ref(false)
const save = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  submitting.value = true
  await putParticipates({
    id: participate.value?.id,
    scenario_id: participate.value?.scenario.id || 0,
    rule_book_ids: ruleBooks.value.map((r) => r.id),
    role_types: roleTypes.value,
    impression: {
      has_spoiler: hasSpoiler.value,
      disclosure_range: disclosureRange.value,
      content: impression.value
    }
  })
  emit('save')
  submitting.value = false
  closeModal()
}

defineExpose({
  init
})
</script>
