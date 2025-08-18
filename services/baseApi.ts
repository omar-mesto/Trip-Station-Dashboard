import { refreshNuxtData, useFetch } from 'nuxt/app'
import type { Ref } from 'vue'
import { useGlobalStore } from '@@/stores/global'

export function useAPI<T>(
    options: {
        url: MaybeRefOrGetter<string>,
        payload?: object | FormData,
        queryKey: string,
        isLazy?: boolean
        params?: { skip: Ref<number>, limit: Ref<number> }
        type: ('DELETE' | 'GET' | 'POST' | 'PUT')
    },
) {
    return useFetch(options.url, {
        $fetch: api,
        body: options.payload,
        params: { ...options.params },
        method: options.type,
        watch: false,
        onResponse: async () => await refreshNuxtData(options.queryKey),
    })
}
export const api = $fetch.create({
    baseURL: 'https://trip-station-production.up.railway.app/api',
    onRequest({ options }) {
        options.headers.set('Accept', 'application/json')
        options.headers.set('Authorization', `Bearer ${useGlobalStore().accessToken}`)
        options.headers.set('role', `${useGlobalStore().role}`)
    },

    onResponseError: (error) => {
        useErrorStore().setMessage(error.response._data.message)
    },
},
)
