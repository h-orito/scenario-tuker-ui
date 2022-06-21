import { defineNuxtPlugin } from '#app'
import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  Auth,
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth'

declare module '#app' {
  interface NuxtApp {
    $firebaseApp: FirebaseApp
    $firebaseAuth: Auth
    $signInGoogle: () => void
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
  nuxtApp.provide('signInGoogle', async () =>
    signIn(auth, new GoogleAuthProvider())
  )
  nuxtApp.provide('signInTwitter', async () =>
    signIn(auth, new TwitterAuthProvider())
  )
  nuxtApp.provide('signOut', async () => signOut(auth))
})

const signIn = async (
  auth: Auth,
  provider: TwitterAuthProvider | GoogleAuthProvider
) => {
  try {
    await signInWithPopup(auth, provider)
  } catch ({ code, message }) {
    console.log(code, message)
  }
}
