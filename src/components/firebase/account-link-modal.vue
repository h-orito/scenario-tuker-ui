<template>
  <Modal v-model:show="isShow" header="他アカウント連携" class="text-sm">
    <p class="mt-2">
      追加でログインすると、現在ログインしているアカウントに紐付けることができます。<br />
      例えば、Twitter連携＋Google連携にしておくと、Twitter連携できなくなった場合もGoogleアカウントでログインすることができます。
    </p>
    <p class="p-error mb-2">
      なお、ログインしたことがあるアカウントで追加ログインすることはできません。
    </p>
    <div class="my-3">
      <hr class="mb-3" />
      <ButtonPrimary
        icon="twitter"
        label="Twitterログイン"
        :disabled="isAlreadyTwitterLinked"
        @click="linkTwitter"
      />
      <p v-if="isAlreadyTwitterLinked">既に連携済みです。</p>
      <p v-else>
        TwitterのIDで他の方からあなたを検索することができるようになります。
      </p>
    </div>
    <div class="my-3">
      <hr class="mb-3" />
      <ButtonPrimary
        icon="google"
        label="Googleログイン"
        :disabled="isAlreadyGoogleLinked"
        @click="linkGoogle"
      />
      <p v-if="isAlreadyGoogleLinked">既に連携済みです。</p>
      <p v-else>メールアドレスが表示されることはありません。</p>
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

const authState = await useAuth()

const isAlreadyTwitterLinked = computed(() => {
  return (authState.value.user as any).providerData.some(
    (info: any) => info.providerId === 'twitter.com'
  )
})
const isAlreadyGoogleLinked = computed(() => {
  return (authState.value.user as any).providerData.some(
    (info: any) => info.providerId === 'google.com'
  )
})

const { $linkTwitter, $linkGoogle } = useNuxtApp()

const linkTwitter = async () => {
  await $linkTwitter()
  location.reload()
}

const linkGoogle = async () => {
  await $linkGoogle()
  location.reload()
}
</script>
