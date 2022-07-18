<template>
  <Modal v-model:show="isShow" header="ルールブック削除" class="text-sm">
    <p>
      ルールブック
      <strong>{{ name }}</strong> を削除しますか？
    </p>
    <div class="mt-5">
      <label class="field-label" for="game-system-name">削除</label>
    </div>
    <p>
      参加記録やユーザー所有ルールブックと紐付いていない場合のみ削除可能です。
    </p>
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
      <label class="field-label" for="game-system-name"
        >別ルールブックに統合</label
      >
    </div>
    <p>
      このルールブックを削除し、以下の内容を指定したルールブックに付け替えます。
    </p>
    <div class="text-left">
      <ul>
        <li>検索用キーワード</li>
        <li>このルールブックの参加記録</li>
        <li>ユーザー所有ルールブック</li>
      </ul>
    </div>
    <RuleBookSelect
      v-model:value="ruleBook"
      :has-error="false"
      :game-system-id="gameSystemId"
    />
    <div>
      <ButtonDanger
        class="ml-1"
        icon="trash"
        label="削除して統合"
        :disabled="submitting || !ruleBook"
        @click="integrate"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import {
  deleteRuleBook,
  deleteRuleBookCheck,
  integrateDeleteRuleBook
} from '~/components/api/rule-book-api'
import RuleBookSelect from '~/components/pages/rule-books/form/rule-book-select.vue'

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
const gameSystemId = ref(0)
const ruleBook: Ref<RuleBookResponse | null> = ref(null)

const init = (target: RuleBookResponse) => {
  id.value = target.id
  name.value = target.name
  gameSystemId.value = target.game_system.id
  ruleBook.value = null
  deleteErrorMessage.value = ''
}

const submitting = ref(false)
const deleteErrorMessage = ref('')
const del = async () => {
  submitting.value = true
  const check = await deleteRuleBookCheck(id.value)
  if (!check.ok) {
    deleteErrorMessage.value = check.message || ''
    submitting.value = false
    return
  }
  await deleteRuleBook(id.value)
  submitting.value = false
  emit('save')
  closeModal()
}

const integrateErrorMessage = ref('')
const integrate = async () => {
  submitting.value = true
  try {
    await integrateDeleteRuleBook(id.value, ruleBook.value!.id)
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
