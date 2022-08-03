<template>
  <div>
    <div v-if="gameSystem">
      <Title>Scenario Tuker | ゲームシステム情報 | {{ gameSystem.name }}</Title>
      <h1>
        ゲームシステム: {{ gameSystem.name }}
        <span v-if="canModify" class="ml-2">
          <ButtonPrimary label="" icon="pencil" @click="openModifyModal()" />
          <GameSystemModifyModal
            ref="modifyModal"
            v-model:show="isShowModifyModel"
            @modify="refresh"
          />
        </span>
      </h1>
      <div>
        <h2>{{ gameSystem.name }} のシナリオ</h2>
        <ScenariosTable :scenarios="scenarios.list" />
      </div>
    </div>
    <div v-else>
      <Title>Scenario Tuker | ゲームシステム情報</Title>
      存在しないゲームシステムです。
    </div>
    <div class="mt-4">
      <NuxtLink to="/game-systems">
        <ButtonSecondary label="ゲームシステム一覧" />
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
  fetchGameSystem,
  fetchGameSystemScenarios
} from '~/components/api/game-system-api'
import ScenariosTable from '~/components/pages/scenarios/scenarios-table.vue'
import GameSystemModifyModal from '~/components/pages/game-systems/game-system-modify-modal.vue'

const route = useRoute()
const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
const gameSystemId = parseInt(route.params.id as string)
const gameSystem: Ref<GameSystem | null> = ref(
  await fetchGameSystem(gameSystemId)
)
const scenarios = await fetchGameSystemScenarios(gameSystemId)

const modifyModal = ref()
const isShowModifyModel = ref(false)
const openModifyModal = () => {
  modifyModal.value.init(gameSystem.value)
  isShowModifyModel.value = true
}
const refresh = async () => {
  gameSystem.value = await fetchGameSystem(gameSystemId)
}

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | ゲームシステム情報${
        gameSystem.value ? ' | ' + gameSystem.value.name : ''
      }`
    }
  ]
})
</script>
