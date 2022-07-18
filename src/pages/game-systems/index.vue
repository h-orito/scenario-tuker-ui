<template>
  <div>
    <Title>Scenario Tuker | ゲームシステム一覧</Title>
    <h1>ゲームシステム一覧</h1>
    <div class="text-center bg-gray-200 p-2 md:p-5 my-2 md:my-5">
      <label class="field-label">検索条件</label>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="ゲームシステム名"
            @keyup.enter="search"
          />
        </div>
      </div>
      <div class="my-4">
        <div>
          <ButtonPrimary
            label="検索"
            icon="pi pi-search"
            :disabled="searching"
            @click="search"
          />
        </div>
      </div>
    </div>
    <DataTable
      :value="gameSystemItems"
      :scrollable="true"
      class="p-datatable-sm text-xs sm:text-sm"
      :paginator="true"
      :rows="10"
      paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rows-per-page-options="[10, 20, 50]"
      current-page-report-template="{first} - {last} / {totalRecords}"
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
          <ButtonDanger
            class="ml-1"
            icon="trash"
            label=""
            @click="openDeleteModal(slotProps.data.id)"
          />
          <GameSystemModifyModal
            ref="modifyModal"
            v-model:show="isShowModifyModel"
            @modify="refresh"
          />
          <GameSystemDeleteModal
            ref="deleteModal"
            v-model:show="isShowDeleteModel"
            @save="refresh"
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
import {
  fetchGameSystems,
  searchGameSystems
} from '~/components/api/game-system-api'
import GameSystemCreateModal from '~/components/pages/game-systems/game-system-create-modal.vue'
import GameSystemModifyModal from '~/components/pages/game-systems/game-system-modify-modal.vue'
import GameSystemDeleteModal from '~/components/pages/game-systems/game-system-delete-modal.vue'

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

const deleteModal = ref()
const isShowDeleteModel = ref(false)
const openDeleteModal = (id: number) => {
  deleteModal.value.init(gameSystems.value.list.find((g) => g.id === id))
  isShowDeleteModel.value = true
}

// search
const name = ref('')
const searching = ref(false)
const search = async () => {
  searching.value = true
  if (name.value.length <= 0) {
    await refresh()
  } else {
    gameSystems.value = await searchGameSystems({
      name: name.value
    })
  }
  searching.value = false
}
</script>
