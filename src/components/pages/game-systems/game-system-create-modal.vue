<template>
  <Modal
    v-model:show="isShow"
    header="ゲームシステム登録"
    class="text-sm"
    submit-button-name="登録する"
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
  postGameSystem
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
  (e: 'save', gameSystem: GameSystem): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

const name = ref('')

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
  const saved = await postGameSystem({
    name: name.value
  } as GameSystem)
  submitting.value = true
  name.value = ''
  closeModal()
  emit('save', saved)
}
</script>
