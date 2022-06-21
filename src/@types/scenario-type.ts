export const ScenarioType = {
  MurderMystery: {
    label: 'マーダーミステリー',
    value: 'MurderMystery'
  } as LabelValue,
  Trpg: {
    label: 'TRPG',
    value: 'Trpg'
  } as LabelValue
}

export type ScenarioType = typeof ScenarioType[keyof typeof ScenarioType]
export const AllScenarioType: LabelValue[] = Object.values(ScenarioType)
