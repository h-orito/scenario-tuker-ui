type ScenarioResponse = {
  id: number
  name: string
  dictionary_names: Array<string>
  type: string
  url: string | null
  game_system: GameSystem | null
  authors: Array<Author>
  game_master_requirement: string | null
  player_num_min: number | null
  player_num_max: number | null
  required_hours: number | null
}
