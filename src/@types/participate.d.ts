type Participate = {
  id: number | null
  scenario_id: number
  user_id: number
  rule_book_ids: Array<number>
  role_names: Array<string>
  disp_order: number
  impression: ParticipateImpression | null
  player_num: number | null
  game_master: string | null
  player_names: string | null
  required_hours: number | null
  memo: string | null
}
