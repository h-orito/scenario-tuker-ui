<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="scenario-name">シナリオ</label>
    </div>
    <AutoComplete
      v-model="scenario"
      :suggestions="filteredScenarios"
      :dropdown="true"
      field="name"
      force-selection
      @complete="search($event)"
    />
    <div v-if="hasError" class="col-12 p-error text-xs">
      シナリオを選択してください。
    </div>
    <p>
      見つからない場合はお手数ですが<br />シナリオを<NuxtLink
        to="/scenarios/create"
        target="_blank"
        >新規登録</NuxtLink
      >してください。
    </p>
  </div>
</template>

<script setup lang="ts">
import { searchScenarios } from '~/components/api/scenario-api'
import { ScenarioType } from '~/@types/scenario-type'

// props
interface Props {
  value: Scenario | null
  hasError: boolean
  type: ScenarioType
  allScenarios: ScenariosResponse
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:value', value: Scenario | null): Scenario | null
}>()

// modal
const scenario = computed({
  get: () => props.value,
  set: (value: Scenario | null) => emit('update:value', value)
})

// scenario
const allScenarios = computed(() => {
  return props.allScenarios.list.filter((s) => s.type === props.type.value)
})
const filteredScenarios = ref([...allScenarios.value])
const search = async ({ query }: { query: string }) => {
  if (!query.trim().length) {
    filteredScenarios.value = [...allScenarios.value]
  } else {
    const searched = await searchScenarios({
      name: query,
      type: props.type.value,
      rule_book_id: null
    })
    filteredScenarios.value = searched.list
  }
}
</script>
