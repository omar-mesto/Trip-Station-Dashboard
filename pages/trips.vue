<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import type { Row } from '@tanstack/vue-table'
import { useTrips, useCreateTrip, useUpdateTrip, useDeleteTrip } from '@@/queries/dashbaord/trip'
import { useCompanies } from '@@/queries/dashbaord/company'
import { useCountries } from '@@/queries/dashbaord/countries'
import type { Trip, TripsResponse } from '~/models/tripModel'
import { useRuntimeConfig } from '#app'

const page = ref(1)
const limit = ref(10)
const { data, pending, refresh } = useTrips(page, limit)
const trips = computed(() => data.value as TripsResponse | undefined)
const pagination = computed(() => trips.value?.data.pagination)
onMounted(() => refresh())
watch(page, () => refresh())

const companyPage = ref(1)
const companyLimit = ref(50)
const { data: companyData } = useCompanies(companyPage, companyLimit)
const companies = computed(() => companyData.value?.data?.data ?? [])

const countryPage = ref(1)
const countryLimit = ref(50)
const { data: countryData } = useCountries(countryPage, countryLimit)
const countries = computed(() => countryData.value?.data?.data ?? [])

const showImagesModal = ref(false)
const selectedImages = ref<string[]>([])
function openImagesModal(images: string[]) {
  selectedImages.value = images
  showImagesModal.value = true
}

const showTripModal = ref(false)
const isEditMode = ref(false)
const selectedTrip = ref<Trip & { imageFiles?: File[]; companyId?: string; countryId?: string }>({
  id: '', price: 0, isAdvertisement: false, lat: 0, lng: 0, tripType: 'international', status: 'active',
  images: [], startDate: '', endDate: '', location: '', rating: 0, name: { en: '', ar: '' },
  description: { en: '', ar: '' }, companyName: null, companyRating: null, countryName: null, imageFiles: [], companyId: '', countryId: '',
})

function openAddModal() {
  selectedTrip.value = { id: '', price: 0, isAdvertisement: false, lat: 0, lng: 0, tripType: 'international', status: 'active', images: [], startDate: '', endDate: '', location: '', rating: 0, name: { en: '', ar: '' }, description: { en: '', ar: '' }, companyName: null, companyRating: null, countryName: null, imageFiles: [], companyId: '', countryId: '' }
  isEditMode.value = false
  showTripModal.value = true
}
function openUpdateModal(trip: Trip) {
  selectedTrip.value = { ...trip, name: { en: trip.name.en, ar: trip.name.ar }, description: { en: trip.description.en, ar: trip.description.ar }, imageFiles: [], images: trip.images ?? [], companyId: trip.companyName ?? '', countryId: trip.countryName ?? '' }
  isEditMode.value = true
  showTripModal.value = true
}

const showDeleteModal = ref(false)
const modalMessage = ref('')
function openDelete(trip: Trip) {
  selectedTrip.value = trip
  modalMessage.value = `Are you sure you want to delete ${trip.name.en}?`
  showDeleteModal.value = true
}
function cancelDelete() {
  showDeleteModal.value = false
}

const toast = useToast()
const isSaving = ref(false)

async function confirmDelete() {
  if (!selectedTrip.value?.id) return
  isSaving.value = true
  try {
    await useDeleteTrip(selectedTrip.value.id)
    toast.add({ title: 'Trip deleted successfully', color: 'success' })
    showDeleteModal.value = false
    await refresh()
  }
  catch (err: unknown) { toast.add({ title: err instanceof Error ? err.message : 'Failed to delete trip', color: 'error' }) }
  isSaving.value = false
}

const UButton = resolveComponent('UButton')
const UDropdownMenu = resolveComponent('UDropdownMenu')
function getRowItems(row: Row<Trip>) {
  const trip = row.original

return [
    { label: 'Copy Trip ID', onSelect() { navigator.clipboard.writeText(trip.id)
      toast.add({ title: 'Trip ID copied!', color: 'success' }) } },
    { label: 'Update Trip', onSelect() { openUpdateModal(trip) } },
    { label: 'Delete Trip', onSelect() { openDelete(trip) } },
  ]
}

const expanded = ref<Record<number, boolean>>({})
const columns: TableColumn<Trip>[] = [
  {
    id: 'expand',
    cell: ({ row }) =>
      h(UButton, {
        color: 'neutral',
        variant: 'ghost',
        icon: 'i-lucide-chevron-down',
        square: true,
        'aria-label': 'Expand',
        ui: {
          leadingIcon: [
            'transition-transform',
            row.getIsExpanded() ? 'duration-200 rotate-180' : '',
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
  },
  {
    id: 'name',
    header: 'Name',
    cell: ({ row }) => {
      const en = row.original.name?.en ?? ''
      const ar = row.original.name?.ar ?? ''

      return h('div', { class: 'flex flex-col' }, [
        h('span', { class: 'font-semibold text-gray-800' }, en),
        h('span', { class: 'text-sm text-gray-500' }, ar),
      ])
    },
  },
  { accessorKey: 'location', header: 'Location', cell: ({ row }) => `${row.getValue('location')}` },
  { accessorKey: 'price', header: 'Price', cell: ({ row }) => `${row.getValue('price')}` },
  {
    id: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const start = row.original.startDate
        ? new Date(row.original.startDate).toLocaleDateString()
        : ''
      const end = row.original.endDate
        ? new Date(row.original.endDate).toLocaleDateString()
        : ''

      return `${start} - ${end}`
    },
  },
  { accessorKey: 'tripType', header: 'Trip Type', cell: ({ row }) => `${row.original.tripType}` },
  { accessorKey: 'rating', header: 'Rating', cell: ({ row }) => `${row.original.rating}` },
  { accessorKey: 'companyName.en', header: 'Company name', cell: ({ row }) => `${row.original.companyName?.en ?? ''}` },
  { accessorKey: 'countryName.en', header: 'Country name', cell: ({ row }) => `${row.original.countryName?.en ?? ''}` },

  { accessorKey: 'isAdvertisement', header: () => h('div', { class: 'text-left' }, 'Advertisement'), cell: ({ row }) => `${row.original.isAdvertisement}` },
  {
    accessorKey: 'images',
    header: 'Images',
    cell: ({ row }) => {
      const imgs = row.getValue('images') as string[]
      if (!imgs?.length) return 'No image'

      return h('img', {
        src: imgs[0],
        alt: 'Trip image',
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
          { class: { align: 'end' }, items: getRowItems(row) },
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

async function saveTrip() {
  if (!selectedTrip.value) return
  isSaving.value = true
  try {
    const formData = new FormData()
    formData.append('name.en', selectedTrip.value.name.en)
    formData.append('name.ar', selectedTrip.value.name.ar)
    formData.append('description.en', selectedTrip.value.description.en)
    formData.append('description.ar', selectedTrip.value.description.ar)
    formData.append('price', String(selectedTrip.value.price))
    formData.append('tripType', selectedTrip.value.tripType)
    formData.append('status', selectedTrip.value.status)
    formData.append('location', selectedTrip.value.location)
    formData.append('startDate', selectedTrip.value.startDate)
    formData.append('endDate', selectedTrip.value.endDate)
    formData.append('lat', String(selectedTrip.value.lat))
    formData.append('lng', String(selectedTrip.value.lng))
    formData.append('rating', String(selectedTrip.value.rating))
    formData.append('isAdvertisement', String(selectedTrip.value.isAdvertisement))

    if (selectedTrip.value.companyId) formData.append('company', selectedTrip.value.companyId)
    if (selectedTrip.value.countryId) formData.append('country', selectedTrip.value.countryId)

    ;(selectedTrip.value.imageFiles ?? []).forEach((f: File) => formData.append('images', f))

    if (isEditMode.value && selectedTrip.value.id) {
      await useUpdateTrip(selectedTrip.value.id, formData)
      toast.add({ title: `${selectedTrip.value.name.en} updated successfully`, color: 'success' })
    } else {
      await useCreateTrip(formData)
      toast.add({ title: `${selectedTrip.value.name.en} added successfully`, color: 'success' })
    }

    showTripModal.value = false
    await refresh()
  } catch (err: unknown) {
    toast.add({ title: err instanceof Error ? err.message : 'Failed to save trip', color: 'error' })
  }
  isSaving.value = false
}

function onImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files || !selectedTrip.value) return
  const files = Array.from(input.files)
  selectedTrip.value.imageFiles = files
  selectedTrip.value.images = files.map(f => URL.createObjectURL(f))
}

const showMapModal = ref(false)
let map: mapboxgl.Map | null = null
let marker: mapboxgl.Marker | null = null
const config = useRuntimeConfig()

async function openMapModalForTrip(trip: Trip & { lat: number, lng: number }) {
  selectedTrip.value = trip
  showMapModal.value = true
  await nextTick()
  await initMap()
}

async function initMap() {
  const mapboxglModule = await import('mapbox-gl')
  const mapboxgl = mapboxglModule.default ?? mapboxglModule
  mapboxgl.accessToken = config.public.mapboxToken

  if ('disableTelemetry' in mapboxgl && typeof mapboxgl.disableTelemetry === 'function') {
    mapboxgl.disableTelemetry()
  }

  const el = document.getElementById('trip-map')
  if (!el) return

  const lng = selectedTrip.value?.lng && selectedTrip.value?.lng !== 0 ? selectedTrip.value.lng : 46.738586
  const lat = selectedTrip.value?.lat && selectedTrip.value?.lat !== 0 ? selectedTrip.value.lat : 24.774265

  if (map) {
    map.remove()
    map = null
  }

  map = new mapboxgl.Map({
    container: el,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: 16,
  })

  marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat([lng, lat])
    .addTo(map)

  map.on('click', e => {
    const lngLat = e.lngLat
    selectedTrip.value!.lng = lngLat.lng
    selectedTrip.value!.lat = lngLat.lat
    marker?.setLngLat(lngLat)
  })

  marker.on('dragend', () => {
    if (!marker) return
    const pos = marker.getLngLat()
    selectedTrip.value!.lng = pos.lng
    selectedTrip.value!.lat = pos.lat
  })

  setTimeout(() => map?.resize(), 300)
}

function closeMapModal() {
  showMapModal.value = false
  if (map) {
    map.remove()
    map = null
    marker = null
  } }
</script>

<template>
  <UDashboardGroup class="flex bg-[#F5F5F5] flex-col h-screen">
    <DashboardNavBar />
    <div class="flex flex-1 min-h-0 min-w-0">
      <DashboardSideBar />
      <div class="flex-1 p-6 flex flex-col min-h-0 min-w-0">
        <div class="flex justify-between items-center mb-4">
          <h1 class="text-2xl text-secondary font-bold pb-2">
            Trips
          </h1>
          <UButton @click="openAddModal">
            + Add Trip
          </UButton>
        </div>

        <div
          v-if="pending"
          class="text-center text-primary w-full text-2xl rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          Loading...
        </div>

        <div
          v-else-if="trips?.data?.data"
          class="rounded-lg shadow-xl pb-5 flex-1 flex flex-col min-h-0 min-w-0"
        >
          <UTable
            v-model:expanded="expanded"
            :data="trips?.data?.data || []"
            :columns="columns"
            :ui="{ tr: 'data-[expanded=true]:bg-elevated/50' }"
            class="flex-1 text-black"
          >
            <template #expanded="{ row }">
              <div class="p-4 bg-gray-50 rounded text-gray-800">
                <p class="mb-2">
                  <span class="font-bold">English Description:</span>
                  {{ row.original.description?.en || 'N/A' }}
                </p>
                <p>
                  <span class="font-bold">Arabic Description:</span>
                  {{ row.original.description?.ar || 'N/A' }}
                </p>
              </div>
            </template>
          </UTable>
        </div>

        <div class="flex justify-end py-2 px-3 border-t">
          <UPagination
            v-if="pagination"
            v-model:page="page"
            :total="pagination.total"
            :items-per-page="pagination.limit"
            class="custom-pagination"
            @update:page="refresh"
          />
        </div>
      </div>
    </div>

    <UModal
      v-model:open="showImagesModal"
      :close="{ color: 'primary', variant: 'outline', class: 'rounded-full' }"
      class="bg-white"
    >
      <template #title>
        <h1 class="text-black">
          Trip Images
        </h1>
      </template>
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
              class="object-contain w-full h-80 rounded-lg shadow"
            >
          </SwiperSlide>
        </Swiper>
      </template>
    </UModal>

    <UModal
      v-model:open="showMapModal"
      class="bg-white text-black z-[60] lg:max-w-4xl w-full"
    >
      <template #title>
        <p class="text-black">
          Set Trip Location
        </p>
      </template>
      <template #body>
        <div
          id="trip-map"
          class="w-full h-80 rounded-lg shadow"
        />
        <div class="mt-3 justify-center w-full flex gap-4">
          <div>Latitude: {{ selectedTrip?.lat }}</div>
          <div>Longitude: {{ selectedTrip?.lng }}</div>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton
            class="text-primary hover:cursor-pointer"
            variant="ghost"
            @click="closeMapModal"
          >
            Close
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="showTripModal"
      class="bg-white text-black z-[50] lg:max-w-2xl sm:w-auto"
    >
      <template #title>
        <p class="text-black">
          {{ isEditMode ? 'Update Trip' : 'Add Trip' }}
        </p>
      </template>
      <template #body>
        <div class="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-4">
          <input
            v-model="selectedTrip.name.en"
            placeholder="English Name"
            class="border rounded p-2"
          >
          <input
            v-model="selectedTrip.name.ar"
            placeholder="Arabic Name"
            class="border rounded p-2"
          >
          <select
            v-model="selectedTrip.tripType"
            class="border rounded p-2"
          >
            <option value="international">
              International
            </option>
            <option value="local">
              Local
            </option>
          </select>

          <textarea
            v-model="selectedTrip.description.en"
            placeholder="English Description"
            class="border rounded p-2 col-span-1"
          />
          <textarea
            v-model="selectedTrip.description.ar"
            placeholder="Arabic Description"
            class="border rounded p-2 col-span-1"
          />
          <input
            v-model.number="selectedTrip.price"
            type="number"
            placeholder="Price"
            class="border rounded p-2"
          >

          <input
            v-model="selectedTrip.location"
            placeholder="Location"
            class="border rounded p-2"
          >
          <input
            v-model="selectedTrip.startDate"
            type="date"
            class="border rounded p-2"
          >
          <input
            v-model="selectedTrip.endDate"
            type="date"
            class="border rounded p-2"
          >

          <select
            v-model="selectedTrip.companyId"
            class="border rounded p-2"
          >
            <option value="">
              Select Company
            </option>
            <option
              v-for="c in companies"
              :key="c.id"
              :value="c.id"
            >
              {{ c.name.en }}
            </option>
          </select>
          <select
            v-model="selectedTrip.countryId"
            class="border rounded p-2"
          >
            <option value="">
              Select Country
            </option>
            <option
              v-for="c in countries"
              :key="c.id"
              :value="c.id"
            >
              {{ c.name.en }}
            </option>
          </select>
          <div class="flex items-center gap-2">
            <input
              v-model="selectedTrip.isAdvertisement"
              type="checkbox"
            > Advertisement
          </div>

          <div class="block sm:flex sm:min-w-md w-auto justify-between">
            <div class="">
              <input
                type="file"
                multiple
                class="h-10 border max-w-3xs rounded"
                @change="onImageUpload"
              >
            </div>
            <div class="">
              <UButton
                color="primary"
                class="col-span-3 text-white h-10 sm:mx-5 lg:mx-0 "
                @click="openMapModalForTrip(selectedTrip)"
              >
                Map Location
              </UButton>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end w-full gap-5">
          <UButton
            color="gray"
            class="text-primary hover:cursor-pointer"
            variant="ghost"
            @click="showTripModal = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
            class="text-white hover:cursor-pointer"
            :loading="isSaving"
            @click="saveTrip"
          >
            Save
          </UButton>
        </div>
      </template>
    </UModal>

    <UModal
      v-model:open="showDeleteModal"
      class="bg-white"
    >
      <template #title>
        <p class="text-black">
          Delete Trip
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
            :loading="isSaving"
            @click="cancelDelete"
          >
            Cancel
          </UButton>
          <UButton
            class="bg-red-600 text-white"
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
:deep(thead) { background-color:#F8A26D !important; box-shadow:2px 2px black !important; }
</style>
