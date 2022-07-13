export const fetchScenarios = async (): Promise<ScenariosResponse> => {
  return await useApi<void, ScenariosResponse>(`scenarios`)
}

export const fetchScenario = async (id: number): Promise<ScenarioResponse> => {
  return await useApi<void, ScenarioResponse>(`scenarios/${id}`)
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

export const fetchScenarioParticipates = async (
  id: number
): Promise<ParticipatesResponse> => {
  return await useApi<void, ParticipatesResponse>(
    `scenarios/${id}/participates`
  )
}
