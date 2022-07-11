<template>
  <div>
    <Title>Scenario Tuker | シナリオ製作者一覧</Title>
    <h1>シナリオ製作者一覧</h1>
    <DataTable
      :value="authorItems"
      :scrollable="true"
      class="p-datatable-sm text-xs sm:text-sm"
    >
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <NuxtLink to="/authors/create">
            <ButtonPrimary label="追加" icon="plus" />
          </NuxtLink>
        </div>
      </template>
      <Column field="name" header="シナリオ製作者名">
        <template #body="slotProps">
          <NuxtLink :to="`/authors/${slotProps.data.id}`" target="_blank">{{
            slotProps.data.name
          }}</NuxtLink>
        </template>
      </Column>
      <template #empty>シナリオ製作者が登録されていません。</template>
    </DataTable>
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { fetchAuthors } from '~/components/api/author-api'

const authors: Authors = await fetchAuthors()
const authorItems = computed(() => {
  return authors.list.map((s) => ({
    id: s.id,
    name: s.name
  }))
})

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
</script>
