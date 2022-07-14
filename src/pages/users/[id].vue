<template>
  <div>
    <div v-if="user">
      <Title>Scenario Tuker | ユーザー情報 {{ user.name }}</Title>
      <h1>
        {{ user.name }}
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
        <h2>通過したマーダーミステリー</h2>
        <ParticipateTable
          ref="murderParticipatesTable"
          :type="ScenarioType.MurderMystery"
          :can-modify="canModify"
          @reload="reload"
        />
      </div>
      <div class="mt-5">
        <h2>通過したTRPG</h2>
        <ParticipateTable
          ref="trpgParticipatesTable"
          :type="ScenarioType.Trpg"
          :can-modify="canModify"
          @reload="reload"
        />
      </div>
      <UserModifyModal
        v-model:show="isShowUserModifyModel"
        @save="reloadUser"
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
import { fetchUser, fetchUserParticipates } from '~/components/api/user-api'
import { ScenarioType } from '~/@types/scenario-type'
import ParticipateTable from '~/components/pages/participates/participate-table.vue'
import UserModifyModal from '~/components/pages/users/user-modify-modal.vue'

const route = useRoute()
const userId = parseInt(route.params.id as string)
const authState: Ref<AuthState> = await useAuth()

const user: Ref<User | null> = ref(await fetchUser(userId))
const myself: Ref<User | null> = ref(null)

const canModify = computed(() => {
  return !!myself.value && !!user.value && myself.value.id === user.value.id
})

const murderParticipatesTable = ref()
const trpgParticipatesTable = ref()

// modal
const isShowUserModifyModel = ref(false)
const openUserMofifyModal = () => (isShowUserModifyModel.value = true)

const reloadUser = async () => {
  user.value = await fetchUser(userId)
}

onMounted(async () => {
  myself.value = authState.value.myself
  await reload()
})

const reload = async () => {
  const userParticipates = await fetchUserParticipates(userId)
  const murderParticipates = userParticipates.list.filter(
    (p) => p.scenario.type === ScenarioType.MurderMystery.value
  )
  murderParticipatesTable.value.init(murderParticipates)
  const trpgParticipates = userParticipates.list.filter(
    (p) => p.scenario.type === ScenarioType.Trpg.value
  )
  trpgParticipatesTable.value.init(trpgParticipates)
}

const markedIntroduction = computed(() => {
  const intro = user.value?.introduction
  if (!intro || intro.length <= 0) return null
  return marked(intro)
})
</script>
