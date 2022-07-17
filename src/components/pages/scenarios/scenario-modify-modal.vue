<template>
  <Modal
    v-model:show="isShow"
    header="シナリオ編集"
    class="text-sm"
    submit-button-name="更新する"
    close-button-name="キャンセル"
    :submit-disabled="submitting"
    @submit="save"
    @close="closeModal"
  >
    <ScenarioName v-model:value="name" :has-error="v$.name.$error" />
    <ScenarioDictionaryNames
      v-model:value="dictionaryNames"
      :has-error="v$.dictionaryNames.$error"
    />
    <div class="field mb-4">
      <div>
        <label class="field-label">種別</label>
      </div>
      {{ scenarioTypeName }}
    </div>
    <ScenarioUrl v-model:value="url" :has-error="v$.url.$error" />
    <div v-if="isTrpg" class="field mb-4">
      <div>
        <label class="field-label" for="game-system">ゲームシステム</label>
      </div>
      <div>{{ gameSystemName }}</div>
    </div>
    <AuthorsSelect v-model:value="authors" />
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'
import { ScenarioType, AllScenarioType } from '~/@types/scenario-type'
import { isAvailableUrl } from '~/components/pages/scenarios/form/scenario-url-domain'
import { searchScenarios, putScenario } from '~/components/api/scenario-api'
import ScenarioName from '~/components/pages/scenarios/form/scenario-name.vue'
import ScenarioDictionaryNames from '~/components/pages/scenarios/form/scenario-dictionary-names.vue'
import ScenarioUrl from '~/components/pages/scenarios/form/scenario-url.vue'
import AuthorsSelect from '~/components/pages/authors/form/authors-select.vue'
const { withAsync } = helpers

// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'save', scenario: ScenarioResponse): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

// data
const id = ref(0)
const name = ref('')
const dictionaryNames = ref('')
const type: Ref<string> = ref(ScenarioType.MurderMystery.value)
const gameSystem: Ref<GameSystem | null> = ref(null)
const url = ref('')
const authors: Ref<Array<Author>> = ref([])

const gameSystemName = computed(() => gameSystem.value?.name || null)
const scenarioTypeName = computed(
  () => AllScenarioType.find((st) => st.value === type.value)?.label
)
const isTrpg = computed(() => type.value == ScenarioType.Trpg.value)

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255),
    asyncValidator: withAsync(async () => {
      const scenarios = await searchScenarios({
        name: name.value,
        game_system_id: gameSystem.value?.id || null,
        game_system_name: null,
        type: type.value,
        author_name: null
      })
      return scenarios.list.every((s) => {
        if (s.id === id.value) return true
        return s.name !== name.value
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
  },
  url: {
    domain: () => {
      if (url.value === '') return true
      return isAvailableUrl(url.value)
    }
  }
}

const v$ = useVuelidate(rules, {
  name,
  dictionaryNames,
  url
})

const init = (current: ScenarioResponse) => {
  id.value = current.id
  name.value = current.name
  dictionaryNames.value = current.dictionary_names.join('\n')
  type.value = current.type
  gameSystem.value = current.game_system
  url.value = current.url || ''
  authors.value = current.authors
}

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
  const saved = await putScenario({
    id: id.value,
    name: name.value,
    dictionary_names: [...new Set(dicNames)],
    type: type.value,
    game_system_id: gameSystem.value?.id || null,
    url: url.value,
    author_ids: authors.value.map((a) => a.id)
  } as Scenario)
  submitting.value = false
  v$.value.$reset()
  closeModal()
  emit('save', saved)
}

defineExpose({
  init
})
</script>
