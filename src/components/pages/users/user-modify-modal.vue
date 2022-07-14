<template>
  <Modal
    v-model:show="isShow"
    header="ユーザー情報編集"
    class="text-sm"
    submit-button-name="変更する"
    :submit-disabled="submitting"
    close-button-name="キャンセル"
    @submit="save"
    @close="closeModal"
  >
    <div>
      <UserName v-model:value="name" :has-error="v$.name.$error" />
      <p>他の方からユーザー名であなたを検索することができます。</p>
      <UserIntroduction
        v-model:value="introduction"
        :has-error="v$.introduction.$error"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'
import UserName from './form/user-name.vue'
import UserIntroduction from './form/user-introduction.vue'
import { putMyself } from '~/components/api/myself-api'

// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'save'): void
}>()

const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})

onMounted(async () => {
  const myself = (await useAuth()).value.myself
  name.value = myself?.name || ''
  introduction.value = myself?.introduction || ''
})

const name = ref('')
const introduction = ref('')
const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(50)
  },
  introduction: {
    maxLength: maxLength(10000)
  }
}
const v$ = useVuelidate(rules, {
  name,
  introduction
})

const closeModal = () => (isShow.value = false)
const submitting = ref(false)
const save = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  submitting.value = true
  await putMyself({
    name: name.value,
    introduction: introduction.value
  })
  submitting.value = false
  emit('save')
  isShow.value = false
}
</script>
