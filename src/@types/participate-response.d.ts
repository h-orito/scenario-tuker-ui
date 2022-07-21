type ParticipateResponse = {
  id: number
  scenario: ScenarioResponse
  user: User
  rule_books: Array<RuleBook>
  role_names: Array<string>
  disp_order: number
  impression: ParticipateImpression | null
  term: ParticipateTerm | null
  player_num: number | null
  game_master: string | null
  player_names: string | null
  required_hours: number | null
  memo: string | null
}
