<template>
  <DataTable
    :value="items"
    :scrollable="true"
    class="p-datatable-sm text-xs sm:text-sm"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>

    <Column field="name" header="ルールブック名">
      <template #body="slotProps">
        <NuxtLink :to="`/rule-books/${slotProps.data.id}`" target="_blank">
          {{ slotProps.data.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column field="gameSystem" header="ゲームシステム">
      <template #body="slotProps">
        <NuxtLink
          :to="`/game-systems/${slotProps.data.gameSystem.id}`"
          target="_blank"
        >
          {{ slotProps.data.gameSystem.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column field="type" header="種別"></Column>
    <Column v-if="deletable" class="flex justify-content-end">
      <template #body="slotProps">
        <ButtonDanger
          icon="trash"
          label=""
          @click="deleteRuleBook(slotProps.data.id)"
        />
      </template>
    </Column>
    <template #empty>ルールブックが登録されていません。</template>
  </DataTable>
</template>

<script setup lang="ts">
import { AllRuleBookType } from '~/@types/rule-book-type'
import { useConfirm } from 'primevue/useconfirm'

// props
interface Props {
  ruleBooks: RuleBooksResponse
  deletable?: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

const items = computed(() => {
  return props.ruleBooks.list.map((r) => ({
    id: r.id,
    name: r.name,
    gameSystem: r.game_system,
    type: AllRuleBookType.find((rbt) => rbt.value === r.type)?.label
  }))
})

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
