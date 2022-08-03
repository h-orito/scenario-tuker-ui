<template>
  <div class="text-xs sm:text-sm">
    <client-only>
      <NuxtLayout>
        <NuxtPage />
        <ConfirmDialog></ConfirmDialog>
      </NuxtLayout>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog'

const route = useRoute()
const siteName = 'Scenario Tuker'
const description =
  'マーダーミステリーやTRPGで通過したシナリオを管理・共有できるサービスです'
const baseUrl = 'https://scenario-tuker.netlify.app/'
useHead({
  meta: [
    {
      hid: 'description',
      name: 'description',
      content: description
    },
    {
      hid: 'keywords',
      name: 'keywords',
      content:
        'シナリオ,ツーカー,マーダーミステリー,TRPG,テーブルトークロールプレイングゲーム,マダミス'
    },
    {
      hid: 'og:site_name',
      property: 'og:site_name',
      content: siteName
    },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    {
      hid: 'og:url',
      property: 'og:url',
      content: baseUrl
    },
    { hid: 'og:title', property: 'og:title', content: siteName },
    { hid: 'og:description', property: 'og:description', content: description },
    {
      hid: 'og:image',
      property: 'og:image',
      content: `${baseUrl}image/top.webp`
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@ort_dev' }
  ]
})
</script>

<style lang="scss">
@import 'primeflex/primeflex.scss';

@media screen and (min-width: $lg) {
  .max-w-lg {
    max-width: $lg;
  }
}
</style>
