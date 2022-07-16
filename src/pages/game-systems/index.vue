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
          <ButtonPrimary label="追加" icon="plus" @click="openCreateModal()" />
        </div>
        <GameSystemCreateModal
          v-model:show="isShowCreateModal"
          @save="refresh"
        />
      </template>
      <Column header="ゲームシステム名">
        <template #body="slotProps">
          <NuxtLink :to="`/game-systems/${slotProps.data.id}`">
            {{ slotProps.data.name }}
          </NuxtLink>
        </template>
      </Column>
      <Column v-if="canModify" class="flex justify-content-end">
        <template #body="slotProps">
          <ButtonPrimary
            icon="pencil"
            label=""
            @click="openModifyModal(slotProps.data.id)"
          />
          <GameSystemModifyModal
            ref="modifyModal"
            v-model:show="isShowModifyModel"
            @modify="refresh"
          />
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
import { Ref } from 'vue'
import { fetchGameSystems } from '~/components/api/game-system-api'
import GameSystemCreateModal from '~/components/pages/game-systems/game-system-create-modal.vue'
import GameSystemModifyModal from '~/components/pages/game-systems/game-system-modify-modal.vue'

const gameSystems: Ref<GameSystems> = ref(await fetchGameSystems())
const gameSystemItems = computed(() => {
  return gameSystems.value.list.map((g) => ({
    id: g.id,
    name: g.name
  }))
})

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)

const isShowCreateModal = ref(false)
const openCreateModal = () => (isShowCreateModal.value = true)
const refresh = async () => {
  gameSystems.value = await fetchGameSystems()
}

const modifyModal = ref()
const isShowModifyModel = ref(false)
const openModifyModal = (id: number) => {
  modifyModal.value.init(gameSystems.value.list.find((g) => g.id === id))
  isShowModifyModel.value = true
}
</script>
