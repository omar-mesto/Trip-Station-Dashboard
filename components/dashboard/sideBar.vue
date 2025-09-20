<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
defineProps<{ isOpen: boolean }>()

const navItems = [
  { label: 'Dashboard', icon: 'i-lucide-home', to: '/' },
  { label: 'Users', icon: 'i-lucide-user', to: '/users' },
  { label: 'Trips', icon: 'i-lucide-map', to: '/trips' },
  { label: 'Country', icon: 'i-lucide-globe', to: '/countries' },
  { label: 'Companies', icon: 'i-lucide-building', to: '/companies' },
]
</script>

<template>
  <aside class="fixed md:static w-64 bg-primary text-white flex flex-col transition-transform duration-300 z-50"
    :class="{
      '-translate-x-full': !isOpen,
      'translate-x-0 w-full h-full': isOpen,
      'md:w-64 md:h-auto md:translate-x-0': true
    }">
    <nav class="flex-1 mt-6 pl-5">
      <ul class="space-y-2">
        <li
          v-for="item in navItems"
          :key="item.to"
          :class="route.path === item.to
            ? 'bg-white text-primary font-semibold rounded-l-3xl'
            : 'hover:bg-white/10 rounded-l-3xl'"
          class="flex items-center gap-3 px-6 py-4 cursor-pointer transition"
          @click="router.push(item.to)"
        >
          <Icon
            :name="item.icon"
            class="text-xl"
          />
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>
