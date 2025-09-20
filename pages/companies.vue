<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import type { Row } from '@tanstack/vue-table'
import { useCompanies, useCreateCompany, useDeleteCompany, useUpdateCompany } from '@@/queries/dashbaord/company'
import type { Company, CompaniesResponse } from '~/models/companiesModel'

const page = ref(1)
const limit = ref(10)

const { data, refresh: refreshCompanies, pending } = useCompanies(page, limit)
const companies = computed(() => data.value as CompaniesResponse | undefined)
const pagination = computed(() => companies.value?.data.pagination)

onMounted(() => {
  refreshCompanies()
})
watch(page, () => refreshCompanies())

const showCompanyModal = ref(false)
const selectedCompany = ref<Company | null>(null)
const isEditMode = ref(false)

function openAddModal() {
  selectedCompany.value = {
    id: '',
    name: { en: '', ar: '' },
    rating: 0,
    contact: {
      whatsapp: '',
      facebook: '',
      website: '',
      instagram: '',
    },
  }
  isEditMode.value = false
  showCompanyModal.value = true
}

function openUpdateModal(company: Company) {
  const nameObj = { en: '', ar: '' }

  if (typeof company.name === 'string') {
    nameObj.en = company.name
  } else {
    nameObj.en = company.name?.en ?? ''
    nameObj.ar = company.name?.ar ?? ''
  }

  selectedCompany.value = {
    id: company.id,
    name: nameObj,
    rating: company.rating,
    contact: company.contact || {
      whatsapp: '',
      facebook: '',
      website: '',
      instagram: '',
    },
  }
  isEditMode.value = true
  showCompanyModal.value = true
}

const openDeleteModal = ref(false)
const modalMessage = ref('')
function openDelete(company: Company) {
  selectedCompany.value = company
  modalMessage.value = `Are you sure you want to delete ${
    (company.name)?.en ?? (company.name)
  }?`
  openDeleteModal.value = true
}
function cancelDelete() {
  openDeleteModal.value = false
  selectedCompany.value = null
}

const toast = useToast()
const isSaving = ref(false)
async function confirmDelete() {
  const companyId = selectedCompany.value?.id
  if (!companyId) return
  isSaving.value = true
  try {
    const { clear } = useDeleteCompany(companyId)
    await clear()
    toast.add({
      title: `${
        (selectedCompany.value?.name)?.en ??
        (selectedCompany.value?.name) ??
        'Company'
      } deleted successfully`,
      color: 'success',
      icon: 'i-lucide-circle-check',
    })
    openDeleteModal.value = false
    selectedCompany.value = null
    await refreshCompanies()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete company'
    toast.add({ title: message, color: 'error' })
  }
  isSaving.value = false
}

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

function getRowItems(row: Row<Company>) {
  const company = row.original

  return [
    {
      label: 'Copy Company ID',
      onSelect() {
        navigator.clipboard.writeText(company.id)
        toast.add({ title: 'Company ID copied!', color: 'success' })
      },
    },
    {
      label: 'Update Company',
      onSelect() {
        openUpdateModal(company)
      },
    },
    {
      label: 'Delete Company',
      onSelect() {
        openDelete(company)
      },
    },
  ]
}

const columns: TableColumn<Company>[] = [
  { accessorKey: 'id', header: 'ID', cell: ({ row }) => `${row.getValue('id')}` },
  {
    accessorKey: 'name.en',
    header: 'English Name',
    cell: ({ row }) => `${row.original.name.en}`,
  },
  {
    accessorKey: 'name.ar',
    header: 'Arabic Name',
    cell: ({ row }) => `${row.original.name.ar}`,
  },
  { accessorKey: 'rating', header: 'Rating', cell: ({ row }) => `${row.getValue('rating')}` },

  {
    accessorKey: 'contact.whatsapp',
    header: 'WhatsApp',
    cell: ({ row }) => (row.original.contact?.whatsapp ?? ''),
  },
  {
    accessorKey: 'contact.facebook',
    header: 'Facebook',
    cell: ({ row }) => (row.original.contact?.facebook ?? ''),
  },
  {
    accessorKey: 'contact.website',
    header: 'Website',
    cell: ({ row }) => (row.original.contact?.website ?? ''),
  },
  {
    accessorKey: 'contact.instagram',
    header: 'Instagram',
    cell: ({ row }) => (row.original.contact?.instagram ?? ''),
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) =>
      h(
        'div',
        { class: 'text-left' },
        h(
          UDropdownMenu,
          { content: { align: 'end' }, items: getRowItems(row) },
          () =>
            h(UButton, {
              icon: 'i-lucide-ellipsis-vertical',
              color: 'neutral',
              variant: 'ghost',
              class: 'ml-auto',
              'aria-label': 'Actions',
            }),
        ),
      ),
  },
]

async function saveCompany() {
  if (!selectedCompany.value) return
  isSaving.value = true
  try {
    const payload = {
      name: selectedCompany.value.name,
      rating: selectedCompany.value.rating,
      contact: selectedCompany.value.contact,
    }

    if (isEditMode.value) {
      const { execute } = useUpdateCompany(payload, selectedCompany.value.id)
      await execute()
      toast.add({
        title: `${selectedCompany.value.name.en} updated successfully`,
        color: 'success',
        icon: 'i-lucide-circle-check',
      })
    } else {
      const { execute } = useCreateCompany(payload)
      await execute()
      toast.add({
        title: `${selectedCompany.value.name.en} added successfully`,
        color: 'success',
        icon: 'i-lucide-circle-check',
      })
    }
    showCompanyModal.value = false
    await refreshCompanies()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save company'
    toast.add({ title: message, color: 'error' })
  }
  isSaving.value = false
}
</script>

<template>
  <UDashboardGroup class="flex bg-[#F5F5F5] flex-col h-screen">
    <DashboardNavBar />
    <div class="flex flex-1 min-h-0 min-w-0">
      <DashboardSideBar />
      <div class="flex-1 p-6 flex flex-col min-h-0 min-w-0">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl text-secondary font-bold pb-2">
            Companies
          </h1>
          <UButton @click="openAddModal">
            + Add Company
          </UButton>
        </div>

        <div
          v-if="pending"
          class="text-center text-primary w-full text-2xl overflow-x-auto rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          Loading...
        </div>

        <div
          v-else-if="companies?.data?.data"
          class="rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          <UTable
            ref="table"
            :data="companies.data.data"
            sticky
            class="text-black"
            :columns="columns"
          />
        </div>

        <div class="flex justify-end py-2 px-3 border-t">
          <UPagination
            v-if="pagination"
            v-model:page="page"
            :total="pagination.total"
            :items-per-page="pagination.limit"
            @update:page="refreshCompanies"
          />
        </div>
      </div>
    </div>

    <UModal
      v-model:open="showCompanyModal"
      :ui="{ title: 'text-black' }"
      class="bg-white"
      @after-leave="selectedCompany = null"
    >
      <template #title>
        <p class="text-black">
          {{ isEditMode ? 'Update Company' : 'Add Company' }}
        </p>
      </template>
      <template #body>
        <form
          v-if="selectedCompany"
          class="flex flex-col gap-4 text-black"
        >
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-black">English Name</label>
              <UInput
                v-model="selectedCompany.name.en"
                class="pt-2"
              />
            </div>
            <div>
              <label class="text-black">Arabic Name</label>
              <UInput
                v-model="selectedCompany.name.ar"
                class="pt-2"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-black">WhatsApp</label>
              <UInput
                v-model="selectedCompany.contact.whatsapp"
                class="pt-2"
              />
            </div>
            <div>
              <label class="text-black">Facebook</label>
              <UInput
                v-model="selectedCompany.contact.facebook"
                class="pt-2"
              />
            </div>
            <div>
              <label class="text-black">Website</label>
              <UInput
                v-model="selectedCompany.contact.website"
                class="pt-2"
              />
            </div>
            <div>
              <label class="text-black">Instagram</label>
              <UInput
                v-model="selectedCompany.contact.instagram"
                class="pt-2"
              />
            </div>
            <div>
              <label class="text-black px-2">Rating</label>
              <UInput
                v-model="selectedCompany.rating"
                type="number"
                step="0.1"
                min="0"
                max="5"
                class="pt-2"
              />
            </div>
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-end w-full gap-5">
          <UButton
            color="primary"
            variant="ghost"
            class="hover:cursor-pointer hover:text-primary"
            @click="showCompanyModal = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            :loading="isSaving"
            @click="saveCompany"
          >
            Save Changes
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="openDeleteModal"
      :ui="{ footer: 'justify-end' }"
      class="bg-white"
    >
      <template #title>
        <p class="text-black">
          Delete Company
        </p>
      </template>
      <template #body>
        <p>{{ modalMessage }}</p>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
            variant="ghost"
            class="bg-gray-500 text-white"
            @click="cancelDelete"
          >
            Cancel
          </UButton>
          <UButton
            class="bg-red-600 hover:bg-red-800 text-white"
            :loading="isSaving"
            @click="confirmDelete"
          >
            Delete
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
