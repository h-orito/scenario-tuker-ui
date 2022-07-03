export const deleteParticipates = async (id: number): Promise<void> => {
  return await useApi<void, void>(`users/myself/participates/${id}`, {
    method: 'DELETE'
  })
}

export const fetchMyself = async (): Promise<User | null> => {
  return await useApi<void, User | null>(`users/myself`)
}

export const putMyself = async (name: string): Promise<User> => {
  return await useApi<any, User>(`users/myself`, {
    method: 'PUT',
    body: { name }
  })
}

export const postParticipates = async (
  request: ParticipatePostRequest
): Promise<ParticipateResponse> => {
  return await useApi<ParticipatePostRequest, ParticipateResponse>(
    `users/myself/participates`,
    {
      method: 'POST',
      body: request
    }
  )
}

export const putParticipates = async (
  request: ParticipatePostRequest
): Promise<ParticipateResponse> => {
  return await useApi<ParticipatePostRequest, ParticipateResponse>(
    `users/myself/participates`,
    {
      method: 'PUT',
      body: request
    }
  )
}

type ParticipatePostRequest = {
  id?: number
  scenario_id: number
  role_types: Array<string>
  disp_order?: number
  impression: ParticipateImpression | null
}
