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
      <Column field="name" header="シナリオ名">
        <template #body="slotProps">
          {{ slotProps.data.name }}
          <span v-if="slotProps.data.url">
            &nbsp;
            <NuxtLink @click="confirmToMoveExternal(slotProps.data.url)">
              <i class="pi pi-external-link"></i>
            </NuxtLink>
          </span>
        </template>
      </Column>
      <Column field="type" header="種別"></Column>
      <Column field="ruleBook" header="ルールブック"></Column>
      <Column field="authors" header="製作者"></Column>
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
import { useConfirm } from 'primevue/useconfirm'

const scenarios: ScenariosResponse = await fetchScenarios()
const scenarioItems = computed(() => {
  return scenarios.list.map((s) => ({
    name: s.name,
    type: AllScenarioType.find((st) => st.value === s.type)?.label,
    ruleBook: s.rule_book?.name,
    url: s.url,
    authors: s.authors.map((a) => a.name).join('、')
  }))
})

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)

const confirm = useConfirm()
const confirmToMoveExternal = (url: string) => {
  confirm.require({
    message: `外部サイト（${url}）に遷移します。`,
    header: '外部サイト遷移確認',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      window.open(url)
    }
  })
}
</script>
