<template>
  <div>
    <Title>Scenario Tuker</Title>
    <div v-if="authState.myself">
      <div>ようこそ {{ authState.myself.name }} さん</div>
      <div class="mt-2">
        <ButtonDanger label="ログアウト" @click="signOut" />
      </div>
      <div class="mt-2">
        <NuxtLink :to="{ path: `/users/${authState.myself.id}` }">
          <ButtonPrimary label="マイページ" />
        </NuxtLink>
      </div>
    </div>
    <div v-else>
      <p>ログインするとあなたが通過したシナリオを管理することができます。</p>
      <ButtonPrimary label="ログインする" @click="openSignInModal" />
      <SignInModal v-model:show="isShowSignInModal" />
    </div>
    <div class="mt-2">
      <NuxtLink to="/users">
        <ButtonPrimary label="ユーザーを検索する" />
      </NuxtLink>
    </div>
    <div class="mt-2">
      <NuxtLink to="/scenarios">
        <ButtonPrimary label="シナリオ一覧" />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import SignInModal from '~/components/firebase/sign-in-modal.vue'

const isShowSignInModal = ref(false)
const openSignInModal = () => (isShowSignInModal.value = true)

const signOut = async () => {
  const { $signOut } = useNuxtApp()
  await $signOut()
  location.reload()
}

const authState = await useAuth()
</script>
