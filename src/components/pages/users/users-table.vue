<template>
  <DataTable
    :value="users"
    :scrollable="true"
    class="p-datatable-sm"
    responsive-layout="scroll"
  >
    <Column field="name" header="ユーザー">
      <template #body="slotProps">
        <LinkUserName :user="slotProps.data" />
      </template>
    </Column>
    <Column v-if="isShowFollow" class="justify-content-end">
      <template #body="slotProps">
        <ButtonFollow
          :from="myself"
          :target="slotProps.data"
          @follow="$emit('follow')"
          @unfollow="$emit('unfollow')"
        />
      </template>
    </Column>
    <template #empty>ユーザーがいません。</template>
  </DataTable>
</template>

<script setup lang="ts">
// props
interface Props {
  users: Array<User>
  myself: User | null
  isShowFollow: boolean
}
defineProps<Props>()

// emits
defineEmits<{
  (e: 'follow'): void
  (e: 'unfollow'): void
}>()
</script>
