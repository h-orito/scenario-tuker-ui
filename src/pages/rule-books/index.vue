<template>
  <div>
    <Title>Scenario Tuker | ルールブック一覧</Title>
    <h1>ルールブック一覧</h1>
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
import { fetchRuleBooks } from '~/components/api/rule-book-api'
import RuleBooksTable from '~/components/pages/rule-books/rule-books-table.vue'
import RuleBookCreateModal from '~/components/pages/rule-books/rule-book-create-modal.vue'

const ruleBooks: Ref<RuleBooksResponse> = ref(await fetchRuleBooks())

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)

const isShowCreateModal = ref(false)
const openCreateModal = () => (isShowCreateModal.value = true)
const refresh = async () => {
  ruleBooks.value = await fetchRuleBooks()
}
</script>
