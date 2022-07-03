export const fetchParticipateImpression = async (
  participateId: number
): Promise<ParticipateImpression | null> => {
  return await useApi<void, ParticipateImpression | null>(
    `participates/${participateId}/impression`
  )
}
