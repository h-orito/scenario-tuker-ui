<template>
  <footer class="w-full p-2 border-top-1 border-bluegray-200 text-xs">
    <div class="flex justify-content-center gap-2">
      <NuxtLink
        to="https://twitter.com/ort_dev"
        target="_blank"
        rel="noreferrer"
      >
        <Button icon="pi pi-twitter" class="p-button-rounded p-button-info" />
      </NuxtLink>
      <Button
        icon="pi pi-dollar"
        class="p-button-rounded p-button-info"
        @click="openKampaModal"
      />
      <NuxtLink
        to="https://github.com/h-orito/scenario-tuker-ui"
        target="_blank"
        rel="noreferrer"
      >
        <Button icon="pi pi-github" class="p-button-rounded p-button-info" />
      </NuxtLink>
    </div>
    <div class="flex justify-content-center mt-2">© 2022- ort</div>
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
