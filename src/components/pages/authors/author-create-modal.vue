<template>
  <Modal
    v-model:show="isShow"
    header="シナリオ製作者登録"
    class="text-sm"
    submit-button-name="登録する"
    close-button-name="キャンセル"
    :submit-disabled="submitting"
    @submit="save"
    @close="closeModal"
  >
    <AuthorName v-model:value="name" :has-error="v$.name.$error" />
  </Modal>
</template>

<script setup lang="ts">
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength, helpers } from '@vuelidate/validators'
import { searchAuthors, postAuthor } from '~/components/api/author-api'
import AuthorName from '~/components/pages/authors/form/author-name.vue'
const { withAsync } = helpers

// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
  (e: 'save', author: Author): void
}>()

// modal
const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})
const closeModal = () => (isShow.value = false)

const name = ref('')

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255),
    asyncValidator: withAsync(async () => {
      const authors = await searchAuthors({
        name: name.value
      })
      return authors.list.every((s) => s.name !== name.value)
    }),
    $lazy: true
  }
}

const v$ = useVuelidate(rules, {
  name
})

const submitting = ref(false)
const save = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  submitting.value = true
  const saved = await postAuthor({
    name: name.value
  } as Author)
  submitting.value = false
  name.value = ''
  closeModal()
  emit('save', saved)
}
</script>
