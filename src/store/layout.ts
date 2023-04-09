import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const collapsed = ref(false)

  useWindowSize(v => {
    collapsed.value = v
  })

  const toggleCollapsedAction = () => {
    collapsed.value = !collapsed.value
  }

  return { collapsed, toggleCollapsedAction }
})
