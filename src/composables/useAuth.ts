import { Ref } from 'vue'

export const useAuth = async (state: AuthState | null = null) => {
  const authState: Ref<AuthState> = useState('authState', () => ({
    isSignedIn: false,
    user: null,
    userId: undefined,
    userName: null,
    myself: null
  }))
  if (state) {
    authState.value = state
  }
  return authState
}
