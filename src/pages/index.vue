<template>
  <div>
    <Title>Scenario Tuker</Title>
    <div class="hidden md:block relative">
      <img class="top-image" src="/image/top.webp" />
      <p class="title-font top-title">Scenario Tuker</p>
      <p class="top-description">
        Scenario Tukerは<br />マーダーミステリーや<br />TRPGで通過したシナリオを<br />管理・共有できるサービスです
      </p>
    </div>
    <div class="md:hidden relative">
      <img class="top-image" src="/image/top-sm.webp" />
      <p class="title-font top-title-sm">Scenario Tuker</p>
      <p class="top-description-sm">
        Scenario Tukerは<br />マーダーミステリーや<br />TRPGで通過したシナリオを<br />管理・共有できるサービスです
      </p>
    </div>
    <div class="my-4 w-full p-5">
      <h2>通過記録や所持シナリオ・ルールブックを一括管理</h2>
      <p>
        通過したシナリオだけでなく、<br />持っているシナリオやルールブックを管理したり、<br />閲覧制限付きで感想も登録できます。
      </p>
      <h2 class="mt-5">マダミス・TRPGデータベース</h2>
      <p>
        シナリオやルールブック、<br />製作者のデータベースとしても利用できます。
      </p>
      <h2 class="mt-5">ランキングやレコメンドも</h2>
      <p>
        人気のシナリオや、<br />一緒によく通過されているシナリオを探せます。
      </p>
    </div>
    <div class="my-4 md:mb-8 bg-gray-200 w-full p-5">
      <h2>ログイン</h2>
      <div v-if="authState.myself" class="grid align-content-center">
        <div class="col-12 mb-2 md:mb-4">
          ようこそ
          <strong class="text-lg">{{ authState.myself.name }}</strong> さん
        </div>
        <div class="col-12 md:col-6 flex flex-column justify-content-end">
          <p>
            名前を変更したり、通過シナリオを管理したり、<br />
            通過した感想を登録することができます。
          </p>
          <NuxtLink :to="{ path: `/users/${authState.myself.id}` }">
            <ButtonPrimary label="マイページ" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6 flex flex-column justify-content-end">
          <div class="mb-3">
            <ButtonPrimary
              label="他SNSアカウント連携"
              @click="openAccountLinkModal"
            />
            <AccountLinkModal v-model:show="isShowAccountLinkModal" />
          </div>
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
      <h2>ユーザー</h2>
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
      <h2>マーダーミステリー</h2>
      <div class="grid">
        <div class="col-12 md:col-6 flex flex-column justify-content-end">
          <p>
            登録されているマーダーミステリーのシナリオを確認することができます。<br />
            シナリオ詳細では、そのシナリオの通過記録や、<br />
            そのシナリオを通過した人がよく通過している他のシナリオも確認できます。
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
        <div class="col-12 md:col-6 flex flex-column justify-content-end">
          <p>
            よく通過されているマーダーミステリーのシナリオのランキングを確認することができます。<br />
            シナリオ詳細では、そのシナリオの通過記録や、<br />
            そのシナリオを通過した人がよく通過している他のシナリオも確認できます。
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
      <h2>TRPG</h2>
      <div class="grid">
        <div class="col-12 md:col-6 flex flex-column justify-content-end">
          <p>
            登録されているTRPGシナリオを確認することができます。<br />
            シナリオ詳細では、そのシナリオの通過記録や、<br />
            そのシナリオを通過した人がよく通過している他のシナリオも確認できます。
          </p>
          <NuxtLink
            :to="{
              name: 'scenarios',
              query: { type: ScenarioType.Trpg.value }
            }"
          >
            <ButtonPrimary label="TRPGシナリオ一覧" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6 flex flex-column justify-content-end">
          <p>
            よく通過されているTRPGのシナリオのランキングを確認することができます。<br />
            シナリオ詳細では、そのシナリオの通過記録や、<br />
            そのシナリオを通過した人がよく通過している他のシナリオも確認できます。
          </p>
          <NuxtLink
            :to="{
              path: '/scenarios/trend',
              query: { type: ScenarioType.Trpg.value }
            }"
          >
            <ButtonPrimary label="人気のTRPGシナリオ" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6 flex flex-column justify-content-end">
          <p>
            登録されているルールブックを確認することができます。<br />
            ルールブック詳細では、そのルールブックが使用されている通過記録も確認できます。
          </p>
          <NuxtLink to="/rule-books">
            <ButtonPrimary label="ルールブック一覧" />
          </NuxtLink>
        </div>
        <div class="col-12 md:col-6 flex flex-column justify-content-end">
          <p>
            登録されているゲームシステムを確認することができます。<br />
            ゲームシステム詳細では、そのゲームシステムを利用したシナリオも確認できます。
          </p>
          <NuxtLink to="/game-systems">
            <ButtonPrimary label="ゲームシステム一覧" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="my-4 md:my-8 w-full p-5 bg-gray-200">
      <h2>シナリオ製作者</h2>
      <div class="grid">
        <div class="col-12 flex flex-column justify-content-end">
          <p>
            登録されているシナリオ製作者を確認することができます。<br />
            シナリオ製作者詳細では、その製作者が製作したシナリオも確認できます。
          </p>
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
import AccountLinkModal from '~/components/firebase/account-link-modal.vue'
import ReleaseNoteModal from '~/components/pages/index/release-note-modal.vue'
import { ScenarioType } from '~/@types/scenario-type'

const isShowSignInModal = ref(false)
const openSignInModal = () => (isShowSignInModal.value = true)

const isShowAccountLinkModal = ref(false)
const openAccountLinkModal = () => (isShowAccountLinkModal.value = true)

const signOut = async () => {
  const { $signOut } = useNuxtApp()
  await $signOut()
  location.reload()
}

const authState = await useAuth()

const isShowReleaseNoteModal = ref(false)
const openReleaseNoteModal = () => (isShowReleaseNoteModal.value = true)

definePageMeta({
  layout: 'top'
})
</script>

<style lang="scss" scoped>
@import 'primeflex/primeflex.scss';

.logo {
  max-width: 80%;
}

.top-image {
  width: 100%;
  height: 100vh;
  object-fit: cover;
}
.top-title {
  @include styleclass('absolute text-right');
  font-size: 5vw !important;
  top: 20%;
  right: 20px;
}

.top-title-sm {
  @include styleclass('absolute text-right text-5xl');
  top: 10%;
  right: 10px;
}
.top-description {
  @include styleclass('absolute text-white text-2xl');
  bottom: 20px;
  right: 20px;
  text-align: right;
}

.top-description-sm {
  @include styleclass('absolute text-white text-xl');
  bottom: 10px;
  right: 10px;
  text-align: right;
}
</style>
