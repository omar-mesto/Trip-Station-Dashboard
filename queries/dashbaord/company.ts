import { useAPI } from '@@/services/baseApi'
import type { Company, CompanyPayload } from '~/models/companiesModel'

export const useCompanies = (page: Ref<number>, limit: Ref<number>) => {
  return useAPI({
    url: () => `/companies?page=${page.value}&limit=${limit.value}`,
    type: 'GET',
    queryKey: 'company',
    isLazy: true,
  })
}

export const useDeleteCompany = (id: string) => {
  return useAPI({
    url: `/companies/${id}`,
    type: 'DELETE',
    queryKey: 'company',
    isLazy: true,
  })
}

export const useCreateCompany = (company: CompanyPayload) => {
  return useAPI({
    url: '/companies',
    payload: company,
    queryKey: 'Company',
    type: 'POST',
  })
}

export const useUpdateCompany = (company: CompanyPayload, id: string) => {
  return useAPI({
    url: `/companies/${id}`,
    payload: company,
    queryKey: 'Company',
    type: 'PUT',
  })
}
