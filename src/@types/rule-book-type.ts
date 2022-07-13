export const RuleBookType = {
  Base: {
    label: '基本ルールブック',
    value: 'Base'
  } as LabelValue,
  Supplement: {
    label: 'サプリメント',
    value: 'Supplement'
  } as LabelValue
}

export type RuleBookType = typeof RuleBookType[keyof typeof RuleBookType]
export const AllRuleBookType: LabelValue[] = Object.values(RuleBookType)
