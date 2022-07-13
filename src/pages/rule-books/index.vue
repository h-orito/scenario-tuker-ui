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
import { AllRuleBookType } from '~/@types/rule-book-type'

const ruleBooks: RuleBooksResponse = await fetchRuleBooks()
const ruleBookItems = computed(() => {
  return ruleBooks.list.map((r) => ({
    id: r.id,
    name: r.name,
    gameSystem: r.game_system,
    type: AllRuleBookType.find((rbt) => rbt.value === r.type)?.label
  }))
})

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
</script>
