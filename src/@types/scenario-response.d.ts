type ScenarioResponse = {
  id: number
  name: string
  dictionary_names: Array<string>
  type: string
  url: string | null
  game_system: GameSystem | null
  authors: Array<Author>
}
