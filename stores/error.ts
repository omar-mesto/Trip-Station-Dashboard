import { defineStore } from 'pinia'

export const useErrorStore = defineStore('error', {
  state: () => ({
    message: null as string | null,
  }),
  actions: {
    setMessage(error: string | null) {
      this.message = error
    },
  },
})
