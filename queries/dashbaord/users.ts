import { useAPI } from '@@/services/baseApi'

export const useUsers = (page: Ref<number>, limit: Ref<number>) => {
  return useAPI({
    url: () => `/admin/users?page=${page.value}&limit=${limit.value}`,
    type: 'GET',
    queryKey: 'Users',
    isLazy: true,
  })
}

export const useBlockUser = (id: string | number) => {
  return useAPI({
    url: `/admin/users/block/${id}`,
    type: 'PUT',
    queryKey: 'Users',
    isLazy: true,
  })
}
