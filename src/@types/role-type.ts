export const RoleType = {
  GameMaster: {
    label: 'GM',
    value: 'GameMaster'
  } as LabelValue,
  Keeper: {
    label: 'KP',
    value: 'Keeper'
  } as LabelValue,
  HandOut1: {
    label: 'HO1',
    value: 'HandOut1'
  } as LabelValue,
  HandOut2: {
    label: 'HO2',
    value: 'HandOut2'
  } as LabelValue,
  HandOut3: {
    label: 'HO3',
    value: 'HandOut3'
  } as LabelValue,
  HandOut4: {
    label: 'HO4',
    value: 'HandOut4'
  } as LabelValue,
  HandOut5: {
    label: 'HO5',
    value: 'HandOut5'
  } as LabelValue,
  HandOut6: {
    label: 'HO6',
    value: 'HandOut6'
  } as LabelValue,
  HandOut7: {
    label: 'HO7',
    value: 'HandOut7'
  } as LabelValue,
  HandOut8: {
    label: 'HO8',
    value: 'HandOut8'
  } as LabelValue,
  HandOut9: {
    label: 'HO9',
    value: 'HandOut9'
  } as LabelValue,
  HandOut10: {
    label: 'HO10',
    value: 'HandOut10'
  } as LabelValue,
  HandOut11: {
    label: 'HO11',
    value: 'HandOut11'
  } as LabelValue,
  HandOut12: {
    label: 'HO12',
    value: 'HandOut12'
  } as LabelValue,
  PlayerCharacter1: {
    label: 'PC1',
    value: 'PlayerCharacter1'
  } as LabelValue,
  PlayerCharacter2: {
    label: 'PC2',
    value: 'PlayerCharacter2'
  } as LabelValue,
  PlayerCharacter3: {
    label: 'PC3',
    value: 'PlayerCharacter3'
  } as LabelValue,
  PlayerCharacter4: {
    label: 'PC4',
    value: 'PlayerCharacter4'
  } as LabelValue,
  PlayerCharacter5: {
    label: 'PC5',
    value: 'PlayerCharacter5'
  } as LabelValue,
  PlayerCharacter6: {
    label: 'PC6',
    value: 'PlayerCharacter6'
  } as LabelValue,
  PlayerCharacter7: {
    label: 'PC7',
    value: 'PlayerCharacter7'
  } as LabelValue,
  PlayerCharacter8: {
    label: 'PC8',
    value: 'PlayerCharacter8'
  } as LabelValue,
  PlayerCharacter9: {
    label: 'PC9',
    value: 'PlayerCharacter9'
  } as LabelValue,
  PlayerCharacter10: {
    label: 'PC10',
    value: 'PlayerCharacter10'
  } as LabelValue,
  PlayerCharacter11: {
    label: 'PC11',
    value: 'PlayerCharacter11'
  } as LabelValue,
  PlayerCharacter12: {
    label: 'PC12',
    value: 'PlayerCharacter12'
  } as LabelValue,
  Audience: {
    label: '視聴',
    value: 'Audience'
  } as LabelValue,
  Participating: {
    label: '現行',
    value: 'Participating'
  } as LabelValue,
  Participant: {
    label: '参加',
    value: 'Participant'
  } as LabelValue,
  PlanningToParticipate: {
    label: '通過予定',
    value: 'PlanningToParticipate'
  } as LabelValue,
  AbleToGameMaster: {
    label: 'GM可',
    value: 'AbleToGameMaster'
  } as LabelValue,
  AbleToKeeper: {
    label: 'KP可',
    value: 'AbleToKeeper'
  } as LabelValue
}

export type RoleType = typeof RoleType[keyof typeof RoleType]
export const AllMuderMysteryRoleType: LabelValue[] = [
  RoleType.GameMaster,
  RoleType.PlayerCharacter1,
  RoleType.PlayerCharacter2,
  RoleType.PlayerCharacter3,
  RoleType.PlayerCharacter4,
  RoleType.PlayerCharacter5,
  RoleType.PlayerCharacter6,
  RoleType.PlayerCharacter7,
  RoleType.PlayerCharacter8,
  RoleType.PlayerCharacter9,
  RoleType.PlayerCharacter10,
  RoleType.PlayerCharacter11,
  RoleType.PlayerCharacter12,
  RoleType.Audience,
  RoleType.Participating,
  RoleType.Participant,
  RoleType.PlanningToParticipate,
  RoleType.AbleToGameMaster
]
export const AllTrpgRoleType: LabelValue[] = [
  RoleType.GameMaster,
  RoleType.Keeper,
  RoleType.HandOut1,
  RoleType.HandOut2,
  RoleType.HandOut3,
  RoleType.HandOut4,
  RoleType.HandOut5,
  RoleType.HandOut6,
  RoleType.HandOut7,
  RoleType.HandOut8,
  RoleType.HandOut9,
  RoleType.HandOut10,
  RoleType.HandOut11,
  RoleType.HandOut12,
  RoleType.Audience,
  RoleType.Participating,
  RoleType.Participant,
  RoleType.PlanningToParticipate,
  RoleType.AbleToKeeper
]
export const AllRoleType: LabelValue[] = Object.values(RoleType)
