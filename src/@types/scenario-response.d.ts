type ScenarioResponse = {
  id: number
  name: string
  dictionary_names: Array<string>
  type: string
  rule_book: RuleBook | null
  url: string
  authors: Array<Author>
}
