export const fetchRuleBooks = async (): Promise<RuleBooksResponse> => {
  return await useApi<void, RuleBooksResponse>(`rule-books`)
}

export const fetchRuleBook = async (
  id: number
): Promise<RuleBookResponse | null> => {
  return await useApi<void, RuleBookResponse>(`rule-books/${id}`)
}

export const searchRuleBooks = async (
  query: RuleBookQuery
): Promise<RuleBooksResponse> => {
  return await useApi<RuleBookQuery, RuleBooksResponse>(`rule-books/search`, {
    params: query
  })
}

export const postRuleBook = async (
  ruleBook: RuleBook
): Promise<RuleBookResponse> => {
  return await useApi<RuleBook, RuleBookResponse>(`rule-books`, {
    method: 'POST',
    body: {
      ...ruleBook
    }
  })
}

export const putRuleBook = async (
  ruleBook: RuleBook
): Promise<RuleBookResponse> => {
  return await useApi<RuleBook, RuleBookResponse>(`rule-books`, {
    method: 'PUT',
    body: {
      ...ruleBook
    }
  })
}

export const fetchRuleBookParticipates = async (
  id: number
): Promise<ParticipatesResponse> => {
  return await useApi<void, ParticipatesResponse>(
    `rule-books/${id}/participates`
  )
}
