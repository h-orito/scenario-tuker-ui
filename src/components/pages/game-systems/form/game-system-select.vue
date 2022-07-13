<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="game-system"
        >ゲームシステム <span class="text-red-500">*</span></label
      >
    </div>
    <div>
      <div class="p-inputgroup mx-auto w-20rem">
        <InputText :disabled="true" :placeholder="selecting" />
        <ButtonPrimary label="選択" @click="openMasterSelectModal" />
      </div>
    </div>
    <div v-if="hasError" class="p-error text-xs">
      ゲームシステムを選択してください。
    </div>
    <GameSystemSelectModal v-model:show="isShowSelectModel" @decide="decide" />
  </div>
</template>

<script setup lang="ts">
import GameSystemSelectModal from '~/components/pages/game-systems/game-system-select-modal.vue'

interface Props {
  value: GameSystem | null
  hasError: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: GameSystem | null): GameSystem | null
}>()

const value = computed({
  get: () => props.value,
  set: (value: GameSystem | null) => emit('update:value', value)
})

const selecting = computed(() => {
  if (!value.value) return '選択されていません'
  return value.value.name
})

const isShowSelectModel = ref(false)
const openMasterSelectModal = () => (isShowSelectModel.value = true)
const decide = (gameSystem: GameSystem | null) => {
  value.value = gameSystem
}
</script>
