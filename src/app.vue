<template>
  <div class="text-xs sm:text-sm">
    <client-only>
      <NuxtLayout>
        <LayoutDefaultHeader />
        <NuxtPage class="p-2 sm:p-3 w-full max-w-lg mx-auto" />
        <LayoutDefaultFooter />
      </NuxtLayout>
      <ConfirmDialog></ConfirmDialog>
    </client-only>
  </div>
</template>

<script setup lang="ts">
import ConfirmDialog from 'primevue/confirmdialog'
</script>

<style lang="scss">
@import 'primeflex/primeflex.scss';

@media screen and (min-width: $lg) {
  .max-w-lg {
    max-width: $lg;
  }
}
</style>
