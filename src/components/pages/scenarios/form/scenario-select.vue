<template>
  <div class="field mb-6">
    <div>
      <label class="field-label" for="scenario"
        >シナリオ <span class="text-red-500">*</span></label
      >
    </div>
    <div>
      <div class="p-inputgroup mx-auto w-20rem">
        <InputText :disabled="true" :placeholder="selecting" />
        <ButtonPrimary label="選択" @click="openMasterSelectModal" />
      </div>
    </div>
    <div v-if="hasError" class="p-error text-xs">
      シナリオを選択してください。
    </div>
    <ScenarioSelectModal
      v-model:show="isShowSelectModel"
      :type="type"
      :game-system-id="gameSystemId"
      @decide="decide"
    />
  </div>
</template>

<script setup lang="ts">
import ScenarioSelectModal from '~/components/pages/scenarios/scenario-select-modal.vue'
import { ScenarioType } from '~/@types/scenario-type'

interface Props {
  value: Scenario | null
  type: ScenarioType
  hasError: boolean
  gameSystemId?: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: Scenario | null): Scenario | null
}>()

const value = computed({
  get: () => props.value,
  set: (value: Scenario | null) => emit('update:value', value)
})

const selecting = computed(() => {
  if (!value.value) return '選択されていません'
  return value.value.name
})

const isShowSelectModel = ref(false)
const openMasterSelectModal = () => (isShowSelectModel.value = true)
const decide = (scenario: Scenario | null) => {
  value.value = scenario
}
</script>
