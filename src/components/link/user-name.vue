<template>
  <NuxtLink :to="`/users/${user.id}`">
    {{ user.name }}
  </NuxtLink>
</template>

<script setup lang="ts">
// props
interface Props {
  user: User | UserResponse
}
defineProps<Props>()
</script>
