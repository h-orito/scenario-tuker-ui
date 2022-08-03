<template>
  <div>
    <div v-if="ruleBook">
      <Title>Scenario Tuker | ルールブック情報 | {{ ruleBook.name }}</Title>
      <h1>
        ルールブック: {{ ruleBook.name }}
        <span v-if="canModify" class="ml-2">
          <ButtonPrimary label="" icon="pencil" @click="openModifyModal()" />
          <RuleBookModifyModal
            ref="modifyModal"
            v-model:show="isShowModifyModel"
            @save="refresh"
          />
        </span>
      </h1>
      <p>ゲームシステム: {{ ruleBook.game_system.name }}</p>
      <p>{{ ruleBookType }}</p>
      <div class="mt-4">
        <h2>{{ ruleBook.name }} の通過記録</h2>
        <ParticipateTable
          ref="participatesTable"
          :type="ScenarioType.Trpg"
          :can-modify="false"
          @reload="() => {}"
        />
      </div>
    </div>
    <div v-else>
      <Title>Scenario Tuker | ルールブック情報</Title>
      存在しないルールブックです。
    </div>
    <div class="mt-4">
      <NuxtLink to="/rule-books">
        <ButtonSecondary label="ルールブック一覧" />
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
import {
  fetchRuleBook,
  fetchRuleBookParticipates
} from '~/components/api/rule-book-api'
import ParticipateTable from '~/components/pages/participates/participate-table.vue'
import RuleBookModifyModal from '~/components/pages/rule-books/rule-book-modify-modal.vue'
import { ScenarioType } from '~/@types/scenario-type'
import { AllRuleBookType } from '~/@types/rule-book-type'

const route = useRoute()
const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
const ruleBookId = parseInt(route.params.id as string)
const ruleBook: Ref<RuleBookResponse | null> = ref(
  await fetchRuleBook(ruleBookId)
)
const ruleBookType = computed(
  () => AllRuleBookType.find((rbt) => rbt.value === ruleBook.value?.type)?.label
)
const participates = await fetchRuleBookParticipates(ruleBookId)
const participatesTable = ref()
onMounted(() => {
  participatesTable.value.init(participates.list)
})

const modifyModal = ref()
const isShowModifyModel = ref(false)
const openModifyModal = () => {
  modifyModal.value.init(ruleBook.value)
  isShowModifyModel.value = true
}
const refresh = async () => {
  ruleBook.value = await fetchRuleBook(ruleBookId)
}

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | ルールブック情報${
        ruleBook.value ? ' | ' + ruleBook.value.name : ''
      }`
    }
  ]
})
</script>
