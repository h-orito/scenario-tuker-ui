<template>
  <div class="field mb-4">
    <div>
      <label for="scenario-rule-book">ルールブック</label>
    </div>
    <AutoComplete
      v-model="value"
      :suggestions="filteredRuleBooks"
      :dropdown="true"
      field="name"
      force-selection
      @complete="search($event)"
    />
    <div v-if="hasError" class="p-error text-xs">
      TRPGの場合はルールブックを選択してください。
    </div>
    <p>
      見つからない場合はお手数ですが<br />ルールブックを<NuxtLink
        to="/rule-books/create"
        target="_blank"
        >新規登録</NuxtLink
      >してください。
    </p>
  </div>
</template>

<script setup lang="ts">
import { searchRuleBooks } from '~/components/api/rule-book-api'

interface Props {
  value: RuleBook | null
  hasError: boolean
  ruleBooks: RuleBooks
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: RuleBook | null): string | null
}>()

const value = computed({
  get: () => props.value,
  set: (value: RuleBook | null) => emit('update:value', value)
})

const filteredRuleBooks = ref([...props.ruleBooks.list])
const search = async (event) => {
  if (!event.query.trim().length) {
    filteredRuleBooks.value = [...props.ruleBooks.list]
  } else {
    const searched = await searchRuleBooks({ name: event.query })
    filteredRuleBooks.value = searched.list
  }
}
</script>
