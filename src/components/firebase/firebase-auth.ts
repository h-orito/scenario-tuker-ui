import { User } from 'firebase/auth'
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  setTokenExpired,
  getTokenExpired
} from '~/components/auth/auth-cookie'

export const setAuthorizationCookie = async (user: User) => {
  const token = await user.getIdToken(true)
  await setAccessToken(token)
  await setRefreshToken(user.refreshToken)
  const { $dayjs } = useNuxtApp()
  const expired = $dayjs().add(50, 'm')
  await setTokenExpired(expired.format())
}

export const removeAuthorizationCookie = async () => {
  await setAccessToken('')
}

export const refreshAccessTokenIfNeeded = async (): Promise<string | null> => {
  const expired = getTokenExpired()
  if (!expired || expired === '') return null
  const { $dayjs } = useNuxtApp()
  const ex = $dayjs(expired)
  const now = $dayjs()
  if (now.isSameOrAfter(ex)) {
    const authState = (await useAuth()).value
    if (!authState.user) return null
    setAuthorizationCookie(authState.user)
  }

  return getAccessToken()
}
