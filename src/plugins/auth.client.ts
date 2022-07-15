import { defineNuxtPlugin } from '#app'
import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  Auth,
  getAuth,
  TwitterAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth'

declare module '#app' {
  interface NuxtApp {
    $firebaseApp: FirebaseApp
    $firebaseAuth: Auth
    $signInTwitter: () => void
    $signOut: () => void
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const firebaseConfig = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain
  }

  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)
  nuxtApp.provide('firebaseApp', app)
  nuxtApp.provide('firebaseAuth', auth)
  nuxtApp.provide(
    'signInTwitter',
    async () => await signIn(auth, new TwitterAuthProvider())
  )
  nuxtApp.provide('signOut', async () => signOut(auth))
})

const signIn = async (auth: Auth, provider: TwitterAuthProvider) => {
  let result = null
  try {
    result = await signInWithPopup(auth, provider)
  } catch ({ code, message }) {
    console.log(code, message)
  }
  if (!result) return
  try {
    const credential = TwitterAuthProvider.credentialFromResult(result)
    if (!credential) return
    const user = result.user
    await useApi<User, User>('users', {
      method: 'POST',
      body: {
        uid: user.uid,
        name: user.displayName,
        screen_name: (user as any).reloadUserInfo?.screenName,
        access_token: credential.accessToken,
        token_secret: credential.secret
      }
    })
  } catch (e) {
    console.log(e)
  }
}
