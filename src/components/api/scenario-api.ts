export const fetchScenarios = async (): Promise<ScenariosResponse> => {
  return await useApi<void, ScenariosResponse>(`scenarios`)
}

export const fetchPopularScenarios = async (
  type: string
): Promise<ScenariosResponse> => {
  return await useApi<void, ScenariosResponse>(`scenarios/popular/${type}`)
}

export const fetchScenario = async (id: number): Promise<ScenarioResponse> => {
  return await useApi<void, ScenarioResponse>(`scenarios/${id}`)
}

export const fetchScenarioAlso = async (
  id: number
): Promise<ScenariosResponse> => {
  return await useApi<void, ScenariosResponse>(`scenarios/${id}/also`)
}

export const searchScenarios = async (
  query: ScenarioQuery
): Promise<ScenariosResponse> => {
  return await useApi<ScenarioQuery, ScenariosResponse>(`scenarios/search`, {
    params: query
  })
}

export const postScenario = async (
  scenario: Scenario
): Promise<ScenarioResponse> => {
  return await useApi<Scenario, ScenarioResponse>(`scenarios`, {
    method: 'POST',
    body: {
      ...scenario
    }
  })
}

export const putScenario = async (
  scenario: Scenario
): Promise<ScenarioResponse> => {
  return await useApi<Scenario, ScenarioResponse>(`scenarios`, {
    method: 'PUT',
    body: {
      ...scenario
    }
  })
}

export const deleteScenario = async (id: number): Promise<void> => {
  return await useApi<void, void>(`scenarios/${id}`, {
    method: 'DELETE'
  })
}

export const deleteScenarioCheck = async (
  id: number
): Promise<CheckResponse> => {
  return await useApi<void, CheckResponse>(`scenarios/${id}/check`, {
    method: 'DELETE'
  })
}

export const integrateDeleteScenario = async (
  id: number,
  destId: number
): Promise<void> => {
  return await useApi<void, void>(`scenarios/${id}/integrate`, {
    method: 'PUT',
    body: {
      dest_id: destId
    }
  })
}

export const fetchScenarioParticipates = async (
  request: ParticipatesFetchRequest
): Promise<ParticipatesResponse> => {
  return await useApi<void, ParticipatesResponse>(
    `scenarios/${request.scenario_id}/participates`,
    {
      params: {
        is_twitter_following: request.is_twitter_following
      }
    }
  )
}

type ParticipatesFetchRequest = {
  scenario_id: number
  is_twitter_following: boolean
}
