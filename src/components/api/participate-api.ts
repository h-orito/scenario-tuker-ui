export const fetchParticipateImpression = async (
  participateId: number
): Promise<ParticipateImpression | null> => {
  return await useApi<void, ParticipateImpression | null>(
    `participates/${participateId}/impression`
  )
}

export const fetchParticipate = async (
  participateId: number
): Promise<ParticipateResponse | null> => {
  return await useApi<void, ParticipateResponse | null>(
    `participates/${participateId}`
  )
}
