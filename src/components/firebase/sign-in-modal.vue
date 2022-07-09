<template>
  <Modal v-model:show="isShow" header="ログイン" class="text-sm">
    <p className="my-2">Twitterアカウントと連携してサインインしてください。</p>
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

const { $signInTwitter } = useNuxtApp()

const signInTwitter = async () => {
  await $signInTwitter()
  location.reload()
}
</script>
