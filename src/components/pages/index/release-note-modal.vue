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
        <li>
          2022/07/22
          参加記録に任意項目「日程」「プレイ時間」「PL人数」「GM」「参加PL」「ひとことメモ」を追加
        </li>
        <li>2022/07/20 所有シナリオの一括登録機能追加</li>
        <li>2022/07/20 参加記録の一括登録機能追加</li>
        <li>2022/07/20 参加記録のルールブックを任意項目に変更</li>
        <li>2022/07/20 役割を自由記入に変更</li>
        <li>
          2022/07/19
          ユーザーページの見た目を変更（マダミス/TRPGをタブ切り替え、参加数が多い方を初期表示）
        </li>
        <li>2022/07/19 許可URLにクトゥルフ神話TRPGやろうずwikiを追加</li>
        <li>
          2022/07/18
          ゲームシステム、ルールブック、シナリオの削除・統合削除機能を追加
        </li>
        <li>2022/07/17 一覧にページングを追加</li>
        <li>
          2022/07/17
          一度感想を開くと他の感想を開いた際に前の感想が表示されてしまう不具合を修正
        </li>
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
