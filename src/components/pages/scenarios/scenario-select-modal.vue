<template>
  <Modal
    v-model:show="isShow"
    header="シナリオ選択"
    class="text-sm"
    close-button-name="キャンセル"
    @close="closeModal"
  >
    <div class="grid p-fluid mb-2">
      <div class="col-12">
        <div class="p-inputgroup">
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="シナリオ名"
            @keyup.enter="search"
          />
          <Button
            icon="pi pi-search"
            :disabled="name.length <= 1"
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
          <Column header="">
            <template #body="slotProps">
              <ButtonPrimary label="選択" @click="decide(slotProps.data)" />
            </template>
          </Column>
          <template #empty>{{
            hasSearched
              ? 'シナリオが見つかりません。'
              : 'シナリオ名で検索してください。'
          }}</template>
        </DataTable>
      </div>
      <div class="col-12">
        <p>
          見つからない場合はお手数ですが<br />シナリオを<NuxtLink
            to="/scenarios/create"
            target="_blank"
            >新規登録</NuxtLink
          >してください。
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { searchScenarios } from '~/components/api/scenario-api'
import { ScenarioType } from '~/@types/scenario-type'

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
const searchedScenarios: Ref<Array<ScenarioResponse>> = ref([])

const hasSearched = ref(false)
const search = async () => {
  hasSearched.value = true
  searchedScenarios.value = (
    await searchScenarios({
      name: name.value,
      game_system_id: null,
      type: props.type.value
    })
  ).list
}

const decide = (scenario: ScenarioResponse) => {
  emit('decide', {
    ...scenario,
    game_system_id: scenario.game_system?.id || null,
    author_ids: scenario.authors.map((a) => a.id)
  })
  closeModal()
}
</script>
