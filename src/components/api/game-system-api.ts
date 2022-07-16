export const fetchGameSystems = async (): Promise<GameSystems> => {
  return await useApi<void, GameSystems>(`game-systems`)
}

export const fetchGameSystem = async (id: number): Promise<GameSystem> => {
  return await useApi<void, GameSystem>(`game-systems/${id}`)
}

export const searchGameSystems = async (
  query: GameSystemQuery
): Promise<GameSystems> => {
  return await useApi<GameSystemQuery, GameSystems>(`game-systems/search`, {
    params: query
  })
}

export const postGameSystem = async (
  gameSystem: GameSystem
): Promise<GameSystem> => {
  return await useApi<GameSystem, GameSystem>(`game-systems`, {
    method: 'POST',
    body: {
      ...gameSystem
    }
  })
}

export const putGameSystem = async (
  gameSystem: GameSystem
): Promise<GameSystem> => {
  return await useApi<GameSystem, GameSystem>(`game-systems`, {
    method: 'PUT',
    body: {
      ...gameSystem
    }
  })
}

export const fetchGameSystemScenarios = async (
  id: number
): Promise<ScenariosResponse> => {
  return await useApi<void, ScenariosResponse>(`game-systems/${id}/scenarios`)
}
