import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useGlobalStore = defineStore('globalStore', () => {
  const accessToken = ref('')
  const fullName = ref('')
  const email = ref('')
  const role = ref<string>()
  const image = ref('')

  const router = useRouter()

  const logout = () => {
    accessToken.value = ''
    role.value = undefined
    router.push('/admin/auth')
  }

  return { role, image, accessToken, fullName, email, logout }
}, {
  persist: {
    pick: ['accessToken', 'image', 'role', 'fullName', 'email'],
  },
})
