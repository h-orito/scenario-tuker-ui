<template>
  <div>
    <LayoutGoogleAds />
    <LayoutDefaultHeader />
    <div class="p-2 sm:p-3 w-full max-w-lg mx-auto">
      <slot />
    </div>
    <LayoutDefaultFooter />
  </div>
</template>
