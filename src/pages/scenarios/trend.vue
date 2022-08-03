<template>
  <div>
    <Title>Scenario Tuker | よく通過されているシナリオ</Title>
    <h1>人気の{{ typeLabel }}シナリオ</h1>
    <ScenariosTable
      :scenarios="scenarios.list"
      :show-participate-count="true"
    />
    <div class="mt-8">
      <NuxtLink to="/scenarios">
        <ButtonSecondary label="シナリオ一覧" />
      </NuxtLink>
    </div>
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { fetchPopularScenarios } from '~/components/api/scenario-api'
import ScenariosTable from '~/components/pages/scenarios/scenarios-table.vue'
import { AllScenarioType } from '~/@types/scenario-type'

const route = useRoute()
const queryType = route.query.type as string

const scenarios: Ref<ScenariosResponse> = ref({
  list: [],
  all_record_count: 0,
  all_page_count: 0,
  exist_pre_page: false,
  exist_next_page: false,
  current_page_num: 0
})

const type = ref('')
onMounted(async () => {
  if (queryType !== '') {
    type.value = queryType
  }
  scenarios.value = await fetchPopularScenarios(type.value)
})

const typeLabel = computed(
  () => AllScenarioType.find((st) => st.value === type.value)?.label
)

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | よく通過されているシナリオ`
    }
  ]
})
</script>
