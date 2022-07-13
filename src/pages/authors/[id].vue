<template>
  <div>
    <div v-if="author">
      <Title>Scenario Tuker | シナリオ製作者情報 | {{ author.name }}</Title>
      <h1>{{ author.name }}</h1>
      <div>
        <h2>製作したシナリオ</h2>
        <ScenariosTable :scenarios="scenarios.list" :can-modify="false" />
      </div>
    </div>
    <div v-else>
      <Title>Scenario Tuker | シナリオ製作者情報</Title>
      存在しないシナリオ製作者です。
    </div>
    <div class="mt-4">
      <NuxtLink to="/authors">
        <ButtonSecondary label="シナリオ製作者一覧" />
      </NuxtLink>
    </div>
    <div class="mt-2">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { fetchAuthor, fetchAuthorScenarios } from '~/components/api/author-api'
import ScenariosTable from '~/components/pages/scenarios/scenarios-table.vue'

const route = useRoute()
const authorId = parseInt(route.params.id as string)
const author: Ref<Author | null> = ref(await fetchAuthor(authorId))
const scenarios = await fetchAuthorScenarios(authorId)
</script>
