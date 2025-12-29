import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const isDark = ref(false)
  const theme = computed(() => (isDark.value ? 'dark' : 'light'))
  const toggleDark = (val: string | number | boolean) => {
    if (val) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return { theme, isDark, toggleDark }
})
