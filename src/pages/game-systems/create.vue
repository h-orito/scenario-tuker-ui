<template>
  <div>
    <Title>Scenario Tuker | ゲームシステム登録</Title>
    <GameSystemName v-model:value="name" :has-error="v$.name.$error" />
    <ButtonPrimary label="確認画面へ" @click="confirm" />
    <ConfirmModal
      v-model:show="isConfirmModalShow"
      :game-system="inputGameSystem"
    />
    <div class="mt-4">
      <NuxtLink to="/game-systems">
        <ButtonSecondary label="ゲームシステム一覧" />
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
import { searchGameSystems } from '~/components/api/game-system-api'
import GameSystemName from '~/components/pages/game-systems/form/game-system-name.vue'
import ConfirmModal from '~/components/pages/game-systems/confirm-modal.vue'
const { withAsync } = helpers

const name = ref('')

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255),
    asyncValidator: withAsync(async () => {
      const gameSystems = await searchGameSystems({
        name: name.value
      })
      return gameSystems.list.every((s) => s.name !== name.value)
    }),
    $lazy: true
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

const inputGameSystem = computed(() => ({
  name: name.value
}))
</script>
