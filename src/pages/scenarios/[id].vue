<template>
  <div>
    <div v-if="scenario">
      <Title>Scenario Tuker | シナリオ情報 | {{ scenario.name }}</Title>
      <h1>
        シナリオ: {{ scenario.name }}
        <span v-if="canModify" class="ml-2">
          <ButtonPrimary label="" icon="pencil" @click="openModifyModal()" />
          <ScenarioModifyModal
            ref="modifyModal"
            v-model:show="isShowModifyModel"
            @save="refresh"
          />
        </span>
      </h1>
      <p>{{ scenarioType?.label }}</p>
      <p v-if="scenario.game_system">
        ゲームシステム:
        <NuxtLink :to="`/game-systems/${scenario.game_system.id}`">
          {{ scenario.game_system.name }}
        </NuxtLink>
      </p>
      <p v-if="scenario.url">
        <NuxtLink href="#" @click.prevent.stop="confirmToMoveExternal()">
          {{ scenario.url }}&nbsp;<i class="pi pi-external-link"></i>
        </NuxtLink>
      </p>
      <div v-if="scenario.authors.length > 0">
        <span v-for="(author, idx) in scenario.authors" :key="author.id">
          <NuxtLink :to="`/authors/${author.id}`">{{ author.name }}</NuxtLink
          ><span v-if="idx < scenario.authors.length - 1">、</span>
        </span>
      </div>
      <div class="mt-6">
        <h2>{{ scenario.name }} の通過記録</h2>
        <div v-if="canTwitterSearch" class="field-checkbox my-2 mx-auto">
          <Checkbox
            id="twitter-following"
            v-model="isTwitterFollowing"
            value="true"
            @change="fetchParticipates"
          />
          <label for="twitter-following"
            >Twitterでフォローしている人に絞る</label
          >
          （<a v-tooltip.bottom="caution" href="#" @click.prevent.stop=""
            >注意点</a
          >）
        </div>

        <ParticipateTable
          ref="participatesTable"
          :type="scenarioType ?? ScenarioType.Trpg"
          :can-modify="false"
          :hide-scenario-name="true"
          @reload="() => {}"
        />
        <div v-if="alsoScenarios && alsoScenarios.list.length > 0" class="mt-6">
          <h2>このシナリオを通過した人が通過しているシナリオ</h2>
          <ScenariosTable :scenarios="alsoScenarios.list" />
        </div>
      </div>
    </div>
    <div v-else>
      <Title>Scenario Tuker | シナリオ情報</Title>
      存在しないシナリオです。
    </div>
    <div class="mt-8">
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
  fetchScenarioParticipates,
  fetchScenarioAlso
} from '~/components/api/scenario-api'
import { ScenarioType, AllScenarioType } from '~/@types/scenario-type'
import ParticipateTable from '~/components/pages/participates/participate-table.vue'
import ScenarioModifyModal from '~/components/pages/scenarios/scenario-modify-modal.vue'
import ScenariosTable from '~/components/pages/scenarios/scenarios-table.vue'

const route = useRoute()
const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
const participatesTable = ref()
const scenarioId = parseInt(route.params.id as string)
const scenario: Ref<ScenarioResponse | null> = ref(
  await fetchScenario(scenarioId)
)
const scenarioType = computed(() =>
  AllScenarioType.find((st) => st.value === scenario.value?.type)
)

const isTwitterFollowing = ref(false)
const fetchParticipates = async () => {
  const participates = await fetchScenarioParticipates({
    scenario_id: scenarioId,
    is_twitter_following: isTwitterFollowing.value
  })
  participatesTable.value.init(participates.list)
}

const alsoScenarios: Ref<ScenariosResponse | null> = ref(null)

onMounted(async () => {
  await fetchParticipates()
  if (scenario.value) alsoScenarios.value = await fetchScenarioAlso(scenarioId)
})

const modifyModal = ref()
const isShowModifyModel = ref(false)
const openModifyModal = () => {
  modifyModal.value.init(scenario.value)
  isShowModifyModel.value = true
}
const refresh = async () => {
  scenario.value = await fetchScenario(scenarioId)
}

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

const canTwitterSearch = computed(() => authState.value.isSignedIn)
const caution =
  'Twitter APIの制限により、感想閲覧と合わせて15分に15回までしか利用できないため、ご利用は計画的に。'

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | シナリオ情報${
        scenario.value ? ' | ' + scenario.value.name : ''
      }`
    }
  ]
})
</script>
