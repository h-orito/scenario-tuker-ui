<template>
  <Modal
    v-model:show="isShow"
    header="ゲームシステム選択"
    class="text-sm"
    close-button-name="キャンセル"
    @close="closeModal"
  >
    <div class="grid p-fluid mb-2">
      <div class="col-12">
        <div class="p-inputgroup">
          <FormText
            v-model:value="name"
            :has-error="false"
            placeholder="ゲームシステム名"
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
        <DataTable
          :value="searchedGameSystems"
          :scrollable="true"
          class="p-datatable-sm text-xs sm:text-sm"
        >
          <Column field="name" header="ゲームシステム" />
          <Column header="">
            <template #body="slotProps">
              <ButtonPrimary label="選択" @click="decide(slotProps.data)" />
            </template>
          </Column>
          <template #empty>{{
            hasSearched
              ? 'ゲームシステムが見つかりません。'
              : 'ゲームシステム名で検索してください。'
          }}</template>
        </DataTable>
      </div>
      <div class="col-12">
        <p>
          見つからない場合はお手数ですが<br />ゲームシステムを<NuxtLink
            to="/game-systems/create"
            target="_blank"
            >新規登録</NuxtLink
          >してください。
        </p>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { searchGameSystems } from '~/components/api/game-system-api'

// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'decide', gameSystem: GameSystem): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

// data
const name = ref('')
const searchedGameSystems: Ref<Array<GameSystem>> = ref([])

const hasSearched = ref(false)
const search = async () => {
  hasSearched.value = true
  searchedGameSystems.value = (
    await searchGameSystems({
      name: name.value
    })
  ).list
}

const decide = (gameSystem: GameSystem) => {
  emit('decide', gameSystem)
  closeModal()
}
</script>
