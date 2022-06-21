<template>
  <div>
    <div v-if="user">
      <h1>{{ user.name }}</h1>
      <h2>通過したマーダーミステリー</h2>
      <UserParticipateTable
        :all-scenarios="allScenarios"
        :all-participates="participateScenarios"
        :type="ScenarioType.MurderMystery"
        :can-modify="canModify"
        @reload="reload"
      />
      <h2>通過したTRPG</h2>
      <UserParticipateTable
        :all-scenarios="allScenarios"
        :all-participates="participateScenarios"
        :type="ScenarioType.Trpg"
        :can-modify="canModify"
        @reload="reload"
      />
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
import { fetchUser, fetchUserParticipates } from '~/components/api/user-api'
import { fetchScenarios } from '~/components/api/scenario-api'
import { ScenarioType } from '~/@types/scenario-type'
import UserParticipateTable from '~/components/pages/users/user-participate-table.vue'

const route = useRoute()
const userId = route.params.id

const user: User | null = await fetchUser(userId)
const participateScenarios: Ref<Array<ParticipateResponse>> = ref([])
const authState = await useAuth()
const myself = computed(() => {
  return authState.value.myself
})
const canModify = computed(() => {
  return !!myself.value && !!user && myself.value.id === user.id
})

const allScenarios = await fetchScenarios()

const reload = async () => {
  const userParticipates = await fetchUserParticipates(userId)
  participateScenarios.value = userParticipates.list
}

onMounted(async () => {
  await reload()
})
</script>
