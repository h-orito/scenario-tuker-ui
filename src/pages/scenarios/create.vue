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
    <ButtonPrimary label="確認画面へ" @click="confirm" />
    <ConfirmModal v-model:show="isConfirmModalShow" :scenario="inputScenario" />
    <div class="mt-4">
      <NuxtLink to="/scenarios">
        <ButtonSecondary label="シナリオ一覧へ" />
      </NuxtLink>
    </div>
    <div class="mt-2">
      <NuxtLink to="/">
        <ButtonSecondary label="トップページへ" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'
import { ScenarioType, AllScenarioType } from '~/@types/scenario-type'
import ScenarioName from '~/components/pages/scenarios/scenario-name.vue'
import ScenarioDictionaryNames from '~/components/pages/scenarios/scenario-dictionary-names.vue'
import ScenarioTypeSelect from '~/components/pages/scenarios/scenario-type.vue'
import ScenarioRuleBook from '~/components/pages/scenarios/scenario-rule-book.vue'
import ConfirmModal from '~/components/pages/scenarios/confirm-modal.vue'
import { fetchRuleBooks } from '~/components/api/rule-book-api'

const name = ref('')
const dictionaryNames = ref('')
const type: Ref<string> = ref(ScenarioType.MurderMystery.value)
const ruleBook: Ref<RuleBook | null> = ref(null)

const isTrpg = computed(() => type.value == ScenarioType.Trpg.value)
const ruleBooks = await fetchRuleBooks()

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255)
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
  }
}

const v$ = useVuelidate(rules, {
  name,
  dictionaryNames,
  type,
  ruleBook
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
      : ruleBook.value
}))
</script>
