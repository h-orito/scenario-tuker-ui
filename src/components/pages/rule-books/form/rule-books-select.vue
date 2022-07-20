<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="rule-books">ルールブック</label>
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
    <RuleBooksSelectModal
      v-model:show="isShowSelectModel"
      :game-system-id="gameSystemId"
      @decide="decide"
    />
  </div>
</template>

<script setup lang="ts">
import RuleBooksSelectModal from '~/components/pages/rule-books/rule-books-select-modal.vue'

interface Props {
  value: Array<RuleBook>
  hasError: boolean
  gameSystemId: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: Array<RuleBook>): Array<RuleBook>
}>()

const value = computed({
  get: () => props.value,
  set: (value: Array<RuleBook>) => emit('update:value', value)
})

const selecting = computed(() => {
  if (value.value.length <= 0) return '選択されていません'
  return value.value.map((a) => a.name).join('、')
})

const isShowSelectModel = ref(false)
const openMasterSelectModal = () => (isShowSelectModel.value = true)
const decide = (ruleBooks: Array<RuleBook>) => {
  value.value = ruleBooks
}
</script>
