<template>
  <Modal
    v-model:show="isShow"
    header="ルールブック選択"
    class="text-sm"
    submit-button-name="選択する"
    close-button-name="キャンセル"
    :submit-disabled="ruleBooks.length <= 0"
    @submit="decide"
    @close="closeModal"
  >
    <div class="grid p-fluid mb-2">
      <div class="col-12">
        <div class="p-inputgroup">
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="ルールブック名"
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
        <p>{{ selecting }}</p>
        <DataTable
          :value="items"
          :scrollable="true"
          class="p-datatable-sm text-xs sm:text-sm"
        >
          <Column field="name" header="ルールブック" />
          <Column field="gameSystem" header="ゲームシステム" />
          <Column field="type" header="ゲームシステム" />
          <Column header="">
            <template #body="slotProps">
              <ButtonPrimary label="追加" @click="add(slotProps.data)" />
            </template>
          </Column>
          <template #empty>{{
            hasSearched
              ? 'ルールブックが見つかりません。'
              : 'ルールブック名で検索してください。'
          }}</template>
        </DataTable>
      </div>
      <div class="col-12">
        <p>
          見つからない場合はお手数ですが<br />ルールブックを<NuxtLink
            to="/rule-books/create"
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
  (e: 'decide', ruleBooks: Array<RuleBook>): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

// data
const name = ref('')
const searchedRuleBooks: Ref<Array<RuleBookResponse>> = ref([])
const ruleBooks: Ref<Array<RuleBook>> = ref([])

const hasSearched = ref(false)
const search = async () => {
  hasSearched.value = true
  searchedRuleBooks.value = (
    await searchRuleBooks({
      name: name.value,
      game_system_id: props.gameSystemId,
      rule_book_type: null
    })
  ).list
}

const items = computed(() => {
  return searchedRuleBooks.value.map((r) => ({
    id: r.id,
    name: r.name,
    gameSystem: r.game_system.name,
    type: AllRuleBookType.find((rbt) => rbt.value === r.type)?.label
  }))
})

const selecting = computed(() => {
  if (ruleBooks.value.length <= 0) return '選択されていません'
  return `選択中: ${ruleBooks.value.map((a) => a.name).join('、')}`
})
const add = (ruleBook: RuleBookResponse) => {
  if (ruleBooks.value.some((a) => a.id === ruleBook.id)) return
  const r = searchedRuleBooks.value.find((rb) => rb.id === ruleBook.id)!
  ruleBooks.value.push({
    ...r,
    game_system_id: r.game_system.id
  })
}

const decide = () => {
  emit('decide', ruleBooks.value)
  closeModal()
}
</script>
