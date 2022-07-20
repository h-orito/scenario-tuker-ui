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
    <div v-if="hasError && !sameGameSystem" class="p-error text-xs">
      シナリオを選択してください。
    </div>
    <div v-if="hasError && sameGameSystem" class="p-error text-xs">
      同一ゲームシステムのシナリオを選択してください。
    </div>
    <ScenariosSelectModal
      v-model:show="isShowSelectModel"
      :type="type"
      :game-system-id="gameSystemId"
      @decide="decide"
    />
  </div>
</template>

<script setup lang="ts">
import ScenariosSelectModal from '~/components/pages/scenarios/scenarios-select-modal.vue'
import { ScenarioType } from '~/@types/scenario-type'

interface Props {
  value: Array<Scenario>
  type: ScenarioType
  hasError: boolean
  gameSystemId?: number | null
  sameGameSystem?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: Array<Scenario>): Array<Scenario>
}>()

const value = computed({
  get: () => props.value,
  set: (value: Array<Scenario>) => emit('update:value', value)
})

const selecting = computed(() => {
  if (value.value.length <= 0) return '選択されていません'
  return value.value.map((s) => s.name).join('、')
})

const isShowSelectModel = ref(false)
const openMasterSelectModal = () => (isShowSelectModel.value = true)
const decide = (scenarios: Array<Scenario>) => {
  value.value = scenarios
}
</script>
