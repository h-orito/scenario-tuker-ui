<template>
  <DataTable
    :value="items"
    :scrollable="true"
    class="p-datatable-sm text-xs sm:text-sm"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <Column header="シナリオ名">
      <template #body="slotProps">
        <NuxtLink :to="`/scenarios/${slotProps.data.id}`">
          {{ slotProps.data.name }}
        </NuxtLink>
        <span v-if="slotProps.data.url">
          &nbsp;
          <NuxtLink @click="confirmToMoveExternal(slotProps.data.url)">
            <i class="pi pi-external-link"></i>
          </NuxtLink>
        </span>
      </template>
    </Column>
    <Column field="type" header="種別"></Column>
    <Column header="ゲームシステム">
      <template #body="slotProps">
        <NuxtLink
          v-if="slotProps.data.gameSystem"
          :to="`/game-systems/${slotProps.data.gameSystem.id}`"
        >
          {{ slotProps.data.gameSystem.name }}
        </NuxtLink>
      </template>
    </Column>
    <Column field="authors" header="製作者">
      <template #body="slotProps">
        <span v-for="(author, idx) in slotProps.data.authors" :key="author.id">
          <NuxtLink :to="`/authors/${author.id}`">{{ author.name }}</NuxtLink
          ><span v-if="idx < slotProps.data.authors.length - 1">、</span>
        </span>
      </template>
    </Column>
    <Column v-if="deletable" class="flex justify-content-end">
      <template #body="slotProps">
        <ButtonDanger
          icon="trash"
          label=""
          @click="deleteScenario(slotProps.data.id)"
        />
      </template>
    </Column>
    <template #empty>シナリオが登録されていません。</template>
  </DataTable>
</template>

<script setup lang="ts">
import { useConfirm } from 'primevue/useconfirm'
import { AllScenarioType } from '~/@types/scenario-type'

// props
interface Props {
  scenarios: Array<ScenarioResponse>
  deletable?: boolean
}
const props = defineProps<Props>()

// emits
const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

const items = computed(() =>
  props.scenarios.map((s) => ({
    id: s.id,
    name: s.name,
    url: s.url,
    type: AllScenarioType.find((st) => st.value === s.type)?.label,
    gameSystem: s.game_system,
    authors: s.authors
  }))
)

const confirm = useConfirm()
const deleteScenario = (id: number) => {
  confirm.require({
    message: '所有シナリオを削除しますか？',
    header: '削除確認',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      emit('delete', id)
    }
  })
}

const confirmToMoveExternal = (url: string) => {
  confirm.require({
    message: `外部サイト（${url}）に遷移します。`,
    header: '外部サイト遷移確認',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      window.open(url)
    }
  })
}
</script>
