type AuthState = {
  isSignedIn: boolean
  user: import('firebase/auth').User | null
  userId: string | undefined
  userName: string | undefined | null
  myself: User | null
}
