<template>
  <div>
    <div v-if="gameSystem">
      <Title>Scenario Tuker | ゲームシステム情報 | {{ gameSystem.name }}</Title>
      <h1>ゲームシステム: {{ gameSystem.name }}</h1>
      <div>
        <h2>{{ gameSystem.name }} のシナリオ</h2>
        <ScenariosTable :scenarios="scenarios.list" :can-modify="false" />
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

const route = useRoute()
const gameSystemId = parseInt(route.params.id as string)
const gameSystem: Ref<GameSystem | null> = ref(
  await fetchGameSystem(gameSystemId)
)
const scenarios = await fetchGameSystemScenarios(gameSystemId)
</script>
