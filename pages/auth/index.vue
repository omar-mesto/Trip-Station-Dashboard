<script lang="ts" setup>
import { useLoginAdmin } from '@@/queries/auth/admin'
import type { LoginResponse } from '~/models/loginResponseModel'
import type { adminModel } from '~/models/adminModel'

const router = useRouter()
const userLoginFunction = async (userData: adminModel) => {
  const { data, status } = await useLoginAdmin(userData)
  if (status.value === 'success') {
    const loginData = data.value as LoginResponse
    router.push('/')

    return { success: true, role: 'admin', accessToken: loginData.data.accessToken, fullName: loginData.data.admin.fullName, email: loginData.data.admin.email }
  } else {
    return { success: false }
  }
}
</script>

<template>
  <div class="w-full h-dvh flex flex-col md:flex-row">
    <Auth :login-function="userLoginFunction">
      <p class="text-lg md:text-2xl font-bold text-black mt-16">
        Admin Login
      </p>
      <p class="text-[#868686] pt-3">
        Enter your Email and Password
      </p>
      <template #button>
        <NuxtLink
          to="/auth/user/register"
          class="font-bold cursor-pointer text-primary hover:underline"
        >Sign in</NuxtLink>
      </template>
    </Auth>
    <div class="w-1/2 bg-primary md:grid hidden h-screen place-items-center">
      <img
        src="../../public/SuperAminLogin.png"
        loading="lazy"
        class="w-full md:w-xl"
      >
    </div>
  </div>
</template>
