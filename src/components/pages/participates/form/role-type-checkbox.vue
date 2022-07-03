<template>
  <div class="field mb-4">
    <div class="grid">
      <div class="col-12">
        <label class="field-label" for="scenario-name">役割</label>
      </div>
      <div
        v-for="(role, idx) in roleTypeCandidates"
        :key="role.label"
        class="col-4 sm:col-3 lg:col-2"
      >
        <div class="field-checkbox">
          <Checkbox
            :id="`role-type${idx}`"
            v-model="values"
            name="role"
            :value="role.value"
          />
          <label :for="`role-type${idx}`">{{ role.label }}</label>
        </div>
      </div>
      <div v-if="hasError" class="col-12 p-error text-xs">
        1つ以上選択してください。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScenarioType } from '~/@types/scenario-type'
import { AllMuderMysteryRoleType, AllTrpgRoleType } from '~/@types/role-type'

// props
interface Props {
  roleTypes: Array<string>
  type: ScenarioType
  hasError: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:role-types', values: Array<string>): Array<string>
}>()

const values = computed({
  get: () => props.roleTypes,
  set: (value) => emit('update:role-types', value)
})

// role type
const roleTypeCandidates = computed(() => {
  if (props.type.value === ScenarioType.MurderMystery.value) {
    return AllMuderMysteryRoleType
  } else {
    return AllTrpgRoleType
  }
})
</script>
