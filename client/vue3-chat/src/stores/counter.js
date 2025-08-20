import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('counter', () => {
  const username = ref('')
  const setUsername = (name) => {
    username.value = name
  }

  return { username, setUsername }
})
