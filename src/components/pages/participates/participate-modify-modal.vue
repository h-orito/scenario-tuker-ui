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
      <hr v-if="type.value === ScenarioType.Trpg.value" class="field-hr" />
      <RuleBooksSelect
        v-if="type.value === ScenarioType.Trpg.value"
        v-model:value="ruleBooks"
        :has-error="v$.ruleBooks.$error"
        :game-system-id="scenarioGameSystemId"
      />
      <hr class="field-hr" />
      <RoleNames
        v-if="type"
        v-model:role-names="roleNames"
        :type="type"
        :has-error="v$.roleNames.$error"
      />
      <hr class="field-hr" />
      <p>以下は任意項目です</p>
      <hr class="field-hr" />
      <LazyParticipateDatetime
        v-model:from="from"
        v-model:to="to"
        :has-error="false"
      />
      <LazyRequiredHour
        v-model:value="requiredHours"
        :has-error="v$.requiredHours.$error"
      />
      <hr class="field-hr" />
      <LazyPlayerNum
        v-model:value="playerNum"
        :has-error="v$.playerNum.$error"
      />
      <LazyFormTextField
        id="game-master"
        v-model:value="gameMaster"
        label="GM"
        :has-error="v$.gameMaster.$error"
        error-message="255字以内で入力してください"
      />
      <LazyFormTextField
        id="player-names"
        v-model:value="playerNames"
        label="参加PL"
        :has-error="v$.playerNames.$error"
        error-message="255字以内で入力してください"
      />
      <hr class="field-hr" />
      <LazyFormTextField
        id="memo"
        v-model:value="memo"
        label="ひとことメモ"
        :has-error="v$.memo.$error"
        error-message="255字以内で入力してください"
      />
      <p>注意: ネタバレ要素を含む内容は感想に記入してください</p>
      <hr class="field-hr" />
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
import { required, maxLength, maxValue } from '@vuelidate/validators'
import { putParticipates } from '~/components/api/myself-api'
import { AllScenarioType, ScenarioType } from '~/@types/scenario-type'
import { DisclosureRange } from '~/@types/disclosure-range'
import RuleBooksSelect from '~/components/pages/rule-books/form/rule-books-select.vue'
import RoleNames from './form/role-names.vue'
import Impression from './form/impression.vue'
import LazyParticipateDatetime from './form/participate-datetime.vue'
import LazyPlayerNum from './form/player-num.vue'
import LazyRequiredHour from './form/required-hour.vue'

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
const roleNames: Ref<Array<string>> = ref([])
const hasSpoiler: Ref<boolean> = ref(true)
const disclosureRange: Ref<string> = ref(DisclosureRange.Everyone.value)
const impression: Ref<string> = ref('')
const from: Ref<Date | null> = ref(null)
const to: Ref<Date | null> = ref(null)
const playerNum: Ref<number | null> = ref(null)
const gameMaster: Ref<string> = ref('')
const playerNames: Ref<string> = ref('')
const requiredHours: Ref<number | null> = ref(null)
const memo: Ref<string> = ref('')

const scenarioGameSystemId = computed(
  () => participate.value?.scenario?.game_system?.id || null
)
const type = computed(() => {
  return AllScenarioType.find(
    (st) => st.value === participate.value?.scenario.type
  )
})

// init
const { $dayjs } = useNuxtApp()
const init = (target: ParticipateResponse) => {
  participate.value = target
  ruleBooks.value = [...target.rule_books]
  roleNames.value = [...target.role_names]
  hasSpoiler.value = target.impression?.has_spoiler ?? true
  disclosureRange.value =
    target.impression?.disclosure_range || DisclosureRange.Everyone.value
  impression.value = target.impression?.content || ''
  from.value = target.term?.from ? $dayjs(target.term.from).toDate() : null
  to.value = target.term?.to ? $dayjs(target.term.to).toDate() : null
  playerNum.value = target.player_num
  gameMaster.value = target.game_master || ''
  playerNames.value = target.player_names || ''
  requiredHours.value = target.required_hours
  memo.value = target.memo || ''
}

// validation
const rules = {
  ruleBooks: {
    trpg: () => {
      return (
        props.type.value === ScenarioType.MurderMystery.value ||
        ruleBooks.value.length > 0
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
  },
  playerNum: {
    maxValue: maxValue(100)
  },
  gameMaster: {
    maxLength: maxLength(255)
  },
  playerNames: {
    maxLength: maxLength(255)
  },
  requiredHours: {
    maxValue: maxValue(1000)
  },
  memo: {
    maxLength: maxLength(255)
  }
}

const v$ = useVuelidate(rules, {
  ruleBooks,
  roleNames,
  impression,
  playerNum,
  gameMaster,
  playerNames,
  requiredHours,
  memo
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
    role_names: roleNames.value,
    impression: {
      has_spoiler: hasSpoiler.value,
      disclosure_range: disclosureRange.value,
      content: impression.value
    },
    disp_order: participate.value?.disp_order,
    term_from: from.value ? $dayjs(from.value).format('YYYY-MM-DD') : null,
    term_to: to.value ? $dayjs(to.value).format('YYYY-MM-DD') : null,
    player_num: playerNum.value,
    game_master: gameMaster.value,
    player_names: playerNames.value,
    required_hours: requiredHours.value,
    memo: memo.value
  })
  emit('save')
  submitting.value = false
  closeModal()
}

defineExpose({
  init
})
</script>
