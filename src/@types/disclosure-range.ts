export const DisclosureRange = {
  Everyone: {
    label: '誰でも',
    value: 'Everyone'
  } as LabelValue,
  Follower: {
    label: 'フォロワーのみ',
    value: 'Follower'
  } as LabelValue,
  EachFollow: {
    label: '相互フォローのみ',
    value: 'EachFollow'
  } as LabelValue,
  OnlyMe: {
    label: '自分のみ',
    value: 'OnlyMe'
  } as LabelValue
}

export type DisclosureRange =
  typeof DisclosureRange[keyof typeof DisclosureRange]
export const AllDisclosureRange: LabelValue[] = Object.values(DisclosureRange)
