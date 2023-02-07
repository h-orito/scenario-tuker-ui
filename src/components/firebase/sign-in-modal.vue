<template>
  <Modal v-model:show="isShow" header="ログイン" class="text-sm">
    <p class="mt-2">
      いずれかのアカウントと連携してログインしてください。<br />
    </p>
    <p class="p-error mb-2">
      既存のアカウントに別のログイン方法を紐付けたい場合は、まず既存のアカウントでログインしてください。<br />
      ログインしたことがあるアカウントは後から追加で紐付けることができないので、ご注意ください。
    </p>
    <div class="my-3">
      <hr class="mb-3" />
      <ButtonPrimary
        icon="twitter"
        label="Twitterログイン"
        @click="signInTwitter"
      />
      <p>
        ユーザー名およびTwitterのIDで他の方からあなたを検索することができます。<br />
        名前はログイン後にマイページで変更することができます。
      </p>
    </div>
    <div class="my-3">
      <hr class="mb-3" />
      <ButtonPrimary
        icon="google"
        label="Googleログイン"
        @click="signInGoogle"
      />
      <p>
        ユーザー名で他の方からあなたを検索することができます。<br />
        ユーザー名はログイン後にマイページで変更することができます。<br />
        メールアドレスが表示されることはありません。
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
interface Props {
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
}>()

const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})

const { $signInTwitter, $signInGoogle } = useNuxtApp()

const signInTwitter = async () => {
  await $signInTwitter()
  location.reload()
}

const signInGoogle = async () => {
  await $signInGoogle()
  location.reload()
}
</script>
