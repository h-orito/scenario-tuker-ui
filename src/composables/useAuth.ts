import { Ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import {
  removeAuthorizationCookie,
  setAuthorizationCookie
} from '~/components/firebase/firebase-auth'

export const useAuth = async () => {
  const authState: Ref<AuthState> = useState('authState', () => ({
    isSignedIn: false,
    user: null,
    userId: undefined,
    userName: null,
    myself: null
  }))
  onMounted(async () => {
    const { $firebaseAuth } = useNuxtApp()
    onAuthStateChanged($firebaseAuth, async (user) => {
      const newState: AuthState = {
        isSignedIn: user != null,
        user,
        userId: user?.uid,
        userName: user?.displayName,
        myself: null
      }
      authState.value = newState
      if (!user) {
        await removeAuthorizationCookie()
        return
      }
      await setAuthorizationCookie(user)
      const myself = await useApi<User, User>('users', {
        method: 'POST',
        body: {
          uid: authState.value.userId,
          name: authState.value.userName,
          twitter_user_name: (user as any).reloadUserInfo?.screenName
        }
      })
      authState.value = {
        ...newState,
        myself
      }
    })
  })
  return authState
}
