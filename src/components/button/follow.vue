<template>
  <ButtonPrimary
    v-if="!isFollowing"
    icon="user-plus"
    label="フォローする"
    @click="follow"
  />
  <ButtonDanger
    v-if="isFollowing"
    icon="user-minus"
    label=""
    @click="unfollow"
  />
</template>

<script setup lang="ts">
import { followUser, unfollowUser } from '~/components/api/user-api'

interface Props {
  from: User
  target: User | UserResponse
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'follow'): void
  (e: 'unfollow'): void
}>()

const isFollowing = computed(() => {
  return props.from.follows.some((f) => {
    return f === props.target.id
  })
})

const follow = async () => {
  await followUser(props.target.id)
  emit('follow')
}

const unfollow = async () => {
  await unfollowUser(props.target.id)
  emit('unfollow')
}
</script>
