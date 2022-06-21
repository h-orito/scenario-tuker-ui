<template>
  <DataTable
    :value="scenarios"
    :scrollable="true"
    class="p-datatable-sm"
    responsive-layout="scroll"
  >
    <template v-if="canModify" #header>
      <div class="flex justify-content-end">
        <ButtonPrimary label="追加" icon="plus" @click="openParticipateModal" />
      </div>
    </template>
    <template #empty>通過したシナリオが登録されていません。</template>
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
    <Column v-if="canModify" class="justify-content-end">
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
</template>

<script setup lang="ts">
import { deleteParticipates } from '~/components/api/myself-api'
import { ScenarioType } from '~/@types/scenario-type'
import { AllRoleType } from '~/@types/role-type'
import ParticipateModal from '~/components/pages/participates/participate-modal.vue'
import ParticipateModifyModal from '~/components/pages/participates/participate-modify-modal.vue'
import { useConfirm } from 'primevue/useconfirm'

interface Props {
  allScenarios: ScenariosResponse
  allParticipates: Array<ParticipateResponse>
  type: ScenarioType
  canModify: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'reload'): void
  (e: 'delete', participate: ParticipateResponse): void
}>()

const scenarios = computed(() => {
  return props.allParticipates.filter(
    (p) => p.scenario.type === props.type.value
  )
})

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

const reload = () => emit('reload')
</script>
