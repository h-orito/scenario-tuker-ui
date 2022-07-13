<template>
  <div>
    <div v-if="scenario">
      <Title>Scenario Tuker | シナリオ情報 | {{ scenario.name }}</Title>
      <h1>
        {{ scenario.name }}
        <span v-if="scenario.url">
          &nbsp;
          <NuxtLink @click="confirmToMoveExternal()">
            <i class="pi pi-external-link"></i>
          </NuxtLink>
        </span>
      </h1>
      <p>{{ scenarioType }}</p>
      <div>
        <h2>{{ scenario.name }} の通過記録</h2>
        <ParticipateTable
          ref="participatesTable"
          :type="ScenarioType.Trpg"
          :can-modify="false"
          @reload="() => {}"
        />
      </div>
    </div>
    <div v-else>
      <Title>Scenario Tuker | シナリオ情報</Title>
      存在しないシナリオです。
    </div>
    <div class="mt-4">
      <NuxtLink to="/scenarios">
        <ButtonSecondary label="シナリオ一覧" />
      </NuxtLink>
    </div>
    <div class="mt-2">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import {
  fetchScenario,
  fetchScenarioParticipates
} from '~/components/api/scenario-api'
import ParticipateTable from '~/components/pages/participates/participate-table.vue'
import { ScenarioType, AllScenarioType } from '~/@types/scenario-type'

const route = useRoute()
const participatesTable = ref()
const scenarioId = parseInt(route.params.id as string)
const scenario: Ref<ScenarioResponse | null> = ref(
  await fetchScenario(scenarioId)
)
const scenarioType = computed(
  () => AllScenarioType.find((st) => st.value === scenario.value?.type)?.label
)
const participates = await fetchScenarioParticipates(scenarioId)

onMounted(() => {
  participatesTable.value.init(participates.list)
})

const confirm = useConfirm()
const confirmToMoveExternal = () => {
  const url = scenario.value?.url
  if (!url) return
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
