import { Ref } from 'vue'
import { UseFetchOptions } from 'nuxt/dist/app/composables'
import { refreshAccessTokenIfNeeded } from '~/components/firebase/firebase-auth'

export const useApi = async <T, U>(
  url: string,
  options?: UseFetchOptions<T>
): Promise<U> => {
  const accessToken = await refreshAccessTokenIfNeeded()
  const headers = !!accessToken
    ? {
        authorization: `Bearer ${accessToken}`
      }
    : undefined

  const config = useRuntimeConfig()
  const { data, error } = (await useAsyncData(
    url,
    () =>
      $fetch(url, {
        ...options,
        headers,
        baseURL: config.apiBase
      }),
    {
      initialCache: false
    }
  )) as {
    data: Ref<unknown>
    error: Ref<Error | boolean>
  }

  if (error.value) {
    console.log(error.value)
    throw error
  }

  return data.value as U
}
