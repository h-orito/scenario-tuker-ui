<template>
  <div>
    <Title>Scenario Tuker | シナリオ一覧</Title>
    <h1>シナリオ一覧</h1>
    <ScenariosTable
      :scenarios="scenarios.list"
      :modifiable="canModify"
      @modify="refresh"
    >
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <ButtonPrimary label="追加" icon="plus" @click="openCreateModal()" />
        </div>
      </template>
    </ScenariosTable>
    <ScenarioCreateModal v-model:show="isShowCreateModal" @save="refresh" />
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { fetchScenarios } from '~/components/api/scenario-api'
import ScenariosTable from '~/components/pages/scenarios/scenarios-table.vue'
import ScenarioCreateModal from '~~/src/components/pages/scenarios/scenario-create-modal.vue'

const scenarios: Ref<ScenariosResponse> = ref(await fetchScenarios())
const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)

const isShowCreateModal = ref(false)
const openCreateModal = () => (isShowCreateModal.value = true)
const refresh = async () => {
  scenarios.value = await fetchScenarios()
}
</script>
