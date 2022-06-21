export const fetchRuleBooks = async (): Promise<RuleBooks> => {
  return await useApi<void, RuleBooks>(`rule-books`)
}

export const searchRuleBooks = async (
  query: RuleBookQuery
): Promise<RuleBooks> => {
  return await useApi<RuleBookQuery, RuleBooks>(`rule-books/search`, {
    params: query
  })
}

export const postRuleBook = async (ruleBook: RuleBook): Promise<RuleBook> => {
  return await useApi<RuleBook, RuleBook>(`rule-books`, {
    method: 'POST',
    body: {
      ...ruleBook
    }
  })
}
