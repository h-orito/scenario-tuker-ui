<template>
  <div>
    <div v-if="user">
      <h1>{{ user.name }}</h1>
      <div v-if="user.twitter_user_name" class="mt-2">
        <LinkTwitter :user="user" />
      </div>
      <div v-if="followingMessage" class="mt-2">{{ followingMessage }}</div>
      <div v-if="isShowFollowButton" class="mt-2">
        <ButtonFollow
          :from="myself"
          :target="user"
          @follow="reloadMyself"
          @unfollow="reloadMyself"
        />
      </div>
      <div>
        <h2>通過したマーダーミステリー</h2>
        <UserParticipateTable
          :all-scenarios="allScenarios"
          :all-participates="participateScenarios"
          :type="ScenarioType.MurderMystery"
          :can-modify="canModify"
          @reload="reload"
        />
      </div>
      <div class="mt-5">
        <h2>通過したTRPG</h2>
        <UserParticipateTable
          :all-scenarios="allScenarios"
          :all-participates="participateScenarios"
          :type="ScenarioType.Trpg"
          :can-modify="canModify"
          @reload="reload"
        />
      </div>
      <div class="mt-5">
        <h2>フォロー</h2>
        <DataTable
          :value="user.follows"
          :scrollable="true"
          class="p-datatable-sm"
          responsive-layout="scroll"
        >
          <Column field="name" header="ユーザー">
            <template #body="slotProps">
              <LinkUserName :user="slotProps.data" />
            </template>
          </Column>
          <Column v-if="canModify" class="justify-content-end">
            <template #body="slotProps">
              <ButtonFollow
                :from="myself"
                :target="slotProps.data"
                @follow="reloadMyself"
                @unfollow="reloadMyself"
              />
            </template>
          </Column>
          <template #empty>フォローしているユーザーがいません。</template>
        </DataTable>
      </div>
      <div class="mt-5">
        <h2>フォロワー</h2>
        <DataTable
          :value="user.followers"
          :scrollable="true"
          class="p-datatable-sm"
          responsive-layout="scroll"
        >
          <Column field="name" header="ユーザー">
            <template #body="slotProps">
              <LinkUserName :user="slotProps.data" />
            </template>
          </Column>
          <Column v-if="canModify" class="justify-content-end">
            <template #body="slotProps">
              <ButtonFollow
                :from="myself"
                :target="slotProps.data"
                @follow="reloadMyself"
                @unfollow="reloadMyself"
              />
            </template>
          </Column>
          <template #empty>フォローされているユーザーがいません。</template>
        </DataTable>
      </div>
    </div>
    <div v-else>存在しないユーザーです。</div>
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページへ" />
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

const route = useRoute()
const userId = route.params.id
const authState: Ref<AuthState> = await useAuth()

const user: UserResponse | null = await fetchUser(userId)
const allScenarios = await fetchScenarios()

const participateScenarios: Ref<Array<ParticipateResponse>> = ref([])
const myself: Ref<User | null> = ref(null)

const canModify = computed(() => {
  return !!myself.value && !!user && myself.value.id === user.id
})

const followingMessage = computed(() => {
  if (!myself.value || !user || myself.value.id === user.id) return null
  const isUserFollowMyself = user.follows.some((u) => u.id === myself.value.id)
  const isMyselfFollowUser = myself.value.follows.some((u) => u === user.id)

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

const reload = async () => {
  const userParticipates = await fetchUserParticipates(userId)
  participateScenarios.value = userParticipates.list
}

const reloadMyself = async () => {
  myself.value = await fetchMyself()
}

onMounted(async () => {
  myself.value = authState.value.myself
  await reload()
})
</script>
