export const DisclosureRange = {
  Everyone: {
    label: '誰でも',
    value: 'Everyone'
  } as LabelValue,
  OnlyMe: {
    label: '自分のみ',
    value: 'OnlyMe'
  } as LabelValue
}

export type DisclosureRange =
  typeof DisclosureRange[keyof typeof DisclosureRange]
export const AllDisclosureRange: LabelValue[] = Object.values(DisclosureRange)
