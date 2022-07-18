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
  postGameSystem
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
  (e: 'save', gameSystem: GameSystem): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

const name = ref('')
const dictionaryNames = ref('')

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
  const saved = await postGameSystem({
    name: name.value,
    dictionary_names: [...new Set(dicNames)]
  } as GameSystem)
  submitting.value = true
  name.value = ''
  dictionaryNames.value = ''
  v$.value.$reset()
  closeModal()
  emit('save', saved)
}
</script>
