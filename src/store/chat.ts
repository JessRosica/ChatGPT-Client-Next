import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { ChatItem } from '@/types/chat'

export const useChatStore = defineStore(
  '__AI_1024_STORE_CHAT',
  () => {
    const newChat: ChatItem = {
      id: genNonDuplicateID(),
      topic: '新的聊天',
      sendMemory: true,
      messages: [],
      lastUpdate: new Date().getTime(),
      lastSummarizeIndex: 0
    }
    const currentChat = ref<string>()
    const sessions = ref<ChatItem[]>([])
    const newChatAction = () => {
      const id = genNonDuplicateID()
      sessions.value.unshift(
        cloneDeep({
          ...newChat,
          topic: `新聊天${sessions.value.length + 1}`,
          id
        })
      )
      currentChat.value = id
    }

    const changeCurrentChatAction = (id: string) => {
      currentChat.value = id
    }

    const removeChatAction = (id: string) => {
      console.log({ id, currentChat: currentChat.value })
      // 如果删除的不是当前选中的 直接删除
      const index = sessions.value.findIndex(({ id }) => id === id)
      if (id !== currentChat.value) {
        sessions.value.splice(index, 1)
      } else {
        if (sessions.value.length > 1) {
          currentChat.value =
            sessions.value[index === 0 ? index + 1 : index - 1].id
        }
        sessions.value.splice(index, 1)
        if (sessions.value.length === 0) {
          newChatAction()
        }
      }
    }

    onMounted(() => {
      sessions.value = []
      if (sessions.value?.length < 1) {
        newChatAction()
      }
    })

    return {
      sessions,
      currentChat,
      newChatAction,
      removeChatAction,
      changeCurrentChatAction
    }
  },
  {
    persist: {
      storage: localStorage
    }
  }
)
