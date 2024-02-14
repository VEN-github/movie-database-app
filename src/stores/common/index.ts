import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useCommonStore = defineStore('common', () => {
  const layout = useLocalStorage('layout', 'grid')

  return {
    layout
  }
})
