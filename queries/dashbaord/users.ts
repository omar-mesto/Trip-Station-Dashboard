import { useAPI } from '@@/services/baseApi'

export const useUsers = () => {
  return useAPI({
    url: () => `/admin/users?page=1&limit=50`,
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
