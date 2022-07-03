<template>
  <div class="flex justify-content-center bg-bluegray-900 w-full">
    <div class="flex text-center px-2 py-2">
      <NuxtLink to="/" class="title-font">Scenario Tuker</NuxtLink>
    </div>
    <div v-if="authState.myself" class="absolute right-2 flex py-2">
      <NuxtLink :to="{ path: `/users/${authState.myself.id}` }">
        <Button
          label=""
          class="p-button-lg p-button-rounded p-button-text text-white"
          icon="pi pi-user"
          icon-pos="left"
        />
      </NuxtLink>
    </div>
    <div v-else class="absolute right-2 flex py-2">
      <Button
        label="ログイン"
        class="login-button p-button-sm p-button-outlined p-button-text border-white text-white"
        icon="pi pi-user"
        icon-pos="left"
        @click="openSignInModal"
      />
      <SignInModal v-model:show="isShowSignInModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SignInModal from '~/components/firebase/sign-in-modal.vue'

const authState = await useAuth()

const isShowSignInModal = ref(false)
const openSignInModal = () => (isShowSignInModal.value = true)
</script>

<style lang="scss" scoped>
@import 'primeflex/primeflex.scss';
.right-2 {
  right: 0.5rem;
}
</style>

<style lang="scss">
@import 'primeflex/primeflex.scss';

@media screen and (max-width: $sm) {
  .login-button {
    .p-button-label {
      display: none;
    }
    .p-button-icon-left {
      margin-right: 0;
    }
  }
}
</style>
