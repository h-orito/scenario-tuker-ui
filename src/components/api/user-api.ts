export const fetchUser = async (id: number): Promise<UserResponse | null> => {
  return await useApi<void, UserResponse | null>(`users/${id}`)
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

export const followUser = async (id: number): Promise<void> => {
  return await useApi<void, void>(`users/myself/follow`, {
    method: 'POST',
    body: {
      user_id: id
    }
  })
}

export const unfollowUser = async (id: number): Promise<void> => {
  return await useApi<void, void>(`users/myself/follow/${id}`, {
    method: 'DELETE'
  })
}
