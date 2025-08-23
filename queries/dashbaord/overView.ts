import { useAPI } from '@@/services/baseApi'

export const useOverView = () => {
  return useAPI({
    url: () => `/admin/dashboard`,
    type: 'GET',
    queryKey: 'teamsAction',
    isLazy: true,
  })
}
