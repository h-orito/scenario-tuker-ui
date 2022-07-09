import { onAuthStateChanged } from 'firebase/auth'
import {
  removeAuthorizationCookie,
  setAuthorizationCookie
} from '~/components/firebase/firebase-auth'
import { fetchMyself } from '~/components/api/myself-api'

export default defineNuxtRouteMiddleware(async () => {
  if (!process.client) return
  const authState = await auth()
  useAuth(authState)
})

const auth = async (): Promise<AuthState> => {
  const { $firebaseAuth } = useNuxtApp()
  return new Promise((resolve) => {
    onAuthStateChanged($firebaseAuth, async (user) => {
      const authState: AuthState = {
        isSignedIn: user != null,
        user,
        userId: user?.uid,
        userName: user?.displayName,
        myself: null
      }
      if (!user) {
        await removeAuthorizationCookie()
        resolve(authState)
        return
      }
      await setAuthorizationCookie(user)
      authState.myself = await fetchMyself()
      resolve(authState)
    })
  })
}
