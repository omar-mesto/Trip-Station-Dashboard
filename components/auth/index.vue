<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useErrorStore } from '@@/stores/error'
import { useGlobalStore } from '@@/stores/global'
import { loginSchema } from '~/schema/loginAdmin.schema'

const props = defineProps({
  loginFunction: {
    type: Function,
    required: true,
  },
})

const userForm = ref({
  email: '',
  password: '',
  role: 'admin',
})

const formIsValid = computed(() => {
  if (!form.value) return true

  return form.value.errors && Object.keys(form.value.errors).length > 0
})

const form = ref()
const errorStore = useErrorStore()
const toast = useToast()
const isLoading = ref(false)

const loginUser = async () => {
  isLoading.value = true
  const result = await props.loginFunction(userForm.value)
  if (result.success) {
    const globalStore = useGlobalStore()
    globalStore.role = result.role
    globalStore.fullName = result.fullName
    globalStore.email = result.email
    globalStore.accessToken = result.accessToken
    toast.add({ description: `Login Successful`, color: 'success' })
  } else {
    toast.add({ description: `${errorStore.message}`, color: 'error' })
  }
  isLoading.value = false
  userForm.value.email = ''
  userForm.value.password = ''
}
</script>

<template>
  <div class="w-full md:w-1/2 md:h-auto h-dvh">
    <div class="grid w-full h-full place-items-center">
      <div class="flex w-full flex-col items-center justify-center  px-6 mx-auto lg:py-0">
        <slot />
        <div class="w-full md:px-1 lg:px-20">
          <div class="p-5 md:p-6 space-y-4 md:space-y-6 sm:p-8">
            <UForm
              ref="form"
              :state="userForm"
              action="#"
              :schema="loginSchema"
              class="space-y-4 p-5 md:space-y-4"
              @submit="loginUser"
            >
              <UFormField
                label="Email"
                name="email"
              >
                <UInput
                  v-model="userForm.email"
                  class="border-0 rounded-lg bg-white text-black block"
                  size="xl"
                  variant="subtle"
                />
              </UFormField>
              <UFormField
                label="Password"
                name="password"
              >
                <UInput
                  v-model="userForm.password"
                  class="rounded-lg bg-white text-black block"
                  size="xl"
                />
              </UFormField>
              <UButton
                :loading="isLoading"
                :disabled="formIsValid"
                type="submit"
                block
                class="w-full sm:mt-3 disabled:bg-primary text-white bg-primary hover:bg-blue-950 rounded-full h-12 py-2.5 font-bold text-center"
              >
                <span class="font-bold text-lg">Sign in</span>
              </UButton>
            </UForm>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
