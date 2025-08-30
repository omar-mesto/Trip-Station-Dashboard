<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { h } from 'vue'
import { useUsers } from '@@/queries/dashbaord/users'
import type { User, UsersModel } from '@@/models/userModel'
import { UAvatar } from '#components'

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
]

const { data, refresh: refreshUsers, pending } = useUsers()
const users = computed(() => data.value as UsersModel | undefined)
onMounted(() => {
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
          class="text-center text-primary w-full text-2xl overflow-x-auto"
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
          <div class="flex justify-end py-2 px-3 border-t">
            <UPagination />
          </div>
        </div>
      </div>
    </div>
  </UDashboardGroup>
</template>

<style scoped>
:deep(thead) {
  background-color: #F8A26D !important;
  box-shadow: 2px 2px black !important;
}
</style>
