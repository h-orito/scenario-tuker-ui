<template>
  <NuxtLink v-if="user.twitter_user_name" :to="twitterUrl" target="_blank">
    <ButtonPrimary icon="twitter" label="" />
  </NuxtLink>
</template>

<script setup lang="ts">
// props
interface Props {
  user: User | UserResponse
}
const props = defineProps<Props>()

const twitterUrl = computed(
  () => `https://twitter.com/${props.user.twitter_user_name}`
)
</script>
