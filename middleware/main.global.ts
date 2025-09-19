import { useGlobalStore } from '@@/stores/global'
import { RoleName } from '@@/utils/RoleName'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to) => {
  const { role, accessToken } = useGlobalStore()
  const toName = to.name?.toString() || ''

  if (!accessToken) {
    if (!toName.startsWith('auth')) {
      return navigateTo('/auth')
    }

    return
  }

  if (role !== RoleName.Admin) {
    return navigateTo('/auth')
  }

  if (toName.startsWith('auth')) {
    return navigateTo('/')
  }

  return true
})
