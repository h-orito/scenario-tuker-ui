<template>
  <div>
    <Title>Scenario Tuker | ユーザー検索</Title>
    <h1>ユーザー検索</h1>
    <div class="text-center bg-gray-200 p-2 md:p-5 my-2 md:my-5">
      <label class="field-label">検索条件</label>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-user"></i>
          </span>
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="ユーザー名"
            @keyup.enter="search"
          />
        </div>
      </div>
      <div class="field my-2">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon"><i class="pi pi-twitter"></i></span>
          <FormText
            v-model:value="twitterUserName"
            :has-error="false"
            placeholder="Twitter ID"
            @keyup.enter="search"
          />
        </div>
      </div>
      <div class="my-4">
        <div>
          <ButtonPrimary
            label="検索"
            icon="pi pi-search"
            :disabled="!canSearch || searching"
            @click="search"
          />
        </div>
      </div>
    </div>
    <DataTable :value="users" :scrollable="true" class="p-datatable-sm">
      <Column field="name" header="ユーザー">
        <template #body="slotProps">
          <LinkUserName :user="slotProps.data" />
        </template>
      </Column>
      <Column class="justify-content-end">
        <template #body="slotProps">
          <LinkTwitter :user="slotProps.data" />
        </template>
      </Column>
      <template #empty>{{
        hasSearched
          ? 'ユーザーが見つかりません。'
          : 'ユーザー名もしくはTwitter IDで検索してください。'
      }}</template>
    </DataTable>
    <div class="mt-4">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { searchUser } from '~/components/api/user-api'

const name = ref('')
const twitterUserName = ref('')
const isTwitterFollowing = ref(false)
const users: Ref<Array<User>> = ref([])
const canSearch = computed(() => {
  return (
    name.value.length > 0 ||
    twitterUserName.value.length > 0 ||
    isTwitterFollowing.value
  )
})

const hasSearched = ref(false)
const searching = ref(false)
const search = async () => {
  if (!canSearch.value) return
  searching.value = true
  users.value = (
    await searchUser({
      name: name.value,
      screen_name: twitterUserName.value,
      is_twitter_following: isTwitterFollowing.value
    })
  ).list
  searching.value = false
  hasSearched.value = true
}

useHead({
  meta: [
    {
      name: 'og:title',
      content: `Scenario Tuker | ユーザー検索`
    }
  ]
})
</script>
