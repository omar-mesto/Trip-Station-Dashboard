import { useAPI } from '@@/services/baseApi'
import type { CountryPayload } from '~/models/countriesModel'

export const useCountries = (page: Ref<number>, limit: Ref<number>) => {
  return useAPI({
    url: () => `/countries?page=${page.value}&limit=${limit.value}`,
    type: 'GET',
    queryKey: 'Country',
    isLazy: true,
  })
}

export const useDeleteCountry = (id: string) => {
  return useAPI({
    url: `/countries/${id}`,
    type: 'DELETE',
    queryKey: 'Country',
    isLazy: true,
  })
}

export const useCreateCountry = (country: CountryPayload | FormData) => {
  return useAPI({ url: '/countries', payload: country, queryKey: 'Country', type: 'POST' })
}

export const useUpdateCountry = (country: CountryPayload | FormData, id: string) => {
  return useAPI({ url: `/countries/${id}`, payload: country, queryKey: 'Country', type: 'PUT' })
}
