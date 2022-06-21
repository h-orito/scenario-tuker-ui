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
  const { data, refresh, error } = (await useFetch(url, {
    ...options,
    headers,
    baseURL: config.apiBase
  })) as {
    data: Ref<unknown>
    refresh: () => Promise<void>
    error: Ref<Error | boolean>
  }
  if (options?.method == null || options?.method === 'GET') {
    // cacheされてしまうので2回取得する
    await refresh()
  }

  if (error.value) {
    console.log(error.value)
    throw error
  }
  return data.value as U
}
