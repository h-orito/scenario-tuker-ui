<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="rule-books"
        >ルールブック <span class="text-red-500">*</span></label
      >
    </div>
    <div>
      <div class="p-inputgroup mx-auto w-20rem">
        <InputText :disabled="true" :placeholder="selecting" />
        <ButtonPrimary label="選択" @click="openMasterSelectModal" />
      </div>
    </div>
    <div v-if="hasError" class="p-error text-xs">
      シナリオと同じゲームシステムのルールブックを選択してください。
    </div>
    <RuleBookSelectModal
      v-model:show="isShowSelectModel"
      :game-system-id="gameSystemId"
      @decide="decide"
    />
  </div>
</template>

<script setup lang="ts">
import RuleBookSelectModal from '~/components/pages/rule-books/rule-book-select-modal.vue'

interface Props {
  value: RuleBookResponse | null
  hasError: boolean
  gameSystemId: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: RuleBookResponse | null): RuleBookResponse | null
}>()

const value = computed({
  get: () => props.value,
  set: (value: RuleBookResponse | null) => emit('update:value', value)
})

const selecting = computed(() => {
  if (!value.value) return '選択されていません'
  return value.value.name
})

const isShowSelectModel = ref(false)
const openMasterSelectModal = () => (isShowSelectModel.value = true)
const decide = (ruleBook: RuleBookResponse) => {
  value.value = ruleBook
}
</script>
