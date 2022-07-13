<template>
  <Modal
    v-model:show="isShow"
    :header="`シナリオ「${participate?.scenario.name}」の感想`"
    class="text-sm"
    close-button-name="キャンセル"
    @close="closeModal"
  >
    <div class="mb-5">
      <p v-if="role">役割: {{ role }}</p>
      <p v-if="range">公開範囲: {{ range }}</p>
    </div>
    <div v-if="impression" class="text-left pre-wrap break-word line-height-3">
      {{ impression.content }}
    </div>
    <div v-else>
      <p v-if="failureMessage">{{ failureMessage }}</p>
      <ButtonPrimary
        label="閲覧する"
        :disabled="!!failureMessage"
        @click="confirmToDisplay"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import { useConfirm } from 'primevue/useconfirm'
import { fetchParticipateImpression } from '~/components/api/participate-api'
import { AllRoleType } from '~/@types/role-type'
import { AllDisclosureRange } from '~/@types/disclosure-range'

// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

// data
const participate: Ref<ParticipateResponse | null> = ref(null)
const impression: Ref<ParticipateImpression | null> = ref(null)

const role = computed(() => {
  if (!participate.value) return null
  return participate.value.role_types
    .map((value) => AllRoleType.find((rt) => rt.value === value)?.label)
    .join('、')
})

const range = computed(() => {
  if (!participate.value?.impression) return null
  return AllDisclosureRange.find(
    (d) => d.value === participate.value?.impression?.disclosure_range
  )?.label
})

// confirm
const confirm = useConfirm()
const confirmToDisplay = () => {
  const spoilerMessage = participate.value?.impression?.has_spoiler
    ? '未通過NGの内容を含みます'
    : 'ネタバレなしです'
  confirm.require({
    message: `この感想は${spoilerMessage}。内容を表示しますか？`,
    header: '表示確認',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      const i = await fetchParticipateImpression(participate.value?.id || 0)
      if (i) {
        impression.value = i
      } else {
        failureMessage.value = 'あなたはこの感想を参照できません。'
      }
    }
  })
}
const failureMessage = ref('')

// init
const init = (target: ParticipateResponse) => {
  participate.value = target
}

defineExpose({
  init
})
</script>
