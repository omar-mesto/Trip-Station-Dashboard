import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlobalStore = defineStore('globalStore', () => {
    const accessToken = ref('')
    const fullName = ref('')
    const email = ref('')
    const role = ref<string>()
    const image = ref('')

    const logout = () => {
        accessToken.value = ''
        role.value = undefined
        useRouter().push({ path: '/admin/auth' })
    }

    return { role, image, accessToken, fullName, email, logout }
}, {
    persist: {
        pick: ['accessToken', 'image', 'role', 'fullName', 'email'],
    },

})
