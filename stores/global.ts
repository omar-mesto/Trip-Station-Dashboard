import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
    const accessToken = ref('')
    const fullName = ref('')
    const email = ref('')
    const role = ref<string>()

    const logout = () => {
        accessToken.value = ''
        role.value = undefined
        useRouter().push({ path: '/admin/auth' })
    }

    return { role, accessToken, fullName, email, logout }
}, {
    persist: {
        pick: ['accessToken', 'role', 'fullName', 'email'],
    },

})
