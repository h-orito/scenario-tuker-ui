type Participate = {
  id: number | null
  scenario_id: number
  user_id: number
  rule_book_ids: Array<number>
  role_types: Array<string>
  disp_order: number
  impression: ParticipateImpression | null
}
