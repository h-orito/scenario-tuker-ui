<template>
  <Modal
    v-model:show="isShow"
    header="通過したシナリオ一括登録"
    class="text-sm"
    submit-button-name="登録する"
    close-button-name="キャンセル"
    :submit-disabled="submitting"
    @submit="save"
    @close="closeModal"
  >
    <div>
      <p v-if="type.value === ScenarioType.Trpg.value" class="mb-4">
        同一ゲームシステムのシナリオを一括登録することができます。
      </p>
      <ScenariosSelect
        v-model:value="scenarios"
        :type="type"
        :has-error="v$.scenarios.$error"
        :same-game-system="true"
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
      <div class="field mb-4">
        <div>
          <label class="field-label" for="scenario-name">感想</label>
        </div>
        <p>
          一括追加では感想は登録できません。<br />
          追加後に個別に編集して感想を登録してください。
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { postParticipates } from '~/components/api/myself-api'
import { ScenarioType } from '~/@types/scenario-type'
import ScenariosSelect from '~/components/pages/scenarios/form/scenarios-select.vue'
import RoleNames from './form/role-names.vue'

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
const scenarios: Ref<Array<Scenario>> = ref([])
const ruleBooks: Ref<Array<RuleBook>> = ref([])
const roleNames: Ref<Array<string>> = ref([])

const scenarioGameSystemId = computed(() => {
  if (scenarios.value.length <= 0) return null
  return scenarios.value[0].game_system_id
})

// validation
const rules = {
  scenarios: {
    notEmpty: () => scenarios.value.length > 0,
    gameSystemId: () => {
      return scenarios.value.every(
        (s) => s.game_system_id === scenarioGameSystemId.value
      )
    }
  },
  ruleBooks: {
    trpg: () => {
      if (props.type.value === ScenarioType.MurderMystery.value) return true
      if (!scenarioGameSystemId.value) return true
      return ruleBooks.value.every(
        (r) => r.game_system_id === scenarioGameSystemId.value
      )
    }
  },
  roleNames: {
    required,
    notEmpty: () => roleNames.value.length > 0,
    length: () => {
      return roleNames.value.every((rn) => 0 < rn.length && rn.length <= 50)
    }
  }
}

const v$ = useVuelidate(rules, {
  scenarios,
  ruleBooks,
  roleNames
})

// submit
const submitting = ref(false)
const save = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  submitting.value = true
  for (let scenario of scenarios.value) {
    await postParticipates({
      scenario_id: scenario.id || 0,
      rule_book_ids: ruleBooks.value.map((r) => r.id),
      role_names: roleNames.value,
      impression: null
    })
  }
  emit('save')
  scenarios.value = []
  ruleBooks.value = []
  roleNames.value = []
  submitting.value = false
  v$.value.$reset()
  closeModal()
}
</script>
