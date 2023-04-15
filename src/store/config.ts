import { defineStore } from 'pinia'

import type { ChatModel } from '@/types/chat'
import { SubmitKey } from '@/types/keys'
import type { ThemeMode } from '@/types/theme'

export const useConfigStore = defineStore(
  '__AI_1024_STORE_CONFIG',
  () => {
    const bootstrap = ref({
      $schema: '',
      api: '',
      modules: ['CHAT']
    })

    onMounted(() => {
      fetch('/bootstrap.json')
        .then(res => res.json())
        .then(res => {
          bootstrap.value = res
        })
    })

    // 侧边栏是否显示
    const collapsed = ref(false)

    // 主题
    const themeMode = ref<ThemeMode>('light')

    // 聊天模型
    const chatModel = ref<ChatModel>('gpt-3.5-turbo')

    // 积分卡
    const card = ref<string>('')

    // 发送按键
    const submitKey = ref<SubmitKey>(SubmitKey.ShiftEnter)

    // 温度
    const temperature = ref<number>(0.1)

    useWindowSize(v => {
      collapsed.value = v
    })

    // 切换积分卡
    function setupCardAction(payload: string) {
      card.value = payload
    }

    // 切换主题模式
    function changeModeAction(mode: ThemeMode) {
      themeMode.value = mode
    }

    // 切换模型
    function changeChatModelAction(model: ChatModel) {
      chatModel.value = model
    }

    // 切换发送键
    function changeSubmitKeyAction(key: SubmitKey) {
      submitKey.value = key
    }

    // 改变温度
    function changeTemperatureAction(value: number) {
      if (value < 0.1) {
        temperature.value = 0.1
        return
      }
      if (value > 2) {
        temperature.value = 2
        return
      }
      temperature.value = value
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
    // 切换侧边栏是否显示
    const toggleCollapsedAction = () => {
      collapsed.value = !collapsed.value
    }

    return {
      bootstrap,
      card,
      collapsed,
      themeMode,
      chatModel,
      submitKey,
      temperature,
      toggleCollapsedAction,
      changeModeAction,
      setupCardAction,
      changeChatModelAction,
      changeSubmitKeyAction,
      changeTemperatureAction
    }
  },
  {
    persist: [
      {
        storage: localStorage,
        paths: ['themeMode', 'chatModel', 'card', 'submitKey', 'temperature']
      }
    ]
  }
)
