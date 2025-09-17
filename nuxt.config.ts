import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-swiper',
  ],
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    'mapbox-gl/dist/mapbox-gl.css',
  ],
  runtimeConfig: {
    public: {
      mapboxToken: process.env.MAPBOX_TOKEN,
    },
  },
  compatibilityDate: '2024-11-01',
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
