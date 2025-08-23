<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useRoute } from 'vue-router'

const route = useRoute()

const items: NavigationMenuItem[] = [
  { label: 'Dashboard', icon: 'i-lucide-home', to: '/' },
  { label: 'Users', icon: 'i-lucide-user', to: '/users' },
  { label: 'Trips', icon: 'i-lucide-map', to: '/trips' },
  { label: 'Country', icon: 'i-lucide-globe', to: '/country' },
  { label: 'Companies', icon: 'i-lucide-building', to: '/companies' },
]
</script>

<template>
  <UDashboardSidebar
    id="default"
    collapsible
    resizable
    :ui="{ body: 'bg-primary overflow-x-hidden' }"
  >
    <template #default="{ collapsed }">
      <UNavigationMenu
        :collapsed="collapsed"
        :items="items"
        orientation="vertical"
        :ui="{ list: 'space-y-2' }"
      >
        <template #item="itemValue">
          <div class="relative w-full">
            <div
              class="flex items-center text-lg gap-3 cursor-pointer transition-all duration-300 px-6 py-4 relative z-10"
              :class="route.path === itemValue.item.to
                ? 'text-primary font-semibold'
                : 'text-white hover:bg-white/10 rounded-l-3xl'"
            >
              <Icon
                :name="itemValue.item.icon"
                class="text-xl"
              />
              <span>{{ itemValue.item.label }}</span>
            </div>
            <div
              v-if="route.path === itemValue.item.to"
              class="absolute inset-y-0 left-0 right-[-9999px] bg-white rounded-l-3xl"
            />
          </div>
        </template>
      </UNavigationMenu>
    </template>
  </UDashboardSidebar>
</template>
