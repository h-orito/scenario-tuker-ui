<template>
  <Modal
    v-model:show="isShow"
    header="シナリオ選択"
    class="text-sm"
    close-button-name="キャンセル"
    @close="closeModal"
  >
    <label class="field-label">検索条件</label>
    <div class="field my-2">
      <div><label>シナリオ名</label></div>
      <FormText v-model:value="name" :has-error="false" @keyup.enter="search" />
    </div>
    <div v-if="type.value === ScenarioType.Trpg.value" class="field my-2">
      <div><label>ゲームシステム名</label></div>
      <FormText
        v-model:value="gameSystemName"
        :has-error="false"
        @keyup.enter="search"
      />
    </div>
    <div class="field my-2">
      <div><label>シナリオ製作者名</label></div>
      <FormText
        v-model:value="authorName"
        :has-error="false"
        @keyup.enter="search"
      />
    </div>
    <div class="my-4">
      <div>
        <ButtonPrimary
          label="検索"
          icon="pi pi-search"
          :disabled="!canSearch"
          @click="search"
        />
      </div>
    </div>
    <div class="col-12">
      <DataTable
        :value="searchedScenarios"
        :scrollable="true"
        class="p-datatable-sm text-xs sm:text-sm"
      >
        <Column field="name" header="シナリオ" />
        <Column
          v-if="type.value === ScenarioType.Trpg.value"
          field="game_system.name"
          header="ゲームシステム"
        />
        <Column header="" class="flex justify-content-end">
          <template #body="slotProps">
            <ButtonPrimary label="選択" @click="decide(slotProps.data)" />
          </template>
        </Column>
        <template #empty>{{
          hasSearched
            ? 'シナリオが見つかりません。'
            : '検索してください（2文字以上）。'
        }}</template>
      </DataTable>
    </div>
    <div class="col-12">
      <p>
        見つからない場合は、お手数ですが<br />シナリオを<a
          href="#"
          @click.prevent.stop="openCreateModal"
          >新規登録</a
        >してください。
      </p>
      <ScenarioCreateModal
        ref="createModal"
        v-model:show="isShowCreateModal"
        @save="decideIfNeeded"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { searchScenarios } from '~/components/api/scenario-api'
import { ScenarioType } from '~/@types/scenario-type'
import ScenarioCreateModal from './scenario-create-modal.vue'

// props
interface Props {
  show: boolean
  type: ScenarioType
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'decide', scenario: Scenario): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

// data
const name = ref('')
const gameSystemName = ref('')
const authorName = ref('')
const searchedScenarios: Ref<Array<ScenarioResponse>> = ref([])
const hasSearched = ref(false)

const canSearch = computed(
  () =>
    name.value.length > 1 ||
    gameSystemName.value.length > 1 ||
    authorName.value.length > 1
)

const search = async () => {
  if (!canSearch.value) return
  hasSearched.value = true
  searchedScenarios.value = (
    await searchScenarios({
      name: name.value,
      game_system_id: null,
      game_system_name: gameSystemName.value,
      type: props.type.value,
      author_name: authorName.value
    })
  ).list
}

const decide = (scenario: ScenarioResponse) => {
  emit('decide', {
    ...scenario,
    game_system_id: scenario.game_system?.id || null,
    author_ids: scenario.authors.map((a) => a.id)
  })
  name.value = ''
  gameSystemName.value = ''
  authorName.value = ''
  searchedScenarios.value = []
  closeModal()
}

const isShowCreateModal = ref(false)
const createModal = ref()
const openCreateModal = () => {
  createModal.value.init(props.type.value)
  isShowCreateModal.value = true
}
const decideIfNeeded = (scenario: ScenarioResponse) => {
  if (props.type.value === scenario.type) decide(scenario)
}
</script>
