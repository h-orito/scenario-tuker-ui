<template>
  <footer class="w-full p-2 border-top-1 border-bluegray-200 text-xs">
    <ul>
      <li>
        要望、改善提案、不具合報告はTwitter
        <a href="https://twitter.com/ort_dev" target="_blank" rel="noreferrer">
          @ort_dev
        </a>
        までお願いします。
      </li>
      <li>
        投げ銭いただける方は
        <a href="#" @click="openKampaModal"> こちら </a>
        からお願いします。
      </li>
      <li>
        © 2022- ort（
        <a
          href="https://github.com/h-orito/dice-role-nuxt"
          target="_blank"
          rel="noreferrer"
        >
          Github
        </a>
        ）
      </li>
    </ul>
    <KampaModal v-model:show="isKampaModalShow" />
  </footer>
</template>

<script setup lang="ts">
import KampaModal from './kampaModal.vue'
const isKampaModalShow = ref(false)
const openKampaModal = (e) => {
  isKampaModalShow.value = true
  e.preventDefault()
}
</script>
