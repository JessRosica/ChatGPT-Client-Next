import { defineStore } from 'pinia'

import type { ThemeMode } from '@/types/theme'

export const useLayoutStore = defineStore(
  '__AI_1024_STORE_LAYOUT',
  () => {
    const collapsed = ref(false)
    const themeMode = ref<ThemeMode>('light')

    useWindowSize(v => {
      collapsed.value = v
    })

    // 切换主题模式
    function changeModeAction(mode: ThemeMode) {
      themeMode.value = mode
    }

    // 监听主题模式的变化
    watchEffect(() => {
      if (themeMode.value === 'dark') {
        document.documentElement.classList.add('dark')

        document.body.setAttribute('arco-theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.body.removeAttribute('arco-theme')
      }
    })

    const toggleCollapsedAction = () => {
      collapsed.value = !collapsed.value
    }
    return { collapsed, themeMode, toggleCollapsedAction, changeModeAction }
  },
  {
    persist: [
      {
        storage: localStorage,
        paths: ['themeMode']
      }
    ]
  }
)
