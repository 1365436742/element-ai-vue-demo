import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {
  const isDark = ref(document.documentElement.classList.contains('dark'))
  const sidebarOpen = ref(false)
  const theme = computed(() => (isDark.value ? 'dark' : 'light'))
  const toggleDark = (value: boolean) => {
    isDark.value = value
    document.documentElement.classList.toggle('dark', value)
    try {
      localStorage.setItem('element-ai-theme', value ? 'dark' : 'light')
    } catch {
      /* Theme still works when storage is unavailable. */
    }
  }
  try {
    toggleDark(localStorage.getItem('element-ai-theme') === 'dark')
  } catch {
    /* Use the default theme. */
  }
  return { theme, isDark, sidebarOpen, toggleDark }
})
