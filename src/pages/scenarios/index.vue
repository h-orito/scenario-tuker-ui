<template>
  <div>
    <Title>Scenario Tuker | シナリオ一覧</Title>
    <h1>シナリオ一覧</h1>
    <ScenariosTable :scenarios="scenarios.list">
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <NuxtLink to="/scenarios/create">
            <ButtonPrimary label="追加" icon="plus" />
          </NuxtLink>
        </div>
      </template>
    </ScenariosTable>
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchScenarios } from '~/components/api/scenario-api'
import ScenariosTable from '~/components/pages/scenarios/scenarios-table.vue'

const scenarios: ScenariosResponse = await fetchScenarios()
const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
</script>
