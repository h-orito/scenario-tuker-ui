export const fetchUser = async (id: number): Promise<User | null> => {
  return await useApi<void, User | null>(`users/${id}`)
}

export const searchUser = async (query: UserQuery): Promise<Users> => {
  return await useApi<UserQuery, Users>(`users/search`, {
    params: query
  })
}

export const fetchUserParticipates = async (
  id: number
): Promise<ParticipatesResponse> => {
  return await useApi<void, ParticipatesResponse>(`users/${id}/participates`)
}

export const fetchUserRuleBooks = async (
  id: number
): Promise<RuleBooksResponse> => {
  return await useApi<void, RuleBooksResponse>(`users/${id}/rule-books`)
}

export const fetchUserScenarios = async (
  id: number
): Promise<ScenariosResponse> => {
  return await useApi<void, ScenariosResponse>(`users/${id}/scenarios`)
}
