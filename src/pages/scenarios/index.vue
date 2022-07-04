<template>
  <div>
    <Title>Scenario Tuker | シナリオ一覧</Title>
    <h1>シナリオ一覧</h1>
    <DataTable
      :value="scenarioItems"
      :scrollable="true"
      class="p-datatable-sm text-xs sm:text-sm"
    >
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <NuxtLink to="/scenarios/create">
            <ButtonPrimary label="追加" icon="plus" />
          </NuxtLink>
        </div>
      </template>
      <Column field="name" header="シナリオ名"></Column>
      <Column field="type" header="種別"></Column>
      <Column field="ruleBook" header="ルールブック"></Column>
      <template #empty>シナリオが登録されていません。</template>
    </DataTable>
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchScenarios } from '~/components/api/scenario-api'
import { AllScenarioType } from '~/@types/scenario-type'

const scenarios: ScenariosResponse = await fetchScenarios()
const scenarioItems = computed(() => {
  return scenarios.list.map((s) => ({
    name: s.name,
    type: AllScenarioType.find((st) => st.value === s.type)?.label,
    ruleBook: s.rule_book?.name
  }))
})

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
</script>
