import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
    const token = ref('')
    const name = ref('')
    const email = ref('')
    const role = ref<string>()

    const logout = () => {
        token.value = ''
        role.value = undefined
        useRouter().push({ path: '/admin/auth' })
    }

    return { role, token, name, email, logout }
}, {
    persist: {
        pick: ['token', 'role', 'name', 'email'],
    },

})
