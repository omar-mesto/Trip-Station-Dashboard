import { useGlobalStore } from '@@/stores/global'
import { RoleName } from '@@/utils/RoleName'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  const { role, token } = useGlobalStore()
  const toName = to.name?.toString() || ''

  if (role === RoleName.Admin) {
    if (!token) {
      if (!toName.startsWith('admin-auth')) {
        return navigateTo('/admin/auth')
      }
      return
    }

    if (toName.startsWith('admin-auth') && to.fullPath !== '/') {
      return navigateTo('/')
    }
  }

  return true
})
