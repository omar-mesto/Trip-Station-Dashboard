<script lang="ts" setup>
import { useGlobalStore } from '@@/stores/global'
import { useLogout } from '@@/queries/auth/admin'

const store = useGlobalStore()
const showLogoutConfirm = ref(false)
defineProps<{ toggleSidebar: () => void }>()

const confirmLogout = async () => {
  const { execute, status } = useLogout()
  await execute()
  if (status.value === 'success') {
    store.logout()
    showLogoutConfirm.value = false
  }
}

const userMenuItems = [
  { label: 'Logout', onSelect: () => (showLogoutConfirm.value = true) },
]
</script>

<template>
  <header class="flex justify-between items-center px-6 py-4 bg-primary shadow-sm">
    <div class="flex items-center gap-3">
      <img
        src="/tripStationLogo.png"
        class="w-10 h-12"
      >
      <p class="text-xl font-semibold">
        Trip Station
      </p>
    </div>
    <button class="md:hidden p-2 text-white" @click="toggleSidebar">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
    <div class="flex items-center gap-4">
      <UButton
        variant="ghost"
        class="p-0"
      >
        <UDropdownMenu
          :items="userMenuItems"
          :ui="{ content: 'w-48 text-center bg-white text-black', item: 'cursor-pointer px-3 py-2 hover:bg-gray-100 rounded text-sm' }"
        >
          <UAvatar
            :src="store.image || '/defaultImage.jpg'"
            size="md"
          />
        </UDropdownMenu>
      </UButton>
    </div>

    <UModal
      v-model:open="showLogoutConfirm"
      class="bg-white text-black"
      :ui="{ footer: 'justify-end' }"
    >
      <template #title>
        <p class="text-black font-semibold">
          Logout Confirmation
        </p>
      </template>
      <template #body>
        <p>Are you sure you want to log out?</p>
      </template>
      <template #footer>
        <div class="flex gap-2">
          <UButton
            variant="ghost"
            @click="showLogoutConfirm = false"
          >
            Cancel
          </UButton>
          <UButton
            class="bg-red-500 hover:bg-red-600 hover:text-white"
            @click="confirmLogout"
          >
            Logout
          </UButton>
        </div>
      </template>
    </UModal>
  </header>
</template>
