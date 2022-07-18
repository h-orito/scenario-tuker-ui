<template>
  <Modal v-model:show="isShow" header="シナリオ削除" class="text-sm">
    <p>
      シナリオ
      <strong>{{ name }}</strong> を削除しますか？
    </p>
    <div class="mt-5">
      <label class="field-label" for="game-system-name">削除</label>
    </div>
    <p>参加記録やユーザー所有シナリオと紐付いていない場合のみ削除可能です。</p>
    <p v-if="deleteErrorMessage" class="p-error">{{ deleteErrorMessage }}</p>
    <div>
      <ButtonDanger
        class="ml-1"
        icon="trash"
        label="削除"
        :disabled="submitting || deleteErrorMessage !== ''"
        @click="del"
      />
    </div>
    <div class="mt-5">
      <label class="field-label" for="game-system-name">別シナリオに統合</label>
    </div>
    <p>このシナリオを削除し、以下の内容を指定したシナリオに付け替えます。</p>
    <div class="text-left">
      <ul>
        <li>検索用キーワード</li>
        <li>このシナリオの参加記録</li>
        <li>ユーザー所有シナリオ</li>
      </ul>
    </div>
    <ScenarioSelect
      v-model:value="scenario"
      :type="type"
      :has-error="false"
      :game-system-id="gameSystemId"
    />
    <div>
      <ButtonDanger
        class="ml-1"
        icon="trash"
        label="削除して統合"
        :disabled="submitting || !scenario"
        @click="integrate"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import {
  deleteScenario,
  deleteScenarioCheck,
  integrateDeleteScenario
} from '~/components/api/scenario-api'
import ScenarioSelect from '~/components/pages/scenarios/form/scenario-select.vue'
import { AllScenarioType, ScenarioType } from '~/@types/scenario-type'

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

const id = ref(0)
const name = ref('')
const type = ref(ScenarioType.MurderMystery)
const gameSystemId: Ref<number | null> = ref(null)
const scenario: Ref<Scenario | null> = ref(null)

const init = (target: ScenarioResponse) => {
  id.value = target.id
  name.value = target.name
  gameSystemId.value = target.game_system?.id || null
  type.value = AllScenarioType.find((st) => st.value === target.type)!
  scenario.value = null
  deleteErrorMessage.value = ''
}

const submitting = ref(false)
const deleteErrorMessage = ref('')
const del = async () => {
  submitting.value = true
  const check = await deleteScenarioCheck(id.value)
  if (!check.ok) {
    deleteErrorMessage.value = check.message || ''
    submitting.value = false
    return
  }
  await deleteScenario(id.value)
  submitting.value = false
  emit('save')
  closeModal()
}

const integrateErrorMessage = ref('')
const integrate = async () => {
  submitting.value = true
  try {
    await integrateDeleteScenario(id.value, scenario.value!.id)
    closeModal()
    emit('save')
  } catch (e) {
    integrateErrorMessage.value = '統合に失敗しました。'
  }
  submitting.value = false
  closeModal()
  emit('save')
}

defineExpose({
  init
})
</script>
