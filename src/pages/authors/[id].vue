<template>
  <div>
    <div v-if="author">
      <Title>Scenario Tuker | シナリオ製作者情報 | {{ author.name }}</Title>
      <h1>
        シナリオ製作者: {{ author.name }}
        <span v-if="canModify" class="ml-2">
          <ButtonPrimary label="" icon="pencil" @click="openModifyModal()" />
          <AuthorModifyModal
            ref="modifyModal"
            v-model:show="isShowModifyModel"
            @save="refresh"
          />
        </span>
      </h1>
      <div>
        <h2>製作したシナリオ</h2>
        <ScenariosTable :scenarios="scenarios.list" />
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
import AuthorModifyModal from '~/components/pages/authors/author-modify-modal.vue'

const route = useRoute()
const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)
const authorId = parseInt(route.params.id as string)
const author: Ref<Author | null> = ref(await fetchAuthor(authorId))
const scenarios = await fetchAuthorScenarios(authorId)

const modifyModal = ref()
const isShowModifyModel = ref(false)
const openModifyModal = () => {
  modifyModal.value.init(author.value)
  isShowModifyModel.value = true
}
const refresh = async () => {
  author.value = await fetchAuthor(authorId)
}

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | シナリオ製作者情報${
        author.value ? ' | ' + author.value.name : ''
      }`
    }
  ]
})
</script>
