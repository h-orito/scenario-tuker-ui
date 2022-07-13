<template>
  <div>
    <Title>Scenario Tuker | ゲームシステム一覧</Title>
    <h1>ゲームシステム一覧</h1>
    <DataTable
      :value="gameSystemItems"
      :scrollable="true"
      class="p-datatable-sm text-xs sm:text-sm"
    >
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <NuxtLink to="/game-systems/create">
            <ButtonPrimary label="追加" icon="plus" />
          </NuxtLink>
        </div>
      </template>
      <Column header="ゲームシステム名">
        <template #body="slotProps">
          <NuxtLink :to="`/game-systems/${slotProps.data.id}`">
            {{ slotProps.data.name }}
          </NuxtLink>
        </template>
      </Column>
      <template #empty>ゲームシステムが登録されていません。</template>
    </DataTable>
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchGameSystems } from '~/components/api/game-system-api'

const gameSystems: GameSystems = await fetchGameSystems()
const gameSystemItems = computed(() => {
  return gameSystems.list.map((g) => ({
    id: g.id,
    name: g.name
  }))
})

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
</script>
