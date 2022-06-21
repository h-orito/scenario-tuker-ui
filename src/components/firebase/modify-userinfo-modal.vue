<template>
  <Modal v-model:show="isShow" header="ユーザー情報編集" class="text-sm">
    <div class="field mb-4">
      <div>
        <label for="user-name">ユーザー名</label>
      </div>
      <FormText
        id="user-name"
        v-model:value="userName"
        class="w-20rem"
        :has-error="v$.userName.$error"
      />
      <div v-if="v$.userName.$error" class="p-error text-xs">
        ユーザー名は1~20字で入力してください。
      </div>
    </div>
    <div class="my-3">
      <ButtonPrimary label="保存する" :disabled="submitting" @click="save" />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { Ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, maxLength } from '@vuelidate/validators'

// props
interface Props {
  show: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'update:show', value: boolean): boolean
}>()

const isShow = computed({
  get: () => props.show,
  set: (value: boolean | undefined) => emit('update:show', value ?? false)
})

const userName = ref('')

onMounted(async () => {
  const { data } = (await useFetch(`${useRoot()}api/user`, {
    headers: useRequestHeaders(['cookie'])
  })) as { data: Ref<DiceRoleUser> }
  userName.value = data.value.userName
})

const rules = {
  userName: {
    required,
    minLength: minLength(1),
    maxLength: maxLength(20)
  }
}

const v$ = useVuelidate(rules, { userName })

const submitting = ref(false)
const save = async () => {
  const isValid = await v$.value.$validate()
  if (!isValid) return
  submitting.value = true

  const userInfo: DiceRoleUser = {
    userName: userName.value
  }
  await useFetch(`${useRoot()}api/modify-user`, {
    headers: useRequestHeaders(['cookie']),
    method: 'POST',
    body: {
      user: userInfo
    }
  })

  submitting.value = false
  isShow.value = false
}
</script>
