<template>
  <div class="text-sm">
    <NuxtLayout>
      <LayoutDefaultHeader />
      <NuxtPage class="p-1 sm:p-3 w-full max-w-lg mx-auto" />
      <LayoutDefaultFooter />
    </NuxtLayout>
  </div>
</template>

<style lang="scss">
@import 'primeflex/primeflex.scss';

@media screen and (min-width: $lg) {
  .max-w-lg {
    max-width: $lg;
  }
}
</style>
