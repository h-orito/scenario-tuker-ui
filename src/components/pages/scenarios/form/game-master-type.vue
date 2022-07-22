<template>
  <div class="field mb-4">
    <div>
      <label class="field-label" for="game-master-requirement"
        >ゲームマスター</label
      >
    </div>
    <SelectButton
      id="game-master-requirement"
      v-model="value"
      :options="candidates"
      option-label="label"
      option-value="value"
      :has-error="hasError"
    />
  </div>
</template>

<script setup lang="ts">
import { AllGameMasterRequirementType } from '~/@types/game-master-requirement-type'

interface Props {
  value: string
  hasError: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:value', value: string): string
}>()

const value = computed({
  get: () => props.value,
  set: (value: string) => emit('update:value', value)
})

const candidates = ref(AllGameMasterRequirementType)
</script>
