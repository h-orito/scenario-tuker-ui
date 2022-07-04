<template>
  <DataTable
    :value="scenarios"
    class="p-datatable-sm"
    responsive-layout="scroll"
    @row-reorder="reorder"
  >
    <template v-if="canModify" #header>
      <div class="flex justify-content-end">
        <ButtonPrimary label="追加" icon="plus" @click="openParticipateModal" />
      </div>
    </template>
    <template #empty>通過したシナリオが登録されていません。</template>
    <Column v-if="canModify" :row-reorder="true" header-style="width: 3rem" />
    <Column field="scenario.name" header="シナリオ"></Column>
    <Column
      v-if="type.value === ScenarioType.Trpg.value"
      field="scenario.rule_book.name"
      header="ルールブック"
    ></Column>
    <Column field="role_types" header="役割">
      <template #body="slotProps">
        {{ roleLabels(slotProps.data.role_types) }}
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
    v-model:show="isShowParticipateModal"
    :type="type"
    :all-scenarios="allScenarios"
    @save="reload"
  />
  <ParticipateModifyModal
    ref="modifyModal"
    v-model:show="isShowModifyModal"
    @save="reload"
  />
  <ImpressionModal
    ref="impressionModal"
    v-model:show="isShowImpressionModal"
    :user="user"
    :myself="myself"
  />
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import {
  deleteParticipates,
  putParticipates
} from '~/components/api/myself-api'
import { ScenarioType } from '~/@types/scenario-type'
import { AllRoleType } from '~/@types/role-type'
import ParticipateModal from '~/components/pages/participates/participate-modal.vue'
import ParticipateModifyModal from '~/components/pages/participates/participate-modify-modal.vue'
import ImpressionModal from '~/components/pages/participates/impression-modal.vue'

interface Props {
  allScenarios: ScenariosResponse
  type: ScenarioType
  canModify: boolean
  user: UserResponse
  myself: User | null
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'reload'): void
  (e: 'delete', participate: ParticipateResponse): void
}>()

const scenarios: Ref<Array<ParticipateResponse>> = ref([])
const orgScenarios: Ref<Array<ParticipateResponse>> = ref([])
const init = (participates: Array<ParticipateResponse>) => {
  scenarios.value = participates
}

const roleLabels = (types: Array<string>): string => {
  return AllRoleType.filter((rt) => types.some((type) => type === rt.value))
    .map((rt) => rt.label)
    .join('、')
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
  orgScenarios.value = [...scenarios.value]
  scenarios.value = event.value

  for (let i = 0; i < scenarios.value.length; i++) {
    const p = scenarios.value[i]
    const org = orgScenarios.value[i]
    console.log(p)
    console.log(org)
    if (p.id != org.id) {
      await putParticipates({
        id: p.id,
        scenario_id: p.scenario.id,
        role_types: p.role_types,
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
