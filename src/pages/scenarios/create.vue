<template>
  <div>
    <Title>Scenario Tuker | シナリオ登録</Title>
    <ScenarioName v-model:value="name" :has-error="v$.name.$error" />
    <ScenarioDictionaryNames
      v-model:value="dictionaryNames"
      :has-error="v$.dictionaryNames.$error"
    />
    <ScenarioTypeSelect v-model:value="type" :has-error="v$.type.$error" />
    <ScenarioRuleBook
      v-if="isTrpg"
      v-model:value="ruleBook"
      :has-error="v$.ruleBook.$error"
      :rule-books="ruleBooks"
    />
    <ScenarioUrl v-model:value="url" :has-error="v$.url.$error" />
    <ScenarioAuthors v-model:value="authors" />
    <ButtonPrimary label="確認画面へ" @click="confirm" />
    <ConfirmModal v-model:show="isConfirmModalShow" :scenario="inputScenario" />
    <div class="mt-4">
      <NuxtLink to="/scenarios">
        <ButtonSecondary label="シナリオ一覧" />
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
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'
import { ScenarioType, AllScenarioType } from '~/@types/scenario-type'
import { availableDomains } from '~/components/pages/scenarios/form/scenario-url-domain'
import { fetchRuleBooks } from '~/components/api/rule-book-api'
import { searchScenarios } from '~/components/api/scenario-api'
import ScenarioName from '~/components/pages/scenarios/form/scenario-name.vue'
import ScenarioDictionaryNames from '~/components/pages/scenarios/form/scenario-dictionary-names.vue'
import ScenarioTypeSelect from '~/components/pages/scenarios/form/scenario-type.vue'
import ScenarioRuleBook from '~/components/pages/scenarios/form/scenario-rule-book.vue'
import ScenarioUrl from '~/components/pages/scenarios/form/scenario-url.vue'
import ScenarioAuthors from '~/components/pages/scenarios/form/scenario-authors.vue'
import ConfirmModal from '~/components/pages/scenarios/confirm-modal.vue'
const { withAsync } = helpers

const name = ref('')
const dictionaryNames = ref('')
const type: Ref<string> = ref(ScenarioType.MurderMystery.value)
const ruleBook: Ref<RuleBook | null> = ref(null)
const url = ref('')
const authors: Ref<Array<Author>> = ref([])

const isTrpg = computed(() => type.value == ScenarioType.Trpg.value)
const ruleBooks = await fetchRuleBooks()

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255),
    asyncValidator: withAsync(async () => {
      const scenarios = await searchScenarios({
        name: name.value,
        rule_book_id: null,
        type: type.value
      })
      return scenarios.list.every((s) => s.name !== name.value)
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
  },
  type: {
    required,
    enum: () => {
      return AllScenarioType.some((st) => st.value === type.value)
    }
  },
  ruleBook: {
    trpg: () => {
      return type.value === ScenarioType.MurderMystery.value || !!ruleBook.value
    }
  },
  url: {
    domain: () => {
      if (url.value === '') return true
      return availableDomains.some((domain) => url.value.startsWith(domain))
    }
  }
}

const v$ = useVuelidate(rules, {
  name,
  dictionaryNames,
  type,
  ruleBook,
  url
})

const confirm = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  openConfirmModal()
}

const isConfirmModalShow = ref(false)
const openConfirmModal = () => (isConfirmModalShow.value = true)

const inputScenario = computed(() => ({
  name: name.value,
  dictionaryNames: dictionaryNames.value,
  type: type.value,
  ruleBook:
    type.value !== ScenarioType.Trpg.value || !ruleBook.value
      ? null
      : ruleBook.value,
  url: url.value,
  authors: authors.value
}))
</script>
