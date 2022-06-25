import { onAuthStateChanged } from 'firebase/auth'
import {
  removeAuthorizationCookie,
  setAuthorizationCookie
} from '~/components/firebase/firebase-auth'

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
        return
      }
      await setAuthorizationCookie(user)
      const myself = await useApi<User, User>('users', {
        method: 'POST',
        body: {
          uid: authState.userId,
          name: authState.userName,
          twitter_user_name: (user as any).reloadUserInfo?.screenName
        }
      })
      authState.myself = myself
      resolve(authState)
    })
  })
}
