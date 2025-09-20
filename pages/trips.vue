<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination } from 'swiper/modules'
import type { Row } from '@tanstack/vue-table'
import { useTrips, useCreateTrip, useUpdateTrip, useDeleteTrip } from '@@/queries/dashbaord/trip'
import { useRuntimeConfig } from '#app'
import type { Trip, TripsResponse } from '~/models/tripModel'

const page = ref(1)
const limit = ref(10)

const { data, pending, refresh } = useTrips(page, limit)
const trips = computed(() => data.value as TripsResponse | undefined)
const pagination = computed(() => trips.value?.data.pagination)

onMounted(() => refresh())
watch(page, () => refresh())

const showImagesModal = ref(false)
const selectedImages = ref<string[]>([])
function openImagesModal(images: string[]) {
  selectedImages.value = images
  showImagesModal.value = true
}

const showTripModal = ref(false)
const isEditMode = ref(false)
const selectedTrip = ref<Trip | null>(null)

function openAddModal() {
  selectedTrip.value = {
  id: '',
  price: 0,
  isAdvertisement: false,
  lat: 0,
  lng: 0,
  tripType: 'international',
  status: 'active',
  images: [],
  startDate: '',
  endDate: '',
  location: '',
  rating: 0,
  name: { en: '', ar: '' },
  description: { en: '', ar: '' },
  companyName: null,
  companyRating: null,
  countryName: null,
}

  isEditMode.value = false
  showTripModal.value = true
}

function openUpdateModal(trip: Trip) {
  const nameObj = typeof trip.name === 'string' ? { en: trip.name, ar: '' } : { en: trip.name?.en ?? '', ar: trip.name?.ar ?? '' }
  const descObj = typeof trip.description === 'string' ? { en: trip.description, ar: '' } : { en: trip.description?.en ?? '', ar: trip.description?.ar ?? '' }

  selectedTrip.value = {
    ...trip,
    name: nameObj,
    description: descObj,
    images: [],
  }
  isEditMode.value = true
  showTripModal.value = true
}

const showDeleteModal = ref(false)
const modalMessage = ref('')
function openDelete(trip: Trip) {
  selectedTrip.value = trip
  modalMessage.value = `Are you sure you want to delete ${(typeof trip.name === 'string' ? trip.name : trip.name.en)}?`
  showDeleteModal.value = true
}
function cancelDelete() {
  showDeleteModal.value = false
  selectedTrip.value = null
}

const toast = useToast()
const isSaving = ref(false)

async function confirmDelete() {
  if (!selectedTrip.value?.id) return
  isSaving.value = true
  try {
    const { execute } = useDeleteTrip(selectedTrip.value.id)
    await execute()
    toast.add({ title: 'Trip deleted successfully', color: 'success' })
    showDeleteModal.value = false
    selectedTrip.value = null
    await refresh()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete trip'
    toast.add({ title: message, color: 'error' })
  }
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

const columns: TableColumn<Trip>[] = [
  { accessorKey: 'id', header: 'ID', cell: ({ row }) => `${row.getValue('id')}` },
  { accessorKey: 'name.en', header: 'English Name', cell: ({ row }) => `${(row.original.name).en ?? ''}` },
  { accessorKey: 'location', header: 'Location', cell: ({ row }) => `${row.getValue('location')}` },
  { accessorKey: 'price', header: 'Price', cell: ({ row }) => `${row.getValue('price')}` },
  { accessorKey: 'startDate', header: 'Start', cell: ({ row }) => `${row.original.startDate ? new Date(row.original.startDate).toLocaleDateString() : ''}` },
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
    cell: ({ row }) => h('div', { class: 'text-left' }, h(UDropdownMenu, { class: { align: 'end' }, items: getRowItems(row) }, () => h(UButton, { icon: 'i-lucide-ellipsis-vertical', color: 'neutral', variant: 'ghost', class: 'ml-auto', 'aria-label': 'Actions' }))),
  },
]

async function saveTrip() {
  if (!selectedTrip.value) return
  isSaving.value = true
  try {
    const formData = new FormData()
    formData.append('name.en', (selectedTrip.value.name).en ?? '')
    formData.append('name.ar', (selectedTrip.value.name).ar ?? '')
    formData.append('description.en', (selectedTrip.value.description).en ?? '')
    formData.append('description.ar', (selectedTrip.value.description).en ?? '')
    formData.append('price', String(selectedTrip.value.price ?? 0))
    formData.append('tripType', selectedTrip.value.tripType ?? '')
    formData.append('status', selectedTrip.value.status ?? 'active')
    formData.append('location', selectedTrip.value.location ?? '')
    formData.append('startDate', selectedTrip.value.startDate ?? '')
    formData.append('endDate', selectedTrip.value.endDate ?? '')
    formData.append('lat', String(selectedTrip.value.lat ?? 0))
    formData.append('lng', String(selectedTrip.value.lng ?? 0))
    formData.append('rating', String(selectedTrip.value.rating ?? 0))
    formData.append('isAdvertisement', String(selectedTrip.value.isAdvertisement ?? false))

    (selectedTrip.value.imageFiles ?? []).forEach((f: File, idx: number) => {
      formData.append('images', f)
    })

    if (isEditMode.value && selectedTrip.value.id) {
      const { execute } = useUpdateTrip()
      await execute(selectedTrip.value.id, formData)
      toast.add({ title: `${(selectedTrip.value.name).en} updated successfully`, color: 'success' })
    } else {
      const { execute } = useCreateTrip()
      await execute(formData)
      toast.add({ title: `${(selectedTrip.value.name).en} added successfully`, color: 'success' })
    }
    showTripModal.value = false
    await refresh()
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save trip'
    toast.add({ title: message, color: 'error' })
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
let map: any = null
let marker: any = null
const config = useRuntimeConfig()

async function openMapModalForTrip(trip: Trip | null) {
  if (!trip) return
  selectedTrip.value = trip
  showMapModal.value = true
  await nextTick()
  initMap()
}

async function initMap() {
  if (typeof window === 'undefined') return
  const mapboxglModule = await import('mapbox-gl')
  const mapboxgl = mapboxglModule.default ?? mapboxglModule
  mapboxgl.accessToken = config.public.mapboxToken

  const el = document.getElementById('trip-map') as HTMLElement
  if (!el) return

  const lng = (selectedTrip.value?.lng ?? 35) as number
  const lat = (selectedTrip.value?.lat ?? 31) as number

  if (map) { map.remove(); map = null }
  map = new mapboxgl.Map({
    container: el,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [lng, lat],
    zoom: 5,
  })

  marker = new mapboxgl.Marker({ draggable: true })
    .setLngLat([lng, lat])
    .addTo(map)

  map.on('click', (e: any) => {
    const { lngLat } = e
    marker.setLngLat(lngLat)
    if (selectedTrip.value) { selectedTrip.value.lng = lngLat.lng; selectedTrip.value.lat = lngLat.lat }
  })

  marker.on('dragend', () => {
    const pos = marker.getLngLat()
    if (selectedTrip.value) { selectedTrip.value.lng = pos.lng; selectedTrip.value.lat = pos.lat }
  })

  setTimeout(() => map.resize(), 300)
}

function closeMapModal() {
  showMapModal.value = false
  if (map) { map.remove(); map = null; marker = null }
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
            ref="table"
            :data="trips.data.data"
            sticky
            :columns="columns"
            class="text-black"
          />
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
      fullscreen
      class="bg-white z-[60]"
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
        <div class="mt-3 flex gap-4">
          <div>Latitude: {{ selectedTrip?.lat }}</div>
          <div>Longitude: {{ selectedTrip?.lng }}</div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            color="gray"
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
      class="bg-white text-black z-[50]"
    >
      <template #title>
        <p class="text-black">
          {{ isEditMode ? 'Update Trip ' : 'Add Trip' }}
        </p>
      </template>
      <template #body />
      <template #footer>
        <div class="flex justify-end w-full gap-5">
          <UButton
            color="gray"
            variant="ghost"
            @click="showTripModal = false"
          >
            Cancel
          </UButton>
          <UButton
            color="primary"
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
:deep(thead) {
  background-color: #F8A26D !important;
  box-shadow: 2px 2px black !important;
}
</style>
