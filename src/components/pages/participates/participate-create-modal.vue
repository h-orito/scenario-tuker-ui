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
        :type="type"
        :has-error="v$.scenario.$error"
      />
      <RuleBooksSelect
        v-if="type.value === ScenarioType.Trpg.value"
        v-model:value="ruleBooks"
        :has-error="v$.ruleBooks.$error"
        :game-system-id="scenarioGameSystemId"
      />
      <RoleNames
        v-model:role-names="roleNames"
        :type="type"
        :has-error="v$.roleNames.$error"
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
import ScenarioSelect from '~/components/pages/scenarios/form/scenario-select.vue'
import RuleBooksSelect from '~/components/pages/rule-books/form/rule-books-select.vue'
import RoleNames from './form/role-names.vue'
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
const scenario: Ref<Scenario | null> = ref(null)
const ruleBooks: Ref<Array<RuleBook>> = ref([])
const roleNames: Ref<Array<string>> = ref([])
const hasSpoiler: Ref<boolean> = ref(true)
const disclosureRange: Ref<string> = ref(DisclosureRange.Everyone.value)
const impression: Ref<string> = ref('')

const scenarioGameSystemId = computed(
  () => scenario.value?.game_system_id || null
)

// validation
const rules = {
  scenario: {
    required
  },
  ruleBooks: {
    trpg: () => {
      if (props.type.value === ScenarioType.MurderMystery.value) return true
      if (!scenario.value) return true
      return ruleBooks.value.every(
        (r) => r.game_system_id === scenario.value?.game_system_id
      )
    }
  },
  roleNames: {
    required,
    notEmpty: () => roleNames.value.length > 0,
    length: () => {
      return roleNames.value.every((rn) => 0 < rn.length && rn.length <= 50)
    }
  },
  impression: {
    maxLength: maxLength(10000)
  }
}

const v$ = useVuelidate(rules, {
  scenario,
  ruleBooks,
  roleNames,
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
    rule_book_ids: ruleBooks.value.map((r) => r.id),
    role_names: roleNames.value,
    impression: {
      has_spoiler: hasSpoiler.value,
      disclosure_range: disclosureRange.value,
      content: impression.value
    }
  })
  emit('save')
  scenario.value = null
  ruleBooks.value = []
  roleNames.value = []
  hasSpoiler.value = true
  disclosureRange.value = DisclosureRange.Everyone.value
  impression.value = ''
  submitting.value = false
  v$.value.$reset()
  closeModal()
}
</script>
