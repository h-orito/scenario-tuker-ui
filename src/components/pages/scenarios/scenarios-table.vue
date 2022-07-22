<template>
  <DataTable
    v-model:expanded-rows="expandedRows"
    :value="items"
    :scrollable="true"
    class="p-datatable-sm text-xs sm:text-sm"
    responsive-layout="scroll"
    :paginator="true"
    :rows="10"
    paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    :rows-per-page-options="[10, 20, 50]"
    current-page-report-template="{first} - {last} / {totalRecords}"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <Column :expander="true" />
    <Column header="シナリオ名" field="name" :sortable="true">
      <template #body="slotProps">
        <NuxtLink :to="`/scenarios/${slotProps.data.id}`">
          {{ slotProps.data.name }}
        </NuxtLink>
        <span v-if="slotProps.data.url">
          &nbsp;
          <NuxtLink @click="confirmToMoveExternal(slotProps.data.url)">
            <i class="pi pi-external-link"></i>
          </NuxtLink>
        </span>
      </template>
    </Column>
    <Column field="type" header="種別" :sortable="true"></Column>
    <Column header="ゲームシステム" field="gameSystem.name" :sortable="true">
      <template #body="slotProps">
        <NuxtLink
          v-if="slotProps.data.gameSystem"
          :to="`/game-systems/${slotProps.data.gameSystem.id}`"
        >
          {{ slotProps.data.gameSystem.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column
      field="authors"
      sort-field="autorsSort"
      header="製作者"
      :sortable="true"
    >
      <template #body="slotProps">
        <span v-for="(author, idx) in slotProps.data.authors" :key="author.id">
          <NuxtLink :to="`/authors/${author.id}`">{{ author.name }}</NuxtLink>
          <span v-if="idx < slotProps.data.authors.length - 1">、</span>
        </span>
      </template>
    </Column>
    <Column
      v-if="modifiable || deletable"
      body-class="flex flex-column justify-content-center md:flex md:flex-row md:justify-content-end"
    >
      <template #body="slotProps">
        <ButtonPrimary
          v-if="modifiable"
          icon="pencil"
          label=""
          @click="openModifyScenarioModal(slotProps.data.id)"
        />
        <ButtonDanger
          v-if="modifiable"
          class="md:ml-1"
          icon="trash"
          label=""
          @click="openDeleteModal(slotProps.data.id)"
        />
        <ButtonDanger
          v-if="deletable"
          icon="trash"
          label=""
          @click="deleteUserScenario(slotProps.data.id)"
        />
      </template>
    </Column>
    <template #expansion="slotProps">
      <div class="ml-5 md:ml-7">
        <p v-if="slotProps.data.gameMaster">
          GM: {{ slotProps.data.gameMaster }}
        </p>
        <p v-if="slotProps.data.playerNum">
          PL人数: {{ slotProps.data.playerNum }}
        </p>
        <p v-if="slotProps.data.requiredHour">
          プレイ時間目安: {{ slotProps.data.requiredHour }}時間
        </p>
      </div>
    </template>
    <template #empty>シナリオが登録されていません。</template>
  </DataTable>
  <ScenarioModifyModal
    v-if="modifiable"
    ref="scenarioModifyModal"
    v-model:show="isShowScenarioModifyModel"
    @save="$emit('modify')"
  />
  <ScenarioDeleteModal
    v-if="modifiable"
    ref="scenarioDeleteModal"
    v-model:show="isShowScenarioDeleteModel"
    @save="$emit('modify')"
  />
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { AllScenarioType } from '~/@types/scenario-type'
import ScenarioModifyModal from '~/components/pages/scenarios/scenario-modify-modal.vue'
import ScenarioDeleteModal from '~/components/pages/scenarios/scenario-delete-modal.vue'
import { AllGameMasterRequirementType } from '~/@types/game-master-requirement-type'

// props
interface Props {
  scenarios: Array<ScenarioResponse>
  deletable?: boolean
  modifiable?: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'modify'): void
}>()

// table
const expandedRows = ref([])
const items = computed(() =>
  props.scenarios.map((s) => {
    return {
      id: s.id,
      name: s.name,
      url: s.url,
      type: AllScenarioType.find((st) => st.value === s.type)?.label,
      gameSystem: s.game_system,
      authors: s.authors,
      autorsSort: s.authors.map((a) => a.name).join(','),
      gameMaster: s.game_master_requirement
        ? AllGameMasterRequirementType.find(
            (gm) => gm.value === s.game_master_requirement
          )?.label
        : null,
      playerNum: playerNum(s),
      requiredHour: s.required_hours
    }
  })
)
const playerNum = (s: ScenarioResponse): string | null => {
  const min = s.player_num_min
  const max = s.player_num_max
  if (!min && !max) return null
  if (min === max) return `${min}人`
  if (!max) return `${min}人～`
  if (!min) return `～${max}`
  return `${min}～${max}人`
}

const scenarioModifyModal = ref()
const isShowScenarioModifyModel = ref(false)
const openModifyScenarioModal = (id: number) => {
  scenarioModifyModal.value.init(props.scenarios.find((s) => s.id === id))
  isShowScenarioModifyModel.value = true
}

const scenarioDeleteModal = ref()
const isShowScenarioDeleteModel = ref(false)
const openDeleteModal = (id: number) => {
  scenarioDeleteModal.value.init(props.scenarios.find((s) => s.id === id))
  isShowScenarioDeleteModel.value = true
}

const confirm = useConfirm()
const deleteUserScenario = (id: number) => {
  confirm.require({
    message: '所有シナリオを削除しますか？',
    header: '削除確認',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      emit('delete', id)
    }
  })
}

const confirmToMoveExternal = (url: string) => {
  confirm.require({
    message: `外部サイト（${url}）に遷移します。`,
    header: '外部サイト遷移確認',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      window.open(url)
    }
  })
}
</script>
