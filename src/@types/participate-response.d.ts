type ParticipateResponse = {
  id: number
  scenario: ScenarioResponse
  user: User
  role_types: Array<string>
  disp_order: number
}
