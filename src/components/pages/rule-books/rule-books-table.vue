<template>
  <DataTable
    :value="items"
    :scrollable="true"
    class="p-datatable-sm text-xs sm:text-sm"
    :paginator="true"
    :rows="10"
    paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    :rows-per-page-options="[10, 20, 50]"
    current-page-report-template="{first} - {last} / {totalRecords}"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <Column field="name" header="ルールブック名" :sortable="true">
      <template #body="slotProps">
        <NuxtLink :to="`/rule-books/${slotProps.data.id}`">
          {{ slotProps.data.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column field="gameSystem.name" header="ゲームシステム" :sortable="true">
      <template #body="slotProps">
        <NuxtLink
          :to="`/game-systems/${slotProps.data.gameSystem.id}`"
          target="_blank"
        >
          {{ slotProps.data.gameSystem.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column field="type" header="種別" :sortable="true"></Column>
    <Column v-if="modifiable || deletable" class="flex justify-content-end">
      <template #body="slotProps">
        <ButtonPrimary
          v-if="modifiable"
          icon="pencil"
          label=""
          @click="openModifyModal(slotProps.data.id)"
        />
        <ButtonDanger
          v-if="deletable"
          icon="trash"
          label=""
          @click="deleteRuleBook(slotProps.data.id)"
        />
        <RuleBookModifyModal
          ref="modifyModal"
          v-model:show="isShowModifyModel"
          @save="$emit('modify')"
        />
      </template>
    </Column>
    <template #empty>ルールブックが登録されていません。</template>
  </DataTable>
</template>

<script setup lang="ts">
import { AllRuleBookType } from '~/@types/rule-book-type'
import { useConfirm } from 'primevue/useconfirm'
import RuleBookModifyModal from '~/components/pages/rule-books/rule-book-modify-modal.vue'

// props
interface Props {
  ruleBooks: RuleBooksResponse
  deletable?: boolean
  modifiable?: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'delete', id: number): void
  (e: 'modify'): void
}>()

const items = computed(() => {
  return props.ruleBooks.list.map((r) => ({
    id: r.id,
    name: r.name,
    gameSystem: r.game_system,
    type: AllRuleBookType.find((rbt) => rbt.value === r.type)?.label
  }))
})

const modifyModal = ref()
const isShowModifyModel = ref(false)
const openModifyModal = (id: number) => {
  modifyModal.value.init(props.ruleBooks.list.find((r) => r.id === id))
  isShowModifyModel.value = true
}

const confirm = useConfirm()
const deleteRuleBook = (id: number) => {
  confirm.require({
    message: '所有ルールブックを削除しますか？',
    header: '削除確認',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      emit('delete', id)
    }
  })
}
</script>
