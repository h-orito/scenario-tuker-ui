<template>
  <div>
    <Title>Scenario Tuker | シナリオ製作者登録</Title>
    <AuthorName v-model:value="name" :has-error="v$.name.$error" />
    <ButtonPrimary label="確認画面へ" @click="confirm" />
    <ConfirmModal v-model:show="isConfirmModalShow" :author="inputAuthor" />
    <div class="mt-4">
      <NuxtLink to="/authors">
        <ButtonSecondary label="シナリオ製作者一覧" />
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
import { required, minLength, maxLength } from '@vuelidate/validators'
import AuthorName from '~/components/pages/authors/form/author-name.vue'
import ConfirmModal from '~/components/pages/authors/confirm-modal.vue'

const name = ref('')

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255)
  }
}

const v$ = useVuelidate(rules, {
  name
})

const confirm = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  openConfirmModal()
}

const isConfirmModalShow = ref(false)
const openConfirmModal = () => (isConfirmModalShow.value = true)

const inputAuthor = computed(() => ({
  name: name.value
}))
</script>
