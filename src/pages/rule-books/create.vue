<template>
  <div>
    <Title>Scenario Tuker | ルールブック登録</Title>
    <RuleBookName v-model:value="name" :has-error="v$.name.$error" />
    <RuleBookDictionaryNames
      v-model:value="dictionaryNames"
      :has-error="v$.dictionaryNames.$error"
    />
    <ButtonPrimary label="確認画面へ" @click="confirm" />
    <ConfirmModal
      v-model:show="isConfirmModalShow"
      :rule-book="inputRuleBook"
    />
    <div class="mt-4">
      <NuxtLink to="/rule-books">
        <ButtonSecondary label="ルールブック一覧" />
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
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'
import { searchRuleBooks } from '~/components/api/rule-book-api'
import RuleBookName from '~/components/pages/rule-books/form/rule-book-name.vue'
import RuleBookDictionaryNames from '~/components/pages/rule-books/form/rule-book-dictionary-names.vue'
import ConfirmModal from '~/components/pages/rule-books/confirm-modal.vue'
const { withAsync } = helpers

const name = ref('')
const dictionaryNames = ref('')

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255),
    asyncValidator: withAsync(async () => {
      const ruleBooks = await searchRuleBooks({
        name: name.value
      })
      return ruleBooks.list.every((s) => s.name !== name.value)
    }),
    $lazy: true
  },
  dictionaryNames: {
    len: () => {
      const names = dictionaryNames.value.trim()
      return (
        names.length === 0 ||
        names
          .replace('\r\n', '\n')
          .split('\n')
          .every((dn) => {
            const length = dn.length
            return 0 < length && length <= 255
          })
      )
    }
  }
}

const v$ = useVuelidate(rules, {
  name,
  dictionaryNames
})

const confirm = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  openConfirmModal()
}

const isConfirmModalShow = ref(false)
const openConfirmModal = () => (isConfirmModalShow.value = true)

const inputRuleBook = computed(() => ({
  name: name.value,
  dictionaryNames: dictionaryNames.value
}))
</script>
