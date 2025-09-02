<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import { h } from 'vue'
import type { Row } from '@tanstack/vue-table'
import { useCountries, useCreateCountry, useDeleteCountry, useUpdateCountry } from '@@/queries/dashbaord/countries'
import type { Country, CountriesResponse } from '~/models/countriesModel'

const page = ref(1)
const limit = ref(10)

const { data, refresh: refreshCountries, pending } = useCountries(page, limit)
const countries = computed(() => data.value as CountriesResponse | undefined)
const pagination = computed(() => countries.value?.data.pagination)

onMounted(() => {
  refreshCountries()
})
watch(page, () => refreshCountries())

const showImagesModal = ref(false)
const selectedImages = ref<string[]>([])
function openImagesModal(images: string[]) {
  selectedImages.value = images
  showImagesModal.value = true
}

const showCountryModal = ref(false)
const selectedCountry = ref<Country & { imageFiles?: File[] } | null>(null)
const isEditMode = ref(false)

function openAddModal() {
  selectedCountry.value = {
    id: '',
    name: { en: '', ar: '' },
    tripType: '',
    images: [],
    imageFiles: [],
  }
  isEditMode.value = false
  showCountryModal.value = true
}

function openUpdateModal(country: Country) {
  const nameObj = { en: '', ar: '' }

  if (typeof country.name === 'string') {
    nameObj.en = country.name
  } else {
    nameObj.en = country.name?.en ?? ''
    nameObj.ar = country.name?.ar ?? ''
  }

  selectedCountry.value = {
    id: country.id,
    name: nameObj,
    tripType: country.tripType,
    images: country.images || [],
    imageFiles: [],
  }
  isEditMode.value = true
  showCountryModal.value = true
}

const openDeleteModal = ref(false)
const modalMessage = ref('')
function openDelete(country: Country) {
  selectedCountry.value = country
  modalMessage.value = `Are you sure you want to delete ${
    (country.name)?.en ?? (country.name)
  }?`
  openDeleteModal.value = true
}
function cancelDelete() {
  openDeleteModal.value = false
  selectedCountry.value = null
}

const toast = useToast()
async function confirmDelete() {
  const countryId = selectedCountry.value?.id
  if (!countryId) return
  try {
    const { clear } = useDeleteCountry(countryId)
    await clear()
    toast.add({
      title: `${
        (selectedCountry.value?.name)?.en ??
        (selectedCountry.value?.name) ??
        'Country'
      } deleted successfully`,
      color: 'success',
      icon: 'i-lucide-circle-check',
    })
    openDeleteModal.value = false
    selectedCountry.value = null
    await refreshCountries()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete country'
    toast.add({ title: message, color: 'error' })
  }
}

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')

function getRowItems(row: Row<Country>) {
  const country = row.original

  return [
    {
      label: 'Copy Country ID',
      onSelect() {
        navigator.clipboard.writeText(country.id)
        toast.add({ title: 'Country ID copied!', color: 'success' })
      },
    },
    {
      label: 'Update Country',
      onSelect() {
        openUpdateModal(country)
      },
    },
    {
      label: 'Delete Country',
      onSelect() {
        openDelete(country)
      },
    },
  ]
}

const columns: TableColumn<Country>[] = [
  { accessorKey: 'id', header: 'ID', cell: ({ row }) => `${row.getValue('id')}` },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => `${row.getValue('name')}`,
  },
  { accessorKey: 'tripType', header: 'Trip type', cell: ({ row }) => `${row.getValue('tripType')}` },
  {
    accessorKey: 'images',
    header: 'Images',
    cell: ({ row }) => {
      const imgs = row.getValue('images') as string[]
      if (!imgs?.length) return 'No image'

      return h('img', {
        src: imgs[0],
        alt: 'Country image',
        class: 'w-12 h-12 rounded-full object-cover cursor-pointer',
        onClick: () => openImagesModal(imgs),
      })
    },
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

async function saveCountry() {
  if (!selectedCountry.value) return
  try {
    const formData = new FormData()
    formData.append('name.en', selectedCountry.value.name.en)
    formData.append('name.ar', selectedCountry.value.name.ar)
    formData.append('tripType', selectedCountry.value.tripType)
    selectedCountry.value.imageFiles?.forEach((file: File) => {
      formData.append('images', file)
    })

    if (isEditMode.value) {
      const { execute } = useUpdateCountry(formData, selectedCountry.value.id)
      await execute()
      toast.add({
        title: `${selectedCountry.value.name.en} updated successfully`,
        color: 'success',
        icon: 'i-lucide-circle-check',
      })
    } else {
      const { execute } = useCreateCountry(formData)
      await execute()
      toast.add({
        title: `${selectedCountry.value.name.en} added successfully`,
        color: 'success',
        icon: 'i-lucide-circle-check',
      })
    }
    showCountryModal.value = false
    await refreshCountries()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save country'
    toast.add({ title: message, color: 'error' })
  }
}

function onImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || !selectedCountry.value) return
  const files = Array.from(input.files)
  selectedCountry.value.imageFiles = files
  selectedCountry.value.images = files.map(file => URL.createObjectURL(file))
}

const tripTypeItems = ref(['international', 'local'])
</script>

<template>
  <UDashboardGroup class="flex bg-[#F5F5F5] flex-col h-screen">
    <DashboardNavBar />
    <div class="flex flex-1 min-h-0 min-w-0">
      <DashboardSideBar />
      <div class="flex-1 p-6 flex flex-col min-h-0 min-w-0">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl text-secondary font-bold pb-2">
            Countries
          </h1>
          <UButton @click="openAddModal">
            + Add Country
          </UButton>
        </div>

        <div
          v-if="pending"
          class="text-center text-primary w-full text-2xl overflow-x-auto rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          Loading...
        </div>

        <div
          v-else-if="countries?.data?.data"
          class="rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          <UTable
            ref="table"
            :data="countries.data.data"
            sticky
            :columns="columns"
          />
        </div>

        <div class="flex justify-end py-2 px-3 border-t">
          <UPagination
            v-if="pagination"
            v-model:page="page"
            :total="pagination.total"
            :items-per-page="pagination.limit"
            @update:page="refreshCountries"
          />
        </div>
      </div>
    </div>

    <UModal
      v-model:open="showImagesModal"
      title="Country Images"
      :close="{
        color: 'primary',
        variant: 'outline',
        class: 'rounded-full',
      }"
    >
      <template #body>
        <Swiper
          :modules="[Navigation, Pagination]"
          navigation
          pagination
          class="w-full h-80 rounded-lg"
        >
          <SwiperSlide
            v-for="(img, i) in selectedImages"
            :key="i"
            class="flex justify-center items-center"
          >
            <img
              :src="img"
              alt="Country image"
              class="object-contain w-full h-80 rounded-lg shadow"
            >
          </SwiperSlide>
        </Swiper>
      </template>
    </UModal>

    <UModal
      v-model:open="showCountryModal"
      :title="isEditMode ? 'Update Country' : 'Add Country'"
      :ui="{ title: 'text-black' }"
      @after-leave="selectedCountry = null"
    >
      <template #body>
        <form
          v-if="selectedCountry"
          class="flex flex-col gap-4 text-black"
        >
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-black">English Name</label>
              <UInput
                v-model="selectedCountry.name.en"
                class="pt-2"
              />
            </div>
            <div>
              <label class="text-black">Arabic Name</label>
              <UInput
                v-model="selectedCountry.name.ar"
                class="pt-2"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="text-black">Country Trip</label>
              <USelect
                v-model="selectedCountry.tripType"
                :items="tripTypeItems"
                class="sm:w-48 w-32 pt-2 h-10 border rounded text-black"
              />
            </div>

            <div class="flex flex-col">
              <label class="text-sm font-medium mb-1">Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                class="border rounded p-2"
                @change="onImageUpload"
              >
            </div>
          </div>
        </form>
      </template>

      <template #footer>
        <div class="flex justify-end w-full gap-5">
          <UButton
            color="gray"
            variant="ghost"
            class="hover:cursor-pointer hover:text-primary"
            @click="showCountryModal = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            @click="saveCountry"
          >
            Save Changes
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="openDeleteModal"
      title="Delete Country"
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
            @click="cancelDelete"
          >
            Cancel
          </UButton>
          <UButton
            class="bg-red-600 hover:bg-red-800 text-white"
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
