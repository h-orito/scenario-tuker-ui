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
    <GameSystemDictionaryNames
      v-model:value="dictionaryNames"
      :has-error="v$.dictionaryNames.$error"
    />
  </Modal>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'
import {
  searchGameSystems,
  putGameSystem
} from '~/components/api/game-system-api'
import GameSystemName from './form/game-system-name.vue'
import GameSystemDictionaryNames from './form/game-system-dictionary-names.vue'
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
const dictionaryNames = ref('')

const init = (gameSystem: GameSystem) => {
  id.value = gameSystem.id
  name.value = gameSystem.name
  dictionaryNames.value = gameSystem.dictionary_names.join('\n')
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
      return gameSystems.list.every((g) => {
        if (g.id === id.value) return true
        return g.name !== name.value
      })
    }),
    $lazy: true
  },
  dictionaryNames: {
    len: () => {
      const names = dictionaryNames.value.trim()
      return (
        names.length === 0 ||
        names
          .replace('\r\n', '\n')
          .split('\n')
          .every((dn) => {
            const length = dn.length
            return 0 < length && length <= 255
          })
      )
    }
  }
}

const v$ = useVuelidate(rules, {
  name,
  dictionaryNames
})

const submitting = ref(false)
const save = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  submitting.value = true
  const dicNames = dictionaryNames.value
    .trim()
    .replace('\r\n', '\n')
    .split('\n')
    .filter((n) => n.length > 0)
  dicNames.unshift(name.value)
  const saved = await putGameSystem({
    id: id.value,
    name: name.value,
    dictionary_names: dicNames
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
