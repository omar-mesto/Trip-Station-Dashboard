<script lang="ts" setup>
import { ref } from 'vue'
import { useGlobalStore } from '@@/stores/global'
import { useLogout } from '@@/queries/auth/admin'

const store = useGlobalStore()
const showLogoutConfirm = ref(false)
const router = useRouter()

const confirmLogout = async () => {
  const { execute, status } = useLogout()
  await execute()

  if (status.value === 'success') {
    store.logout()
    showLogoutConfirm.value = false
  }
}

const items = [
  {
    label: 'Profile',
    onSelect: () => {
      router.push('auth/updateProfile')
    },
  },
  {
    label: 'Logout',
    onSelect: () => {
      showLogoutConfirm.value = true
    },
  },
]
</script>

<template>
  <div>
    <UDashboardNavbar
      class="bg-primary shadow-sm border-0"
    >
      <template #title>
        <h1 class="text-xl">
          Trip Station
        </h1>
      </template>
      <template #right>
        <div class="flex items-center gap-4">
          <UDropdownMenu
            :items="items"
            :content="{ align: 'center', side: 'bottom', sideOffset: 8 }"
            :ui="{
              item: 'cursor-pointer px-3 py-2 hover:bg-gray-100 hover:text-red-500 rounded text-sm',
              content: 'w-48 text-center',
            }"
          >
            <UButton variant="ghost">
              <UAvatar
                label="open"
                :src="store.image || '/defaultImage.jpg'"
                size="md"
              />
            </UButton>
          </UDropdownMenu>
        </div>
      </template>
    </UDashboardNavbar>

    <UModal
      v-model:open="showLogoutConfirm"
      title="Logout Confirmation"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <p>Are you sure you want to log out?</p>
      </template>

      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            variant="ghost"
            @click="showLogoutConfirm = false"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            @click="confirmLogout"
          >
            Logout
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
