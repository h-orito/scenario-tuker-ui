<template>
  <Modal
    v-model:show="isShow"
    header="ルールブック選択"
    class="text-sm"
    close-button-name="キャンセル"
    @close="closeModal"
  >
    <label class="field-label">検索条件</label>
    <div class="field my-2">
      <div><label>ルールブック名</label></div>
      <FormText v-model:value="name" :has-error="false" @keyup.enter="search" />
    </div>
    <div v-if="!gameSystemId" class="field my-2">
      <div><label>ゲームシステム名</label></div>
      <FormText
        v-model:value="gameSystemName"
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
        :value="items"
        :scrollable="true"
        class="p-datatable-sm text-xs sm:text-sm"
      >
        <Column field="name" header="ルールブック" />
        <Column field="gameSystem.name" header="ゲームシステム" />
        <Column field="type" header="種別" />
        <Column header="" class="flex justify-content-end">
          <template #body="slotProps">
            <ButtonPrimary label="選択" @click="decide(slotProps.data)" />
          </template>
        </Column>
        <template #empty>{{
          hasSearched
            ? 'ルールブックが見つかりません。'
            : '検索してください（2文字以上）。'
        }}</template>
      </DataTable>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { searchRuleBooks } from '~/components/api/rule-book-api'
import { AllRuleBookType } from '~/@types/rule-book-type'

// props
interface Props {
  show: boolean
  gameSystemId: number | null
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'decide', ruleBook: RuleBookResponse): void
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
const searchedRuleBooks: Ref<Array<RuleBookResponse>> = ref([])

const canSearch = computed(
  () =>
    name.value.length > 0 ||
    gameSystemName.value.length > 0 ||
    !!props.gameSystemId
)

const hasSearched = ref(false)
const search = async () => {
  hasSearched.value = true
  searchedRuleBooks.value = (
    await searchRuleBooks({
      name: name.value,
      game_system_id: props.gameSystemId,
      game_system_name: gameSystemName.value,
      rule_book_type: null
    })
  ).list
}

const items = computed(() => {
  return searchedRuleBooks.value.map((r) => ({
    id: r.id,
    name: r.name,
    gameSystem: r.game_system,
    type: AllRuleBookType.find((rbt) => rbt.value === r.type)?.label
  }))
})

const decide = (ruleBook: RuleBookResponse) => {
  emit('decide', ruleBook)
  closeModal()
}
</script>
