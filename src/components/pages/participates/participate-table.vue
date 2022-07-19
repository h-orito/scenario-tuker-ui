<template>
  <DataTable
    :value="participates"
    class="p-datatable-sm text-xs sm:text-sm"
    responsive-layout="scroll"
    :paginator="true"
    :rows="10"
    paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    :rows-per-page-options="[10, 20, 50, 100, 200, 500, 1000]"
    current-page-report-template="{first} - {last} / {totalRecords}"
    @row-reorder="reorder"
  >
    <template v-if="canModify" #header>
      <div class="flex justify-content-end">
        <ButtonPrimary label="追加" icon="plus" @click="openParticipateModal" />
      </div>
    </template>
    <template #empty>通過したシナリオが登録されていません。</template>
    <Column
      v-if="canModify"
      :row-reorder="true"
      class="hidden-sm"
      header-style="width: 3rem"
    />
    <Column header="シナリオ" field="name">
      <template #body="slotProps">
        <NuxtLink :to="`/scenarios/${slotProps.data.scenario.id}`">
          {{ slotProps.data.scenario.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column v-if="!canModify" header="ユーザー">
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
    <Column field="role_names" header="役割">
      <template #body="slotProps">
        {{ slotProps.data.role_names.join('、') }}
      </template>
    </Column>
    <Column v-if="canModify" class="justify-content-end text-right">
      <template #body="slotProps">
        <ButtonPrimary
          icon="pencil"
          label=""
          @click="openModifyModal(slotProps.data)"
        />
        <ButtonDanger
          class="ml-1"
          icon="trash"
          label=""
          @click="deleteParticipate(slotProps.data)"
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
  </DataTable>
  <ParticipateModal
    v-if="canModify"
    v-model:show="isShowParticipateModal"
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
  <ImpressionModal ref="impressionModal" v-model:show="isShowImpressionModal" />
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import {
  deleteParticipates,
  putParticipates
} from '~/components/api/myself-api'
import { ScenarioType } from '~/@types/scenario-type'
import ParticipateModal from '~/components/pages/participates/participate-modal.vue'
import ParticipateModifyModal from '~/components/pages/participates/participate-modify-modal.vue'
import ImpressionModal from '~/components/pages/participates/impression-modal.vue'

interface Props {
  type: ScenarioType
  canModify: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'reload'): void
  (e: 'delete', participate: ParticipateResponse): void
}>()

const participates: Ref<Array<ParticipateResponse>> = ref([])
const orgParticipates: Ref<Array<ParticipateResponse>> = ref([])
const init = (target: Array<ParticipateResponse>) => {
  participates.value = target
}

// add
const isShowParticipateModal = ref(false)
const openParticipateModal = () => (isShowParticipateModal.value = true)

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

// reorder
const reorder = async (event: any) => {
  orgParticipates.value = [...participates.value]
  participates.value = event.value

  for (let i = 0; i < participates.value.length; i++) {
    const p = participates.value[i]
    const org = orgParticipates.value[i]
    if (p.id != org.id) {
      await putParticipates({
        id: p.id,
        scenario_id: p.scenario.id,
        rule_book_ids: p.rule_books.map((rb) => rb.id),
        role_names: p.role_names,
        disp_order: org.disp_order,
        impression: p.impression
      })
    }
  }
}

const reload = () => emit('reload')

defineExpose({
  init
})
</script>
