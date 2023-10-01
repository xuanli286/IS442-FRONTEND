import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  const loginUser = ref({})

  return { 
    loginUser,
  }
})