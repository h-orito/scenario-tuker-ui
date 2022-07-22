export const GameMasterRequirementType = {
  Require: {
    label: 'GM必須',
    value: 'Require'
  } as LabelValue,
  Less: {
    label: 'GMレス可',
    value: 'Less'
  } as LabelValue,
  NotRequire: {
    label: 'GM不要',
    value: 'NotRequire'
  } as LabelValue,
  Empty: {
    label: '未選択',
    value: ''
  } as LabelValue
}

export type GameMasterRequirementType =
  typeof GameMasterRequirementType[keyof typeof GameMasterRequirementType]
export const AllGameMasterRequirementType: LabelValue[] = Object.values(
  GameMasterRequirementType
)
