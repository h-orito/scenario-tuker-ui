import { defineNuxtPlugin } from '#app'
import { FirebaseApp, initializeApp } from 'firebase/app'
import {
  Auth,
  getAuth,
  TwitterAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  signOut
} from 'firebase/auth'

declare module '#app' {
  interface NuxtApp {
    $firebaseApp: FirebaseApp
    $firebaseAuth: Auth
    $signInTwitter: () => void
    $signInGoogle: () => void
    $linkTwitter: () => void
    $linkGoogle: () => void
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
  nuxtApp.provide('signInTwitter', async () => await signInWithTwitter(auth))
  nuxtApp.provide('signInGoogle', async () => await signInWithGoogle(auth))
  nuxtApp.provide('linkTwitter', async () => await linkWithTwitter(auth))
  nuxtApp.provide('linkGoogle', async () => await linkWithGoogle(auth))
  nuxtApp.provide('signOut', async () => signOut(auth))
})

const signInWithTwitter = async (auth: Auth) => {
  let result = null
  try {
    result = await signInWithPopup(auth, new TwitterAuthProvider())
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
        twitter: {
          twitter_id: (user as any).reloadUserInfo?.providerUserInfo.find(
            (info: any) => info.providerId === 'twitter.com'
          )?.rawId,
          screen_name: (user as any).reloadUserInfo?.screenName,
          access_token: credential.accessToken,
          token_secret: credential.secret
        }
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const signInWithGoogle = async (auth: Auth) => {
  let result = null
  try {
    result = await signInWithPopup(auth, new GoogleAuthProvider())
  } catch ({ code, message }) {
    console.log(code, message)
  }
  if (!result) return
  try {
    const credential = GoogleAuthProvider.credentialFromResult(result)
    if (!credential) return
    const user = result.user
    console.log(user)
    await useApi<User, User>('users', {
      method: 'POST',
      body: {
        uid: user.uid,
        name: user.displayName
      }
    })
  } catch (e) {
    console.log(e)
  }
}

const linkWithTwitter = async (auth: Auth) => {
  if (!auth.currentUser) return
  try {
    await linkWithPopup(auth.currentUser, new TwitterAuthProvider())
  } catch ({ code, message }) {
    console.log(code, message)
  }
}

const linkWithGoogle = async (auth: Auth) => {
  if (!auth.currentUser) return
  try {
    await linkWithPopup(auth.currentUser, new GoogleAuthProvider())
  } catch ({ code, message }) {
    console.log(code, message)
  }
}
