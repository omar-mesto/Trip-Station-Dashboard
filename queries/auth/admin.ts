import { useAPI } from '@@/services/baseApi'
import type { adminModel } from '~/models/adminModel'

export const useLoginAdmin = (user: adminModel) => {
  return useAPI({ url: '/auth/login', payload: user, queryKey: 'admin', type: 'POST' })
}

export const useLogout = () => {
  return useAPI({ url: '/auth/logout', queryKey: 'logout', type: 'POST' })
}
