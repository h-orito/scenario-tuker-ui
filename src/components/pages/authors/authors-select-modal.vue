<template>
  <Modal
    v-model:show="isShow"
    header="シナリオ製作者選択"
    class="text-sm"
    submit-button-name="選択する"
    close-button-name="キャンセル"
    :submit-disabled="authors.length <= 0"
    @submit="decide"
    @close="closeModal"
  >
    <div class="grid p-fluid mb-2">
      <div class="col-12">
        <div class="p-inputgroup">
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="シナリオ製作者名"
            @keyup.enter="search"
          />
          <Button
            icon="pi pi-search"
            :disabled="name.length <= 1"
            @click="search"
          />
        </div>
      </div>
      <div class="col-12">
        <p>{{ selecting }}</p>
        <DataTable
          :value="searchedAuthors"
          :scrollable="true"
          class="p-datatable-sm"
        >
          <Column field="name" header="シナリオ製作者" />
          <Column field="name" header="">
            <template #body="slotProps">
              <ButtonPrimary label="追加" @click="add(slotProps.data)" />
            </template>
          </Column>
          <template #empty>{{
            hasSearched
              ? 'シナリオ製作者が見つかりません。'
              : 'シナリオ製作者名で検索してください。'
          }}</template>
        </DataTable>
      </div>
      <div class="col-12">
        <p>
          見つからない場合は、お手数ですが<br />シナリオ製作者を<a
            href="#"
            @click.prevent.stop="openCreateModal"
            >新規登録</a
          >してください。
        </p>
        <AuthorCreateModal v-model:show="isShowCreateModal" @save="add" />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { searchAuthors } from '~/components/api/author-api'
import AuthorCreateModal from './author-create-modal.vue'

// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'decide', authors: Array<Author>): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

// data
const name = ref('')
const searchedAuthors: Ref<Array<Author>> = ref([])
const authors: Ref<Array<Author>> = ref([])

const hasSearched = ref(false)
const search = async () => {
  hasSearched.value = true
  searchedAuthors.value = (
    await searchAuthors({
      name: name.value
    })
  ).list
}

const selecting = computed(() => {
  if (authors.value.length <= 0) return '選択されていません'
  return `選択中: ${authors.value.map((a) => a.name).join('、')}`
})
const add = (author: Author) => {
  if (authors.value.some((a) => a.id === author.id)) return
  authors.value.push(author)
}

const decide = () => {
  emit('decide', authors.value)
  closeModal()
}

const isShowCreateModal = ref(false)
const openCreateModal = () => (isShowCreateModal.value = true)
</script>
