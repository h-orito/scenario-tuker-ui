<template>
  <Modal
    v-model:show="isShow"
    header="更新履歴"
    class="text-sm"
    close-button-name="閉じる"
    @close="closeModal"
  >
    <div class="text-left text-xs md:text-sm">
      <ul>
        <li>2022/07/17 役割「PL」を追加、TRPGに「GM可」も追加</li>
        <li>2022/07/17 ネタバレ区分が常に「未通過NG」に見える不具合を修正</li>
        <li>2022/07/17 許可URLにDLSiteとBooth個人ショップを追加</li>
        <li>
          2022/07/17
          トップページからマダミスシナリオ一覧とTRPGシナリオ一覧で分岐
        </li>
        <li>2022/07/17 各一覧画面に検索条件を追加</li>
        <li>2022/07/17 参加記録を更新すると並び順が失われる不具合修正</li>
        <li>2022/07/17 ゲームシステムに検索用キーワードを追加</li>
        <li>
          2022/07/17 マダミスの役割にPC9~12を追加、TRPGの役割にGMとHO9~12を追加
        </li>
        <li>2022/07/17 ユーザー検索条件に「フォロー中のユーザー」を追加</li>
        <li>2022/07/17 個別ページから編集できるように変更</li>
        <li>2022/07/16 一般公開</li>
      </ul>
    </div>
  </Modal>
</template>

<script setup lang="ts">
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
</script>
