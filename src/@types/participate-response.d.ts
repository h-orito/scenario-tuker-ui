type ParticipateResponse = {
  id: number
  scenario: ScenarioResponse
  user: User
  rule_books: Array<RuleBook>
  role_types: Array<string>
  disp_order: number
  impression: ParticipateImpression | null
}
