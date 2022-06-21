<template>
  <div>
    <div v-if="authState.myself">
      <div>ようこそ {{ authState.myself.name }} さん</div>
      <div class="mt-2">
        <ButtonPrimary
          label="ユーザー情報を編集する"
          @click="openUserMofifyModal"
        />
        <UserModifyModal
          v-model:show="isShowUserModifyModel"
          @save="updateName"
        />
      </div>
      <div class="mt-2">
        <ButtonDanger label="ログアウト" @click="signOut" />
      </div>
      <div class="mt-2">
        <NuxtLink :to="{ path: `/users/${authState.myself.id}` }">
          <ButtonPrimary label="通過したシナリオを管理する" />
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
  </div>
</template>

<script setup lang="ts">
import SignInModal from '~/components/firebase/sign-in-modal.vue'
import UserModifyModal from '~/components/pages/users/user-modify-modal.vue'

const isShowSignInModal = ref(false)
const openSignInModal = () => (isShowSignInModal.value = true)

const signOut = async () => {
  const { $signOut } = useNuxtApp()
  await $signOut()
}

const authState = await useAuth()

const isShowUserModifyModel = ref(false)
const openUserMofifyModal = () => (isShowUserModifyModel.value = true)
const updateName = (name: string) => {
  authState.value = {
    ...authState.value,
    myself: {
      ...authState.value.myself,
      name
    }
  }
}
</script>
