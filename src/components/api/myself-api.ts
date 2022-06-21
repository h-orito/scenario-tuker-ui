export const deleteParticipates = async (id: number): Promise<void> => {
  return await useApi<void, void>(`users/myself/participates/${id}`, {
    method: 'DELETE'
  })
}

export const postMyself = async (user: User): Promise<User> => {
  return await useApi<User, User>(`users/myself`, {
    method: 'PUT',
    body: user
  })
}

export const postParticipates = async (
  participate: Participate
): Promise<ParticipateResponse> => {
  return await useApi<Participate, ParticipateResponse>(
    `users/myself/participates`,
    {
      method: 'POST',
      body: participate
    }
  )
}

export const putParticipates = async (
  participate: Participate
): Promise<ParticipateResponse> => {
  return await useApi<Participate, ParticipateResponse>(
    `users/myself/participates`,
    {
      method: 'PUT',
      body: participate
    }
  )
}
