<template>
  <Modal v-model:show="isShow" header="ゲームシステム削除" class="text-sm">
    <p>
      ゲームシステム
      <strong>{{ name }}</strong> を削除しますか？
    </p>
    <div class="mt-5">
      <label class="field-label" for="game-system-name">削除</label>
    </div>
    <p>シナリオやルールブックと紐付いていない場合のみ削除可能です。</p>
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
        >別ゲームシステムに統合</label
      >
    </div>
    <p>
      このゲームシステムを削除し、以下の内容を指定したゲームシステムに付け替えます。
    </p>
    <div class="text-left">
      <ul>
        <li>検索用キーワード</li>
        <li>このゲームシステムのシナリオ</li>
        <li>このゲームシステムのルールブック</li>
      </ul>
    </div>
    <GameSystemSelect v-model:value="gameSystem" :has-error="false" />
    <div>
      <ButtonDanger
        class="ml-1"
        icon="trash"
        label="削除して統合"
        :disabled="submitting || !gameSystem"
        @click="integrate"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import {
  deleteGameSystem,
  deleteGameSystemCheck,
  integrateDeleteGameSystem
} from '~/components/api/game-system-api'
import GameSystemSelect from '~/components/pages/game-systems/form/game-system-select.vue'

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
const gameSystem: Ref<GameSystem | null> = ref(null)

const init = (target: GameSystem) => {
  id.value = target.id
  name.value = target.name
  gameSystem.value = null
  deleteErrorMessage.value = ''
}

const submitting = ref(false)
const deleteErrorMessage = ref('')
const del = async () => {
  submitting.value = true
  const check = await deleteGameSystemCheck(id.value)
  if (!check.ok) {
    deleteErrorMessage.value = check.message || ''
    submitting.value = false
    return
  }
  await deleteGameSystem(id.value)
  submitting.value = false
  emit('save')
  closeModal()
}

const integrateErrorMessage = ref('')
const integrate = async () => {
  submitting.value = true
  try {
    await integrateDeleteGameSystem(id.value, gameSystem.value!.id)
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
