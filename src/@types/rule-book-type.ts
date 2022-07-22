export const RuleBookType = {
  Base: {
    label: '基本ルールブック',
    value: 'Base'
  } as LabelValue,
  Supplement: {
    label: 'サプリメント',
    value: 'Supplement'
  } as LabelValue,
  Replay: {
    label: 'リプレイ',
    value: 'Replay'
  } as LabelValue
}

export type RuleBookType = typeof RuleBookType[keyof typeof RuleBookType]
export const AllRuleBookType: LabelValue[] = Object.values(RuleBookType)
