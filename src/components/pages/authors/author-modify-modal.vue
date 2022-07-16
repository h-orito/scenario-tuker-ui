<template>
  <Modal
    v-model:show="isShow"
    header="シナリオ製作者編集"
    class="text-sm"
    submit-button-name="更新する"
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
import { searchAuthors, putAuthor } from '~/components/api/author-api'
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

const id = ref(0)
const name = ref('')

const init = (author: Author) => {
  id.value = author.id
  name.value = author.name
}

const rules = {
  name: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(255),
    asyncValidator: withAsync(async () => {
      const authors = await searchAuthors({
        name: name.value
      })
      return authors.list.every((a) => {
        if (a.id === id.value) return true
        return a.name !== name.value
      })
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
  const saved = await putAuthor({
    id: id.value,
    name: name.value
  } as Author)
  submitting.value = false
  v$.value.$reset()
  closeModal()
  emit('save', saved)
}

defineExpose({
  init
})
</script>
