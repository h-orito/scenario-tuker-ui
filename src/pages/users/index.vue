<template>
  <div>
    <h1>ユーザー検索</h1>
    <div class="grid p-fluid mb-2">
      <div class="col-12 md:col-6">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">
            <i class="pi pi-user"></i>
          </span>
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="ユーザー名"
            @keyup.enter="searchByName"
          />
          <Button
            icon="pi pi-search"
            :disabled="name.length <= 1"
            @click="searchByName"
          />
        </div>
      </div>
      <div class="col-12 md:col-6">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon"><i class="pi pi-twitter"></i></span>
          <FormText
            v-model:value="twitterUserName"
            :has-error="false"
            placeholder="Twitter ID"
            @keyup.enter="searchByTwitterUserName"
          />
          <Button
            icon="pi pi-search"
            :disabled="twitterUserName.length <= 1"
            @click="searchByTwitterUserName"
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
        <ButtonSecondary label="トップページへ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { searchUser } from '~/components/api/user-api'

const name = ref('')
const twitterUserName = ref('')
const users: Ref<Array<User>> = ref([])
const searchByName = async () => await search(name.value, null)
const searchByTwitterUserName = async () =>
  await search(null, twitterUserName.value)

const hasSearched = ref(false)
const search = async (name: string | null, twitterUserName: string | null) => {
  users.value = (
    await searchUser({
      name,
      twitter_user_name: twitterUserName
    })
  ).list
  hasSearched.value = true
}
</script>
