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

export const deleteGameSystem = async (id: number): Promise<void> => {
  return await useApi<void, void>(`game-systems/${id}`, {
    method: 'DELETE'
  })
}

export const deleteGameSystemCheck = async (
  id: number
): Promise<CheckResponse> => {
  return await useApi<void, CheckResponse>(`game-systems/${id}/check`, {
    method: 'DELETE'
  })
}

export const integrateDeleteGameSystem = async (
  id: number,
  destId: number
): Promise<void> => {
  return await useApi<void, void>(`game-systems/${id}/integrate`, {
    method: 'PUT',
    body: {
      dest_id: destId
    }
  })
}

export const fetchGameSystemScenarios = async (
  id: number
): Promise<ScenariosResponse> => {
  return await useApi<void, ScenariosResponse>(`game-systems/${id}/scenarios`)
}
