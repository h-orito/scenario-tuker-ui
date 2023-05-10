<template>
  <div>
    <Title>Scenario Tuker | シナリオ一覧</Title>
    <h1>シナリオ一覧</h1>
    <div class="text-center bg-gray-200 p-2 md:p-5 my-2 md:my-5">
      <label class="field-label">検索条件</label>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <SelectButton
            id="scenario-type"
            v-model="type"
            :options="typeCandidates"
            option-label="label"
            option-value="value"
            :has-error="false"
          />
        </div>
      </div>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="シナリオ名"
            @keyup.enter="search"
          />
        </div>
      </div>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <FormText
            v-model:value="gameSystemName"
            :has-error="false"
            placeholder="ゲームシステム名"
            @keyup.enter="search"
          />
        </div>
      </div>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <FormText
            v-model:value="authorName"
            :has-error="false"
            placeholder="シナリオ製作者名"
            @keyup.enter="search"
          />
        </div>
      </div>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <FormIncrementalNumber
            id="player-num"
            v-model:value="playerNum"
            :has-error="false"
            placeholder="PL人数"
            @keyup.enter="search"
          />
          <div class="flex align-items-center ml-2">
            <Checkbox
              id="player-num-empty"
              v-model="playerNumEmpty"
              :value="true"
              :disabled="playerNum == null"
            />
            <label for="player-num-empty" class="ml-2">
              PL人数未登録を含む
            </label>
          </div>
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
    <ScenariosTable
      :scenarios="scenarios.list"
      :modifiable="canModify"
      :show-type="true"
      @modify="search"
    >
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <ButtonPrimary label="追加" icon="plus" @click="openCreateModal()" />
        </div>
      </template>
    </ScenariosTable>
    <ScenarioCreateModal
      ref="createModal"
      v-model:show="isShowCreateModal"
      @save="search"
    />
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { fetchScenarios, searchScenarios } from '~/components/api/scenario-api'
import ScenariosTable from '~/components/pages/scenarios/scenarios-table.vue'
import ScenarioCreateModal from '~~/src/components/pages/scenarios/scenario-create-modal.vue'
import { AllScenarioType } from '~/@types/scenario-type'

const route = useRoute()
const queryType = route.query.type as string

const scenarios: Ref<ScenariosResponse> = ref({
  list: [],
  all_record_count: 0,
  all_page_count: 0,
  exist_pre_page: false,
  exist_next_page: false,
  current_page_num: 0
})
const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)

const isShowCreateModal = ref(false)
const createModal = ref()
const openCreateModal = () => {
  createModal.value.init(type.value)
  isShowCreateModal.value = true
}

onMounted(async () => {
  if (queryType !== '') {
    type.value = queryType
  }
  await search()
})

// search
const type = ref('')
const name = ref('')
const gameSystemName = ref('')
const authorName = ref('')
const playerNum = ref()
const playerNumEmpty = ref(false)
const isQueryEmpty = computed(() => {
  return (
    name.value.length <= 0 &&
    gameSystemName.value.length <= 0 &&
    type.value === '' &&
    authorName.value.length <= 0 &&
    playerNum.value === null
  )
})
const typeCandidates = ref(
  AllScenarioType.concat({
    label: '両方',
    value: ''
  })
)
const searching = ref(false)
const search = async () => {
  searching.value = true
  if (isQueryEmpty.value) {
    scenarios.value = await fetchScenarios()
  } else {
    scenarios.value = await searchScenarios({
      name: name.value,
      game_system_id: null,
      game_system_name: gameSystemName.value,
      type: type.value === '' ? null : type.value,
      author_name: authorName.value,
      player_num: playerNum.value,
      player_num_empty: playerNumEmpty.value
    })
  }
  searching.value = false
}

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | シナリオ一覧`
    }
  ]
})
</script>
