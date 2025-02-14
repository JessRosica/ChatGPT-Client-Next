import { defineStore } from 'pinia'

import type { ThemeMode } from '@/types/theme'

export const useLayoutStore = defineStore(
  '__AI_1024_STORE_LAYOUT',
  () => {
    // 联系我们弹窗
    const isShowContact = ref(true)
    const collapsed = ref(false)
    const themeMode = ref<ThemeMode>('light')

    useWindowSize(() => {
      collapsed.value = false
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

    const changeShowContactAction = (payload: boolean) => {
      isShowContact.value = payload
    }

    const toggleCollapsedAction = (payload?: boolean) => {
      collapsed.value = payload !== undefined ? payload : !collapsed.value
    }

    return {
      collapsed,
      isShowContact,
      themeMode,
      toggleCollapsedAction,
      changeModeAction,
      changeShowContactAction
    }
  },
  {
    persist: [
      {
        storage: localStorage,
        paths: ['themeMode']
      },
      {
        storage: sessionStorage,
        paths: ['isShowContact']
      }
    ]
  }
)
