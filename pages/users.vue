<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { h } from 'vue'
import { useBlockUser, useUsers } from '@@/queries/dashbaord/users'
import type { User, UsersModel } from '@@/models/userModel'
import type { Row } from '@tanstack/vue-table'
import { UAvatar } from '#components'

const openModel = ref(false)
const modalMessage = ref('')
const selectedUser = ref<User | null>(null)
const actionType = ref<'block' | 'unblock'>('block')
const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
const toast = useToast()

const columns: TableColumn<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => `${row.getValue('id')}`,
  },
  {
    accessorKey: 'fullName',
    header: 'Full name',
    cell: ({ row }) => `${row.getValue('fullName')}`,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => `${row.getValue('email')}`,
  },
  {
    accessorKey: 'isBlocked',
    header: 'Blocked',
    cell: ({ row }) => `${row.getValue('isBlocked')}`,
  },
  {
    accessorKey: 'profileImage',
    header: 'Image',
    cell: ({ row }) => {
      const img = row.getValue('profileImage') as string

      return h(UAvatar, {
        src: img,
        alt: 'Profile image',
        size: 'xl',
        class: 'object-cover rounded-full',
      })
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return h(
        'div',
        { class: 'text-right' },
        h(
          UDropdownMenu,
          {
            content: { align: 'end' },
            items: getRowItems(row),
            'aria-label': 'Actions dropdown',
          },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions dropdown',
            }),
        ),
      )
    },
  },
]

function openModal(user: User, type: 'block' | 'unblock') {
  selectedUser.value = user
  actionType.value = type
  modalMessage.value =
    type === 'block'
      ? `Are you sure you want to block ${user.fullName}?`
      : `Are you sure you want to unblock ${user.fullName}?`
  openModel.value = true
}

function cancelAction() {
  openModel.value = false
  selectedUser.value = null
}

async function confirmAction() {
  if (!selectedUser.value) return
  const userId = selectedUser.value.id
  let successMessage = ''

  if (actionType.value === 'block') {
    const { clear } = useBlockUser(userId)
    clear()
    successMessage = `${selectedUser.value.fullName} blocked successfully`
  } else {
    const { clear } = useBlockUser(userId)
    clear()
    successMessage = `${selectedUser.value.fullName} unblocked successfully`
  }

  refreshUsers()
  toast.add({
    title: successMessage,
    color: 'success',
    icon: 'i-lucide-circle-check',
  })

  openModel.value = false
  selectedUser.value = null
}

function getRowItems(row: Row<User>) {
  const user = row.original

  return [
    {
      label: 'Copy User ID',
      onSelect() {
        navigator.clipboard.writeText(user.id)
        toast.add({
          title: 'User-ID copied to clipboard!',
          color: 'success',
          icon: 'i-lucide-circle-check',
        })
      },
    },
    {
      label: user.isBlocked ? 'Unblock User' : 'Block User',
      onSelect() {
        openModal(user, user.isBlocked ? 'unblock' : 'block')
      },
    },
  ]
}

const page = ref(1)
const limit = ref(2)
const { data, refresh: refreshUsers, pending } = useUsers(page, limit)
const users = computed(() => data.value as UsersModel | undefined)
const pagination = computed(() => users.value?.data.pagination)
onMounted(() => {
  refreshUsers()
})
watch(page, () => {
  refreshUsers()
})
</script>

<template>
  <UDashboardGroup class="flex bg-[#F5F5F5] flex-col h-screen">
    <DashboardNavBar />
    <div class="flex flex-1 min-h-0 min-w-0">
      <DashboardSideBar />
      <div class="flex-1 p-6 flex flex-col min-h-0 min-w-0">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl text-secondary font-bold pb-2">
            Users
          </h1>
        </div>

        <div
          v-if="pending"
          class="text-center text-primary w-full text-2xl overflow-x-auto rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          Loading...
        </div>

        <div
          v-else-if="users?.data.data"
          class="rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          <UTable
            ref="table"
            :data="users?.data.data"
            sticky
            :columns="columns"
          />
        </div>
        <div class="flex justify-end align-content-end py-2 px-3 border-t">
          <UPagination
            v-if="pagination"
            v-model:page="page"
            :total="pagination.total"
            :items-per-page="pagination.limit"
            @update:page="refreshUsers"
          />
        </div>
      </div>
    </div>

    <UModal
      v-model:open="openModel"
      :title="actionType === 'block' ? 'Block User' : 'Unblock User'"
      :ui="{ footer: 'justify-end' }"
    >
      <template #body>
        <p>{{ modalMessage }}</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
            variant="ghost"
            class="bg-gray-500 text-white"
            @click="cancelAction"
          >
            Cancel
          </UButton>
          <UButton
            :class="actionType === 'block' ? 'bg-red-600 hover:bg-red-800' : 'bg-green-600 hover:bg-green-800'"
            @click="confirmAction"
          >
            Confirm
          </UButton>
        </div>
      </template>
    </UModal>
  </UDashboardGroup>
</template>

<style scoped>
:deep(thead) {
  background-color: #F8A26D !important;
  box-shadow: 2px 2px black !important;
}
</style>
