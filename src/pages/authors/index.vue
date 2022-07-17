<template>
  <div>
    <Title>Scenario Tuker | シナリオ製作者一覧</Title>
    <h1>シナリオ製作者一覧</h1>
    <div class="text-center bg-gray-200 p-2 md:p-5 my-2 md:my-5">
      <label class="field-label">検索条件</label>
      <div class="my-2 field">
        <div class="p-inputgroup">
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="シナリオ製作者名"
            @keyup.enter="search"
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
    <DataTable
      :value="authorItems"
      :scrollable="true"
      class="p-datatable-sm text-xs sm:text-sm"
      :paginator="true"
      :rows="10"
      paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      :rows-per-page-options="[10, 20, 50]"
      current-page-report-template="{first} - {last} / {totalRecords}"
    >
      <template v-if="canModify" #header>
        <div class="flex justify-content-end">
          <ButtonPrimary label="追加" icon="plus" @click="openCreateModal()" />
        </div>
        <AuthorCreateModal v-model:show="isShowCreateModal" @save="refresh" />
      </template>
      <Column field="name" header="シナリオ製作者名">
        <template #body="slotProps">
          <NuxtLink :to="`/authors/${slotProps.data.id}`">{{
            slotProps.data.name
          }}</NuxtLink>
        </template>
      </Column>
      <Column v-if="canModify" class="flex justify-content-end">
        <template #body="slotProps">
          <ButtonPrimary
            icon="pencil"
            label=""
            @click="openModifyModal(slotProps.data.id)"
          />
          <AuthorModifyModal
            ref="modifyModal"
            v-model:show="isShowModifyModel"
            @save="refresh"
          />
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
import { Ref } from 'vue'
import { fetchAuthors, searchAuthors } from '~/components/api/author-api'
import AuthorCreateModal from '~/components/pages/authors/author-create-modal.vue'
import AuthorModifyModal from '~/components/pages/authors/author-modify-modal.vue'

const authors: Ref<Authors> = ref(await fetchAuthors())
const authorItems = computed(() => {
  return authors.value.list.map((s) => ({
    id: s.id,
    name: s.name
  }))
})

const authState = await useAuth()
const canModify = computed(() => authState.value.isSignedIn)

const isShowCreateModal = ref(false)
const openCreateModal = () => (isShowCreateModal.value = true)
const refresh = async () => {
  authors.value = await fetchAuthors()
}

const modifyModal = ref()
const isShowModifyModel = ref(false)
const openModifyModal = (id: number) => {
  modifyModal.value.init(authors.value.list.find((a) => a.id === id))
  isShowModifyModel.value = true
}

// search
const name = ref('')
const searching = ref(false)
const search = async () => {
  searching.value = true
  if (name.value.length <= 0) {
    await refresh()
  } else {
    authors.value = await searchAuthors({
      name: name.value
    })
  }
  searching.value = false
}
</script>
