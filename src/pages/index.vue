<template>
  <div>
    <Title>Scenario Tuker</Title>
    <div class="my-5 mx-2">
      <img class="logo" src="/image/logo.png" />
    </div>
    <div class="my-8">
      <p class="text-lg">
        Scenario Tukerは、マーダーミステリーやTRPGで通過したシナリオを<br />管理・共有できるサービスです。
      </p>
    </div>
    <div class="my-4 md:my-8 bg-gray-200 w-full p-5">
      <div v-if="authState.myself" class="grid align-content-center">
        <div class="col-12 mb-2 md:mb-4">
          ようこそ
          <strong class="text-lg">{{ authState.myself.name }}</strong> さん
        </div>
        <div class="col-12 md:col-6">
          <p>
            名前を変更したり、通過シナリオを管理したり、<br />
            通過した感想を登録することができます。
          </p>
          <NuxtLink :to="{ path: `/users/${authState.myself.id}` }">
            <ButtonPrimary label="マイページ" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6 flex flex-column justify-content-end">
          <div>
            <ButtonDanger label="ログアウト" @click="signOut" />
          </div>
        </div>
      </div>
      <div v-else>
        <p>
          ログインするとあなたが通過したシナリオを管理したり、<br />
          閲覧制限付きの感想を参照することができます。
        </p>
        <ButtonPrimary label="ログイン" @click="openSignInModal" />
        <SignInModal v-model:show="isShowSignInModal" />
      </div>
    </div>
    <div class="my-4 md:my-8 w-full p-5 bg-gray-200">
      <div class="grid">
        <div class="col-12">
          <p>ユーザーを検索して通過したシナリオを閲覧することができます。</p>
          <NuxtLink to="/users">
            <ButtonPrimary label="ユーザー検索" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="my-4 md:my-8 w-full p-5 bg-gray-200">
      <div class="grid">
        <div class="col-12 md:col-6">
          <p>
            登録されているマーダーミステリーのシナリオを確認することができます。
          </p>
          <NuxtLink
            :to="{
              name: 'scenarios',
              query: { type: ScenarioType.MurderMystery.value }
            }"
          >
            <ButtonPrimary label="マーダーミステリーシナリオ一覧" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6">
          <p>
            よく通過されているマーダーミステリーのシナリオを確認することができます。
          </p>
          <NuxtLink
            :to="{
              path: '/scenarios/trend',
              query: { type: ScenarioType.MurderMystery.value }
            }"
          >
            <ButtonPrimary label="人気のマーダーミステリーシナリオ" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="my-4 md:my-8 w-full p-5 bg-gray-200">
      <div class="grid">
        <div class="col-12 md:col-6">
          <p>登録されているTRPGシナリオを確認することができます。</p>
          <NuxtLink
            :to="{
              name: 'scenarios',
              query: { type: ScenarioType.Trpg.value }
            }"
          >
            <ButtonPrimary label="TRPGシナリオ一覧" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6">
          <p>よく通過されているTRPGのシナリオを確認することができます。</p>
          <NuxtLink
            :to="{
              path: '/scenarios/trend',
              query: { type: ScenarioType.Trpg.value }
            }"
          >
            <ButtonPrimary label="人気のTRPGシナリオ" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6">
          <p>登録されているルールブックを確認することができます。</p>
          <NuxtLink to="/rule-books">
            <ButtonPrimary label="ルールブック一覧" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6">
          <p>登録されているゲームシステムを確認することができます。</p>
          <NuxtLink to="/game-systems">
            <ButtonPrimary label="ゲームシステム一覧" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6">
          <p>登録されているシナリオ製作者を確認することができます。</p>
          <NuxtLink to="/authors">
            <ButtonPrimary label="シナリオ製作者一覧" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="my-2 w-full p-5">
      <ButtonPrimary label="更新履歴" @click="openReleaseNoteModal" />
      <ReleaseNoteModal v-model:show="isShowReleaseNoteModal" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SignInModal from '~/components/firebase/sign-in-modal.vue'
import ReleaseNoteModal from '~/components/pages/index/release-note-modal.vue'
import { ScenarioType } from '~/@types/scenario-type'

const isShowSignInModal = ref(false)
const openSignInModal = () => (isShowSignInModal.value = true)

const signOut = async () => {
  const { $signOut } = useNuxtApp()
  await $signOut()
  location.reload()
}

const authState = await useAuth()

const isShowReleaseNoteModal = ref(false)
const openReleaseNoteModal = () => (isShowReleaseNoteModal.value = true)
</script>

<style lang="scss" scoped>
.logo {
  max-width: 80%;
}
</style>
