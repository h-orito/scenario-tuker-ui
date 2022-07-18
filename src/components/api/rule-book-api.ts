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

export const deleteRuleBook = async (id: number): Promise<void> => {
  return await useApi<void, void>(`rule-books/${id}`, {
    method: 'DELETE'
  })
}

export const deleteRuleBookCheck = async (
  id: number
): Promise<CheckResponse> => {
  return await useApi<void, CheckResponse>(`rule-books/${id}/check`, {
    method: 'DELETE'
  })
}

export const integrateDeleteRuleBook = async (
  id: number,
  destId: number
): Promise<void> => {
  return await useApi<void, void>(`rule-books/${id}/integrate`, {
    method: 'PUT',
    body: {
      dest_id: destId
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
