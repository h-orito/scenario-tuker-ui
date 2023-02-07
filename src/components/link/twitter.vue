<template>
  <NuxtLink v-if="user.twitter" :to="twitterUrl" target="_blank">
    <ButtonPrimary icon="twitter" label="" />
  </NuxtLink>
</template>

<script setup lang="ts">
// props
interface Props {
  user: User
}
const props = defineProps<Props>()

const twitterUrl = computed(
  () => `https://twitter.com/${props.user.twitter.screen_name}`
)
</script>
