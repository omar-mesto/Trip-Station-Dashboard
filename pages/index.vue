<script lang="ts" setup>
import { useOverView } from '@@/queries/dashbaord/overView'
import type { overViewModel } from '~/models/overViewModel'

const router = useRouter()
const { data: overView, refresh: refreshOverView } = useOverView()
onMounted(() => refreshOverView())
const overViewData = computed(() => overView.value as overViewModel | undefined)

const isSidebarOpen = ref(true)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <UDashboardGroup class="flex bg-[#F5F5F5] flex-col h-screen sm:overflow-hidden overflow-auto">
    <DashboardNavBar :toggle-sidebar="toggleSidebar"/>

    <div class="flex flex-1">
      <DashboardSideBar :is-open="isSidebarOpen"/>
      <div class="flex-1 p-6">
        <div class=" flex justify-between items-center mb-4">
          <h1 class="text-4xl text-Sequand font-bold pb-2">
            Over View
          </h1>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-20 p-4">
          <UCard
            v-if="overViewData?.data"
            class="shadow-2xl hover:cursor-pointer hover:bg-[#0007660f]"
            @click="router.push('/users')"
          >
            <p class="text-lg text-gray-600 flex items-center">
              <UButton class="py-3 px-3">
                <Icon
                  name="i-lucide-user"
                  class="text-white text-xl over"
                />
              </UButton>
              <span class="mx-4 text-2xl">Users</span>
            </p>
            <div class="flex justify-between py-5 gap-4">
              <p class="font-medium pt-1 text-black">
                Total Users
              </p>
              <p class="text-primary font-bold text-2xl">
                {{ overViewData.data.totalUsers }}
              </p>
            </div>
          </UCard>
          <div
            v-else
            class="shadow-2xl h-52 w-full"
          >
            <USkeleton
              class="h-52 w-full border-0 bg-background rounded"
              :animated="false"
            />
          </div>

          <UCard
            v-if="overViewData?.data"
            class="shadow-2xl hover:cursor-pointer hover:bg-[#0007660f]"
            @click="router.push('/trips')"
          >
            <p class="text-lg text-gray-600 flex items-center">
              <UButton class="py-3 px-3">
                <Icon
                  name="i-lucide-map"
                  class="text-white text-xl"
                />
              </UButton>
              <span class="mx-4 text-2xl">Trips</span>
            </p>
            <div class="flex justify-between py-5 gap-4">
              <p class="font-medium pt-1 text-black">
                Total Trips
              </p>
              <p class="text-primary font-bold text-2xl">
                {{ overViewData.data.totalTrips }}
              </p>
            </div>
          </UCard>
          <div
            v-else
            class="shadow-2xl h-52 w-full"
          >
            <USkeleton
              class="h-52 w-full border-0 bg-background rounded"
              :animated="false"
            />
          </div>

          <UCard
            v-if="overViewData?.data"
            class="shadow-2xl hover:cursor-pointer hover:bg-[#0007660f]"
            @click="router.push('/countries')"
          >
            <p class="text-lg text-gray-600 flex items-center">
              <UButton class="py-3 px-3">
                <Icon
                  name="i-lucide-globe"
                  class="text-white text-xl"
                />
              </UButton>
              <span class="mx-4 text-2xl">Countries</span>
            </p>
            <div class="flex justify-between py-5 gap-4">
              <p class="font-medium pt-1 text-black">
                Total Countries
              </p>
              <p class="text-primary font-bold text-2xl">
                {{ overViewData.data.countriesCount }}
              </p>
            </div>
          </UCard>
          <div
            v-else
            class="shadow-2xl h-52 w-full"
          >
            <USkeleton
              class="h-52 w-full border-0 bg-background rounded"
              :animated="false"
            />
          </div>

          <UCard
            v-if="overViewData?.data"
            class="shadow-2xl hover:cursor-pointer hover:bg-[#0007660f]"
            @click="router.push('/companies')"
          >
            <p class="text-lg text-gray-600 flex items-center">
              <UButton class="py-3 px-3">
                <Icon
                  name="i-lucide-building"
                  class="text-white text-xl"
                />
              </UButton>
              <span class="mx-4 text-2xl">Companies</span>
            </p>
            <div class="flex justify-between py-5 gap-4">
              <p class="font-medium pt-1 text-black">
                Total Companies
              </p>
              <p class="text-primary font-bold text-2xl">
                {{ overViewData.data.totalCompanies }}
              </p>
            </div>
          </UCard>
          <div
            v-else
            class="shadow-2xl h-52 w-full"
          >
            <USkeleton
              class="h-52 w-full border-0 bg-background rounded"
              :animated="false"
            />
          </div>
        </div>
      </div>
    </div>
  </UDashboardGroup>
</template>
