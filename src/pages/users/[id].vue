<template>
  <div>
    <div v-if="user">
      <Title>Scenario Tuker | ユーザー情報 {{ user.name }}</Title>
      <h1>
        ユーザー: {{ user.name }}
        <LinkTwitter :user="user" />
      </h1>
      <div class="mt-2">
        <ButtonPrimary
          v-if="canModify"
          label="ユーザ名・自己紹介編集"
          icon="pencil"
          @click="openUserMofifyModal"
        />
      </div>
      <div
        v-if="markedIntroduction"
        v-dompurify-html="markedIntroduction"
        class="introduction"
      ></div>
      <div class="mt-5">
        <TabView :active-index="activeIndex">
          <TabPanel header="マーダーミステリー">
            <div>
              <h3>マーダーミステリー参加記録</h3>
              <ParticipateTable
                ref="murderParticipatesTable"
                :type="ScenarioType.MurderMystery"
                :can-modify="canModify"
                :hide-user="true"
                @reload="reloadParticipates"
              />
            </div>
            <div class="mt-5">
              <h3>所有シナリオ</h3>
              <ScenariosTable
                :scenarios="murderScenarios"
                :deletable="canModify"
                @delete="deleteScenario"
              >
                <template v-if="canModify" #header>
                  <div class="flex justify-content-end">
                    <ButtonPrimary
                      label="追加"
                      icon="plus"
                      @click="openMurderScenarioModal"
                    />
                  </div>
                </template>
              </ScenariosTable>
            </div>
          </TabPanel>
          <TabPanel header="TRPG">
            <div>
              <h3>TRPG参加記録</h3>
              <ParticipateTable
                ref="trpgParticipatesTable"
                :type="ScenarioType.Trpg"
                :can-modify="canModify"
                :hide-user="true"
                @reload="reloadParticipates"
              />
            </div>
            <div v-if="ruleBooks" class="mt-5">
              <h3>所有ルールブック</h3>
              <RuleBooksTable
                :rule-books="ruleBooks"
                :deletable="canModify"
                @delete="deleteRuleBook"
              >
                <template v-if="canModify" #header>
                  <div class="flex justify-content-end">
                    <ButtonPrimary
                      label="追加"
                      icon="plus"
                      @click="openRuleBookModal"
                    />
                  </div>
                </template>
              </RuleBooksTable>
            </div>
            <div class="mt-5">
              <h3>所有シナリオ</h3>
              <ScenariosTable
                :scenarios="trpgScenarios"
                :deletable="canModify"
                @delete="deleteScenario"
              >
                <template v-if="canModify" #header>
                  <div class="flex justify-content-end">
                    <ButtonPrimary
                      label="追加"
                      icon="plus"
                      @click="openTrpgScenarioModal"
                    />
                  </div>
                </template>
              </ScenariosTable>
            </div>
          </TabPanel>
        </TabView>
      </div>
      <div v-if="canModify" class="mt-8">
        <ButtonDanger label="ユーザー削除" @click="confirmToDelete" />
      </div>
      <UserModifyModal
        v-model:show="isShowUserModifyModel"
        @save="reloadUser"
      />
      <RuleBooksSelectModal
        v-model:show="isShowRuleBookModel"
        :game-system-id="null"
        @decide="registerRuleBook"
      />
      <ScenariosSelectModal
        v-model:show="isShowMurderScenarioModel"
        :type="ScenarioType.MurderMystery"
        @decide="registerScenarios"
      />
      <ScenariosSelectModal
        v-model:show="isShowTrpgScenarioModel"
        :type="ScenarioType.Trpg"
        @decide="registerScenarios"
      />
    </div>
    <div v-else>
      <Title>Scenario Tuker | ユーザー情報</Title>
      存在しないユーザーです。
    </div>
    <div class="mt-4">
      <NuxtLink to="/users">
        <ButtonSecondary label="ユーザー検索" />
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
import { marked } from 'marked'
import { useConfirm } from 'primevue/useconfirm'
import {
  fetchUser,
  fetchUserParticipates,
  fetchUserRuleBooks,
  fetchUserScenarios
} from '~/components/api/user-api'
import {
  deleteMyself,
  postRuleBooks,
  postScenarios,
  deleteRuleBooks,
  deleteScenarios
} from '~/components/api/myself-api'
import { ScenarioType } from '~/@types/scenario-type'
import ParticipateTable from '~/components/pages/participates/participate-table.vue'
import RuleBooksTable from '~/components/pages/rule-books/rule-books-table.vue'
import ScenariosTable from '~/components/pages/scenarios/scenarios-table.vue'
import UserModifyModal from '~/components/pages/users/user-modify-modal.vue'
import RuleBooksSelectModal from '~/components/pages/rule-books/rule-books-select-modal.vue'
import ScenariosSelectModal from '~/components/pages/scenarios/scenarios-select-modal.vue'

const route = useRoute()
const userId = parseInt(route.params.id as string)

// tab
const activeIndex = ref(0)

// myself
const authState: Ref<AuthState> = await useAuth()
const myself: Ref<User | null> = ref(null)
const canModify = computed(() => {
  return !!myself.value && !!user.value && myself.value.id === user.value.id
})

// user
const user: Ref<User | null> = ref(await fetchUser(userId))
const reloadUser = async () => {
  user.value = await fetchUser(userId)
}
const markedIntroduction = computed(() => {
  const intro = user.value?.introduction
  if (!intro || intro.length <= 0) return null
  return marked(intro)
})
// modal
const isShowUserModifyModel = ref(false)
const openUserMofifyModal = () => (isShowUserModifyModel.value = true)

// participates
const murderParticipatesTable = ref()
const trpgParticipatesTable = ref()
const murderParticipates: Ref<Array<ParticipateResponse>> = ref([])
const trpgParticipates: Ref<Array<ParticipateResponse>> = ref([])
const reloadParticipates = async () => {
  const userParticipates = await fetchUserParticipates(userId)
  murderParticipates.value = userParticipates.list.filter(
    (p) => p.scenario.type === ScenarioType.MurderMystery.value
  )
  murderParticipatesTable.value.init(murderParticipates.value)
  trpgParticipates.value = userParticipates.list.filter(
    (p) => p.scenario.type === ScenarioType.Trpg.value
  )
  trpgParticipatesTable.value.init(trpgParticipates.value)
}

// rulebooks
const ruleBooks: Ref<RuleBooksResponse | null> = ref(null)
const reloadRuleBooks = async () => {
  ruleBooks.value = await fetchUserRuleBooks(userId)
}
const registerRuleBook = async (ruleBooks: Array<RuleBook>) => {
  for (let r of ruleBooks) {
    await postRuleBooks({
      rule_book_id: r.id
    })
  }
  await reloadRuleBooks()
}
const deleteRuleBook = async (id: number) => {
  await deleteRuleBooks(id)
  await reloadRuleBooks()
}
// modal
const isShowRuleBookModel = ref(false)
const openRuleBookModal = () => (isShowRuleBookModel.value = true)

// scenarios
const reloadScenarios = async () => {
  const scenarios = (await fetchUserScenarios(userId)).list
  murderScenarios.value = scenarios.filter(
    (s) => s.type === ScenarioType.MurderMystery.value
  )
  trpgScenarios.value = scenarios.filter(
    (s) => s.type === ScenarioType.Trpg.value
  )
}
const murderScenarios: Ref<Array<ScenarioResponse>> = ref([])
const trpgScenarios: Ref<Array<ScenarioResponse>> = ref([])

const registerScenarios = async (scenarios: Array<Scenario>) => {
  for (let scenario of scenarios) {
    await postScenarios({
      scenario_id: scenario.id
    })
  }
  await reloadScenarios()
}
const deleteScenario = async (id: number) => {
  await deleteScenarios(id)
  await reloadScenarios()
}
// modal
const isShowMurderScenarioModel = ref(false)
const openMurderScenarioModal = () => (isShowMurderScenarioModel.value = true)
const isShowTrpgScenarioModel = ref(false)
const openTrpgScenarioModal = () => (isShowTrpgScenarioModel.value = true)

// delete
const confirm = useConfirm()
const confirmToDelete = () => {
  confirm.require({
    message: 'ユーザーを削除しますか？この操作は取り消せません。',
    header: '削除確認',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await deleteMyself()
      location.reload()
    }
  })
}

onMounted(async () => {
  myself.value = authState.value.myself
  await Promise.all([
    reloadParticipates(),
    reloadRuleBooks(),
    reloadScenarios()
  ])

  if (murderParticipates.value.length < trpgParticipates.value.length) {
    activeIndex.value = 1
  }
})

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | ユーザー情報${
        user.value ? ' | ' + user.value.name : ''
      }`
    }
  ]
})
</script>

<style lang="scss">
.p-tabview {
  .p-tabview-nav {
    display: flex;

    li {
      flex: 1;

      a.p-tabview-nav-link {
        justify-content: center;
        color: #6c757d !important;
      }
    }

    li.p-highlight a.p-tabview-nav-link {
      color: #3b82f6 !important;
    }
  }
  .p-tabview-panels {
    padding: 0;
  }
}
</style>
