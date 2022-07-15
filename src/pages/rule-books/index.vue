<template>
  <div>
    <Title>Scenario Tuker | ルールブック一覧</Title>
    <h1>ルールブック一覧</h1>
    <RuleBooksTable :rule-books="ruleBooks">
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <NuxtLink to="/rule-books/create">
            <ButtonPrimary label="追加" icon="plus" />
          </NuxtLink>
        </div>
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
import { fetchRuleBooks } from '~/components/api/rule-book-api'
import RuleBooksTable from '~/components/pages/rule-books/rule-books-table.vue'

const ruleBooks: RuleBooksResponse = await fetchRuleBooks()

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
</script>
