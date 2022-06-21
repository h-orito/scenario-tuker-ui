export const fetchScenarios = async (): Promise<ScenariosResponse> => {
  return await useApi<void, ScenariosResponse>(`scenarios`)
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
  console.log(scenario)
  return await useApi<Scenario, ScenarioResponse>(`scenarios`, {
    method: 'POST',
    body: {
      ...scenario
    }
  })
}
