<template>
  <div>
    <Title>Scenario Tuker | ルールブック一覧</Title>
    <h1>ルールブック一覧</h1>
    <DataTable
      :value="ruleBookItems"
      :scrollable="true"
      class="p-datatable-sm text-xs sm:text-sm"
    >
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <NuxtLink to="/rule-books/create">
            <ButtonPrimary label="追加" icon="plus" />
          </NuxtLink>
        </div>
      </template>
      <Column field="name" header="ルールブック名"></Column>
      <template #empty>ルールブックが登録されていません。</template>
    </DataTable>
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchRuleBooks } from '~/components/api/rule-book-api'

const ruleBooks: RuleBooks = await fetchRuleBooks()
const ruleBookItems = computed(() => {
  return ruleBooks.list.map((s) => ({
    name: s.name
  }))
})

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
</script>
