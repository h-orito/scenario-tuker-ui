<template>
  <div>
    <Title>Scenario Tuker | ルールブック一覧</Title>
    <h1>ルールブック一覧</h1>
    <div class="text-center bg-gray-200 p-2 md:p-5 my-2 md:my-5">
      <label class="field-label">検索条件</label>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="ルールブック名"
            @keyup.enter="search"
          />
        </div>
      </div>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <FormText
            v-model:value="gameSystemName"
            :has-error="false"
            placeholder="ゲームシステム名"
            @keyup.enter="search"
          />
        </div>
      </div>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <SelectButton
            id="scenario-type"
            v-model="type"
            :options="typeCandidates"
            option-label="label"
            option-value="value"
            :has-error="false"
          />
        </div>
      </div>
      <div class="my-4">
        <div>
          <ButtonPrimary
            label="検索"
            icon="pi pi-search"
            :disabled="searching"
            @click="search"
          />
        </div>
      </div>
    </div>
    <RuleBooksTable
      :rule-books="ruleBooks"
      :modifiable="canModify"
      @modify="refresh"
    >
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <ButtonPrimary label="追加" icon="plus" @click="openCreateModal()" />
        </div>
        <RuleBookCreateModal v-model:show="isShowCreateModal" @save="refresh" />
      </template>
    </RuleBooksTable>
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { fetchRuleBooks, searchRuleBooks } from '~/components/api/rule-book-api'
import RuleBooksTable from '~/components/pages/rule-books/rule-books-table.vue'
import RuleBookCreateModal from '~/components/pages/rule-books/rule-book-create-modal.vue'
import { AllRuleBookType } from '~/@types/rule-book-type'

const ruleBooks: Ref<RuleBooksResponse> = ref(await fetchRuleBooks())

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)

const isShowCreateModal = ref(false)
const openCreateModal = () => (isShowCreateModal.value = true)
const refresh = async () => {
  ruleBooks.value = await fetchRuleBooks()
}

// search
const type = ref('')
const name = ref('')
const gameSystemName = ref('')
const isQueryEmpty = computed(() => {
  return (
    name.value.length <= 0 &&
    gameSystemName.value.length <= 0 &&
    type.value === ''
  )
})
const typeCandidates = ref(
  AllRuleBookType.concat({
    label: '全て',
    value: ''
  })
)
const searching = ref(false)
const search = async () => {
  searching.value = true
  if (isQueryEmpty.value) {
    await refresh()
  } else {
    ruleBooks.value = await searchRuleBooks({
      name: name.value,
      game_system_id: null,
      game_system_name: gameSystemName.value,
      rule_book_type: type.value === '' ? null : type.value
    })
  }
  searching.value = false
}

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | ルールブック一覧`
    }
  ]
})
</script>
