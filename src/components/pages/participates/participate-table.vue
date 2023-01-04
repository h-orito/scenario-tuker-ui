<template>
  <DataTable
    v-model:expanded-rows="expandedRows"
    :value="participates"
    data-key="id"
    class="p-datatable-sm text-xs sm:text-sm"
    responsive-layout="scroll"
    :paginator="true"
    :rows="10"
    paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    :rows-per-page-options="[10, 20, 50, 100, 200, 500, 1000]"
    current-page-report-template="{first} - {last} / {totalRecords}"
  >
    <template v-if="canModify" #header>
      <div class="flex justify-content-end">
        <ButtonPrimary label="並び替え" icon="sort" @click="openSortModal" />
        <ButtonPrimary
          class="ml-2"
          label="一括追加"
          icon="plus"
          @click="openMultipleCreateModal"
        />
        <ButtonPrimary
          class="ml-2"
          label="追加"
          icon="plus"
          @click="openParticipateModal"
        />
      </div>
    </template>
    <template #empty>通過したシナリオが登録されていません。</template>
    <Column :expander="true" header-style="width: 3rem" />
    <Column
      v-if="!hideScenarioName ?? true"
      header="シナリオ"
      field="name"
      :sortable="true"
      sort-field="scenario.name"
    >
      <template #body="slotProps">
        <NuxtLink :to="`/scenarios/${slotProps.data.scenario.id}`">
          {{ slotProps.data.scenario.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column
      v-if="
        type.value === ScenarioType.Trpg.value && (!hideScenarioName ?? true)
      "
      header="ゲームシステム"
      field="gameSystem"
      :sortable="true"
      sort-field="scenario.game_system.name"
    >
      <template #body="slotProps">
        <NuxtLink
          :to="`/game-systems/${slotProps.data.scenario.game_system.id}`"
        >
          {{ slotProps.data.scenario.game_system.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column
      v-if="!canModify && (!hideUser ?? true)"
      header="ユーザー"
      :sortable="true"
      sort-field="user.name"
    >
      <template #body="slotProps">
        <NuxtLink :to="`/users/${slotProps.data.user.id}`">
          {{ slotProps.data.user.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column
      v-if="type.value === ScenarioType.Trpg.value"
      field="scenario.rule_books"
      header="ルールブック"
    >
      <template #body="slotProps">
        <span
          v-for="(ruleBook, idx) in slotProps.data.rule_books"
          :key="ruleBook.id"
        >
          <NuxtLink :to="`/rule-books/${ruleBook.id}`">{{
            ruleBook.name
          }}</NuxtLink
          ><span v-if="idx < slotProps.data.rule_books.length - 1"><br /></span>
        </span>
      </template>
    </Column>
    <Column
      field="role_names"
      header="役割"
      :sortable="true"
      sort-field="role_names"
    >
      <template #body="slotProps">
        {{ slotProps.data.role_names.join('、') }}
      </template>
    </Column>
    <Column v-if="canModify" class="justify-content-end text-right">
      <template #body="slotProps">
        <SplitButton
          icon="pi pi-pencil"
          :model="editItems(slotProps.data)"
          @click="openModifyModal(slotProps.data)"
        />
      </template>
    </Column>
    <Column v-if="!canModify" class="justify-content-end text-right">
      <template #body="slotProps">
        <ButtonPrimary
          v-if="slotProps.data.impression"
          icon="comment"
          label=""
          @click="openImpressionModal(slotProps.data)"
        />
      </template>
    </Column>
    <template #expansion="slotProps">
      <div class="ml-5 md:ml-7">
        <p v-if="terms(slotProps.data)">{{ terms(slotProps.data) }}</p>
        <p v-if="players(slotProps.data)">
          {{ players(slotProps.data) }}
        </p>
        <p v-if="slotProps.data.memo">
          ひとことメモ: {{ slotProps.data.memo }}
        </p>
      </div>
    </template>
  </DataTable>
  <ParticipateModal
    v-if="canModify"
    v-model:show="isShowParticipateModal"
    :type="type"
    @save="reload"
  />
  <ParticipateMultipleCreateModal
    v-if="canModify"
    v-model:show="isShowMultipleCreateModal"
    :type="type"
    @save="reload"
  />
  <ParticipateModifyModal
    v-if="canModify"
    ref="modifyModal"
    v-model:show="isShowModifyModal"
    :type="type"
    @save="reload"
  />
  <ParticipateSortModal
    v-if="canModify"
    ref="sortModal"
    v-model:show="isShowSortModal"
    :type="type"
    @save="reload"
  />
  <ImpressionModal ref="impressionModal" v-model:show="isShowImpressionModal" />
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { deleteParticipates } from '~/components/api/myself-api'
import { ScenarioType } from '~/@types/scenario-type'
import { AllDisclosureRange } from '~/@types/disclosure-range'
import ParticipateModal from '~/components/pages/participates/participate-create-modal.vue'
import ParticipateMultipleCreateModal from '~/components/pages/participates/participate-multiple-create-modal.vue'
import ParticipateModifyModal from '~/components/pages/participates/participate-modify-modal.vue'
import ParticipateSortModal from '~/components/pages/participates/participate-sort-modal.vue'
import ImpressionModal from '~/components/pages/participates/impression-modal.vue'

interface Props {
  type: ScenarioType
  canModify: boolean
  hideScenarioName?: boolean
  hideUser?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'reload'): void
  (e: 'delete', participate: ParticipateResponse): void
}>()

// table
const expandedRows = ref([])
const terms = (p: ParticipateResponse): string | null => {
  if (!p.term && !p.required_hours) return null
  const arr = []
  if (p.term) arr.push(term(p.term))
  if (p.required_hours) arr.push(`プレイ時間: ${p.required_hours}時間`)
  return arr.join(' / ')
}
const term = (term: ParticipateTerm): string => {
  if (term.from === term.to) return `日程: ${term.from}` || ''
  if (!term.from) return `日程: ～ ${term.to}`
  if (!term.to) return `日程: ${term.from} ～`
  return `日程: ${term.from} ～ ${term.to}`
}
const players = (p: ParticipateResponse): string | null => {
  if (!p.player_num && !p.game_master && !p.player_names) return null
  const arr = []
  if (p.player_num) arr.push(`PL人数: ${p.player_num}`)
  if (p.game_master) arr.push(`GM: ${p.game_master}`)
  if (p.player_names) arr.push(`参加PL: ${p.player_names}`)
  return arr.join(' / ')
}

// participates
const participates: Ref<Array<ParticipateResponse>> = ref([])
const orgParticipates: Ref<Array<ParticipateResponse>> = ref([])
const init = (target: Array<ParticipateResponse>) => {
  participates.value = target
}

// add
const isShowParticipateModal = ref(false)
const openParticipateModal = () => (isShowParticipateModal.value = true)

// multiple create
const isShowMultipleCreateModal = ref(false)
const openMultipleCreateModal = () => (isShowMultipleCreateModal.value = true)

const isShowSortModal = ref(false)
const sortModal = ref()
const openSortModal = () => {
  sortModal.value.init(participates.value)
  isShowSortModal.value = true
}

// modify
const isShowModifyModal = ref(false)
const modifyModal = ref()
const openModifyModal = (target: ParticipateResponse) => {
  modifyModal.value.init(target)
  isShowModifyModal.value = true
}

// delete
const confirm = useConfirm()
const deleteParticipate = async (target: ParticipateResponse) => {
  confirm.require({
    message: '通過したシナリオを削除しますか？',
    header: '削除確認',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await deleteParticipates(target.id)
      emit('reload')
    }
  })
}

// view impression
const isShowImpressionModal = ref(false)
const impressionModal = ref()
const openImpressionModal = (participate: ParticipateResponse) => {
  impressionModal.value.init(participate)
  isShowImpressionModal.value = true
}

// edit buttons
const editItems = (participate: ParticipateResponse) => {
  const items = [
    {
      label: '削除',
      icon: 'pi pi-trash',
      command: () => {
        deleteParticipate(participate)
      }
    }
  ]

  if (!!participate.impression) {
    items.push({
      label: '感想',
      icon: 'pi pi-comment',
      command: () => {
        openImpressionModal(participate)
      }
    })
    items.push({
      label: '感想URL共有',
      icon: 'pi pi-twitter',
      command: () => {
        const scenarioName = participate.scenario.name
        const range = participate.impression?.disclosure_range
        const rangeText = AllDisclosureRange.find(
          (dr) => dr.value === range
        )!.label
        const hasSpoiler = participate.impression?.has_spoiler
          ? 'ネタバレ含む'
          : 'ネタバレなし'
        let url = 'https://twitter.com/share?text='
        url += encodeURIComponent(
          `${scenarioName}\n感想公開範囲: ${rangeText}（${hasSpoiler}）\n`
        )
        url += `&url=${encodeURIComponent(
          `https://scenario-tuker.netlify.app/participates/${participate.id}`
        )}`
        url += `&hashtags=${encodeURIComponent('ScenarioTuker')}`
        window.open(url)
      }
    })
  }

  return items
}

const reload = () => emit('reload')

defineExpose({
  init
})
</script>
