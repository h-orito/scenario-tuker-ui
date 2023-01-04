<template>
  <div>
    <div v-if="participate">
      <Title>Scenario Tuker | 参加記録 | {{ participate.scenario.name }}</Title>
      <h1>シナリオ: {{ participate.scenario.name }}</h1>
      <p>{{ scenarioType?.label }}</p>
      <p v-if="participate.scenario.game_system">
        ゲームシステム:
        <NuxtLink :to="`/game-systems/${participate.scenario.game_system.id}`">
          {{ participate.scenario.game_system.name }}
        </NuxtLink>
      </p>
      <div v-if="participate.rule_books.length > 0">
        ルールブック:
        <span
          v-for="(ruleBook, idx) in participate.rule_books"
          :key="ruleBook.id"
        >
          <NuxtLink :to="`/rule-books/${ruleBook.id}`">{{
            ruleBook.name
          }}</NuxtLink
          ><span v-if="idx < participate.rule_books.length - 1">、</span>
        </span>
      </div>
      <p>
        ユーザー:
        <NuxtLink :to="`/users/${participate.user.id}`">
          {{ participate.user.name }}
        </NuxtLink>
      </p>
      <p v-if="participate.role_names.length > 0">
        役割: {{ participate.role_names.join('、') }}
      </p>
      <p v-if="terms">{{ terms }}</p>
      <p v-if="players">{{ players }}</p>
      <p v-if="participate.memo">ひとことメモ: {{ participate.memo }}</p>
      <div class="mt-4">
        <ButtonPrimary
          label="感想"
          icon="comment"
          @click="openImpressionModal"
        />
      </div>
    </div>
    <div v-else>
      <Title>Scenario Tuker | 参加記録</Title>
      存在しない参加記録です。
    </div>
    <div class="mt-8">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
    <ImpressionModal
      ref="impressionModal"
      v-model:show="isShowImpressionModal"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { fetchParticipate } from '~/components/api/participate-api'
import { AllScenarioType } from '~/@types/scenario-type'
import ImpressionModal from '~/components/pages/participates/impression-modal.vue'

const route = useRoute()
const participateId = parseInt(route.params.id as string)
const participate: Ref<ParticipateResponse | null> = ref(
  await fetchParticipate(participateId)
)

const scenarioType = computed(() =>
  AllScenarioType.find((st) => st.value === participate.value?.scenario?.type)
)
const terms = computed((): string | null => {
  const p = participate.value
  if (!p) return null
  if (!p.term && !p.required_hours) return null
  const arr = []
  if (p.term) arr.push(term(p.term))
  if (p.required_hours) arr.push(`プレイ時間: ${p.required_hours}時間`)
  return arr.join(' / ')
})
const term = (term: ParticipateTerm): string => {
  if (term.from === term.to) return `日程: ${term.from}` || ''
  if (!term.from) return `日程: ～ ${term.to}`
  if (!term.to) return `日程: ${term.from} ～`
  return `日程: ${term.from} ～ ${term.to}`
}
const players = computed((): string | null => {
  const p = participate.value
  if (!p) return null
  if (!p.player_num && !p.game_master && !p.player_names) return null
  const arr = []
  if (p.player_num) arr.push(`PL人数: ${p.player_num}`)
  if (p.game_master) arr.push(`GM: ${p.game_master}`)
  if (p.player_names) arr.push(`参加PL: ${p.player_names}`)
  return arr.join(' / ')
})

// view impression
const isShowImpressionModal = ref(false)
const impressionModal = ref()
const openImpressionModal = () => {
  impressionModal.value.init(participate.value!)
  isShowImpressionModal.value = true
}

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | 参加記録${
        participate.value?.scenario
          ? ' | ' + participate.value.scenario.name
          : ''
      }`
    }
  ]
})
</script>
