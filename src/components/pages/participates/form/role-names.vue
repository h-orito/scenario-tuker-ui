<template>
  <div class="field mb-6">
    <div>
      <label class="field-label" for="scenario-name"
        >役割 <span class="text-red-500">*</span></label
      >
    </div>
    <div v-if="hasError" class="col-12 p-error text-xs">
      1つ以上選択してください。
    </div>
    <div class="mt-2">
      <p v-if="roleNames.length <= 0">設定されていません</p>
      <Button
        v-for="roleName in roleNames"
        :key="roleName"
        :label="roleName"
        icon="pi pi-times"
        class="p-button-primary p-button-sm ml-1"
        @click="remove(roleName)"
      />
    </div>
    <div class="flex justify-content-center">
      <div class="bg-gray-200 mt-2 pt-2 pb-4 w-full md:w-9">
        <div>
          <p>役割追加</p>
          <div class="p-inputgroup mx-auto w-20rem">
            <FormText
              v-model:value="roleText"
              :has-error="false"
              placeholder="役割（50字以内）"
            />
            <ButtonPrimary
              label="追加"
              :disabled="roleText.length <= 0 || 50 <= roleText.length"
              @click="add"
            />
          </div>
        </div>
        <div class="mt-2">
          <Button
            v-for="roleName in candidates"
            :key="roleName"
            :label="roleName"
            icon="pi pi-plus"
            class="p-button-primary p-button-sm ml-2 py-1 px-2"
            @click="addText(roleName)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScenarioType } from '~/@types/scenario-type'

// props
interface Props {
  roleNames: Array<string>
  type: ScenarioType
  hasError: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:role-names', values: Array<string>): Array<string>
}>()

const values = computed({
  get: () => props.roleNames,
  set: (value) => emit('update:role-names', value)
})

// role type
const roleText = ref('')
const add = () => {
  if (values.value.every((rn) => rn !== roleText.value)) {
    values.value = values.value.concat(roleText.value)
  }
  roleText.value = ''
}
const remove = (roleName: string) => {
  values.value = values.value.filter((rn) => rn !== roleName)
}
const addText = (name: string) => (roleText.value = roleText.value + name)

const candidates = [
  'GM',
  'GM可',
  'KP',
  'KP可',
  'PL',
  'HO',
  'PC',
  '視聴',
  '現行',
  '参加',
  '通過予定'
]
</script>
