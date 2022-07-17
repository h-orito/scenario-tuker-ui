<template>
  <div v-if="isProduction">
    <component
      :is="'script'"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0917187897820609"
      crossorigin="anonymous"
    ></component>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const isProduction = computed((): boolean => {
  return config.nodeEnv === 'production'
})
</script>
