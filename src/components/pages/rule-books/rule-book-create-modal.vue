<template>
  <Modal
    v-model:show="isShow"
    header="ルールブック登録"
    class="text-sm"
    submit-button-name="登録する"
    close-button-name="キャンセル"
    :submit-disabled="submitting"
    @submit="save"
    @close="closeModal"
  >
    <RuleBookName v-model:value="name" :has-error="v$.name.$error" />
    <RuleBookDictionaryNames
      v-model:value="dictionaryNames"
      :has-error="v$.dictionaryNames.$error"
    />
    <GameSystemSelect
      v-model:value="gameSystem"
      :has-error="v$.gameSystem.$error"
    />
    <RuleBookTypeSelect v-model:value="type" :has-error="false" />
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'
import { searchRuleBooks, postRuleBook } from '~/components/api/rule-book-api'
import { RuleBookType } from '~/@types/rule-book-type'
import RuleBookName from '~/components/pages/rule-books/form/rule-book-name.vue'
import GameSystemSelect from '~/components/pages/game-systems/form/game-system-select.vue'
import RuleBookTypeSelect from '~/components/pages/rule-books/form/rule-book-type.vue'
import RuleBookDictionaryNames from '~/components/pages/rule-books/form/rule-book-dictionary-names.vue'
const { withAsync } = helpers

// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'save', ruleBook: RuleBookResponse): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

const name = ref('')
const dictionaryNames = ref('')
const type = ref(RuleBookType.Base.value)
const gameSystem: Ref<GameSystem | null> = ref(null)

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255),
    asyncValidator: withAsync(async () => {
      const ruleBooks = await searchRuleBooks({
        name: name.value,
        game_system_id: gameSystem.value?.id || null,
        game_system_name: null,
        rule_book_type: type.value
      })
      return ruleBooks.list.every((s) => s.name !== name.value)
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
  },
  gameSystem: {
    required
  }
}

const v$ = useVuelidate(rules, {
  name,
  dictionaryNames,
  gameSystem
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
  const saved = await postRuleBook({
    name: name.value,
    dictionary_names: [...new Set(dicNames)],
    game_system_id: gameSystem.value?.id,
    type: type.value
  } as RuleBook)
  submitting.value = false
  name.value = ''
  closeModal()
  emit('save', saved)
}
</script>
