<template>
  <div>
    <div v-if="user">
      <Title>Scenario Tuker | ユーザー情報 {{ user.name }}</Title>
      <h1>
        {{ user.name }}
        <ButtonPrimary
          v-if="canModify"
          label=""
          icon="pencil"
          @click="openUserMofifyModal"
        />
      </h1>
      <div v-if="user.twitter_user_name" class="mt-2">
        <LinkTwitter :user="user" />
      </div>
      <div v-if="followingMessage" class="mt-2">{{ followingMessage }}</div>
      <div v-if="isShowFollowButton" class="mt-2">
        <ButtonFollow
          :from="myself!"
          :target="user"
          @follow="reloadMyself"
          @unfollow="reloadMyself"
        />
      </div>
      <div>
        <h2>通過したマーダーミステリー</h2>
        <UserParticipateTable
          ref="murderParticipatesTable"
          :all-scenarios="allScenarios"
          :type="ScenarioType.MurderMystery"
          :can-modify="canModify"
          :user="user"
          :myself="myself"
          @reload="reload"
        />
      </div>
      <div class="mt-5">
        <h2>通過したTRPG</h2>
        <UserParticipateTable
          ref="trpgParticipatesTable"
          :all-scenarios="allScenarios"
          :type="ScenarioType.Trpg"
          :can-modify="canModify"
          :user="user"
          :myself="myself"
          @reload="reload"
        />
      </div>
      <div class="mt-5">
        <h2>フォロー</h2>
        <UsersTable
          :users="user.follows"
          :myself="myself"
          :is-show-follow="canModify"
          @follow="reloadMyself"
          @unfollow="reloadMyself"
        />
      </div>
      <div class="mt-5">
        <h2>フォロワー</h2>
        <UsersTable
          :users="user.followers"
          :myself="myself"
          :is-show-follow="canModify"
          @follow="reloadMyself"
          @unfollow="reloadMyself"
        />
      </div>
      <UserModifyModal
        v-model:show="isShowUserModifyModel"
        @save="updateName"
      />
    </div>
    <div v-else>
      <Title>Scenario Tuker | ユーザー情報</Title>
      存在しないユーザーです。
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
import { fetchUser, fetchUserParticipates } from '~/components/api/user-api'
import { fetchMyself } from '~/components/api/myself-api'
import { fetchScenarios } from '~/components/api/scenario-api'
import { ScenarioType } from '~/@types/scenario-type'
import UserParticipateTable from '~/components/pages/users/user-participate-table.vue'
import UsersTable from '~/components/pages/users/users-table.vue'
import UserModifyModal from '~/components/pages/users/user-modify-modal.vue'

const route = useRoute()
const userId = parseInt(route.params.id as string)
const authState: Ref<AuthState> = await useAuth()

const user: Ref<UserResponse | null> = ref(await fetchUser(userId))
const allScenarios = await fetchScenarios()

const myself: Ref<User | null> = ref(null)

const canModify = computed(() => {
  return !!myself.value && !!user.value && myself.value.id === user.value.id
})

const followingMessage = computed(() => {
  if (!myself.value || !user.value || myself.value.id === user.value.id)
    return null
  const isUserFollowMyself = user.value.follows.some(
    (u) => u.id === myself.value?.id
  )
  const isMyselfFollowUser = myself.value.follows.some(
    (u) => u === user.value?.id
  )

  if (isUserFollowMyself && isMyselfFollowUser) {
    return '相互フォロー'
  } else if (isUserFollowMyself) {
    return 'フォローされています'
  } else if (isMyselfFollowUser) {
    return 'フォローしています'
  } else {
    return null
  }
})

const isShowFollowButton = computed(() => !!myself.value && !canModify.value)

const murderParticipatesTable = ref()
const trpgParticipatesTable = ref()

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

const reloadUser = async () => {
  user.value = await fetchUser(userId)
}

const reloadMyself = async () => {
  myself.value = await fetchMyself()
}

const isShowUserModifyModel = ref(false)
const openUserMofifyModal = () => (isShowUserModifyModel.value = true)
const updateName = async () => {
  await reloadUser()
}

onMounted(async () => {
  myself.value = authState.value.myself
  await reload()
})
</script>
