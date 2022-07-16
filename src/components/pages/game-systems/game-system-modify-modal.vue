<template>
  <Modal
    v-model:show="isShow"
    header="ゲームシステム編集"
    class="text-sm"
    submit-button-name="更新する"
    close-button-name="キャンセル"
    :submit-disabled="submitting"
    @submit="save"
    @close="closeModal"
  >
    <GameSystemName v-model:value="name" :has-error="v$.name.$error" />
  </Modal>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'
import {
  searchGameSystems,
  putGameSystem
} from '~/components/api/game-system-api'
import GameSystemName from '~/components/pages/game-systems/form/game-system-name.vue'
const { withAsync } = helpers

// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'modify', gameSystem: GameSystem): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

const id = ref(0)
const name = ref('')

const init = (gameSystem: GameSystem) => {
  id.value = gameSystem.id
  name.value = gameSystem.name
}

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255),
    asyncValidator: withAsync(async () => {
      const gameSystems = await searchGameSystems({
        name: name.value
      })
      return gameSystems.list.every((s) => s.name !== name.value)
    }),
    $lazy: true
  }
}

const v$ = useVuelidate(rules, {
  name
})

const submitting = ref(false)
const save = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  submitting.value = true
  const saved = await putGameSystem({
    id: id.value,
    name: name.value
  } as GameSystem)
  submitting.value = false
  v$.value.$reset()
  closeModal()
  emit('modify', saved)
}

defineExpose({
  init
})
</script>
