import { Modal } from '@arco-design/web-vue'
import { cloneDeep } from 'lodash-es'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { ChatItem, MessageItem, MessageModel } from '@/types/chat'
import { createMessage } from '@/utils'

import { useConfigStore } from './config'

export const useChatStore = defineStore(
  '__AI_1024_STORE_CHAT',
  () => {
    const configStore = useConfigStore()
    const newChat: ChatItem = {
      id: genNonDuplicateID(),
      topic: '',
      sendMemory: true,
      messages: [],
      lastUpdate: new Date().getTime(),
      lastSummarizeIndex: 0
    }
    const currentChat = ref<string>()
    const sessions = ref<ChatItem[]>([])
    const session = ref<ChatItem>()
    const fetching = ref<boolean>(false)

    watchEffect(() => {
      session.value = sessions.value.find(({ id }) => id === currentChat.value)
    })

    /** 新加一个聊天 */
    const newChatAction = () => {
      const id = genNonDuplicateID()
      sessions.value.unshift(
        cloneDeep({
          ...newChat,
          topic: '',
          id
        })
      )
      currentChat.value = id
    }

    const clearSessions = () => {
      Modal.warning({
        title: '操作提示',
        hideCancel: false,
        alignCenter: false,
        content: '是否确认移除所有会话信息, 此操作不可逆!!!',
        onOk() {
          sessions.value = []
          newChatAction()
        }
      })
    }
    /** 选中聊天 */
    const changeCurrentChatAction = (id: string) => {
      currentChat.value = id
    }

    /** 删除一个聊天 */
    const removeChatAction = (id: string) => {
      Modal.warning({
        title: '操作提示',
        hideCancel: false,
        alignCenter: false,
        content: '是否确认移除当前选择会话?',
        onOk() {
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
      })
    }

    const getMessageById = (mId: string): MessageItem => {
      return session.value?.messages.find(({ id }) => mId === id)!
    }

    // const genTitleAction = (
    //   content: string,
    //   onMessage: (message: string) => void
    // ) => {
    //   const reqData: MessageModel = {
    //     card: configStore.card,
    //     messages: [{ role: 'user', content }],
    //     model: configStore.chatModel,
    //     is_stream: true
    //   }
    //   requestChatTitle(reqData, onMessage)
    // }

    /** 发送消息 */
    const sendMessageAction = (content: string) => {
      const reqData: MessageModel = {
        card: configStore.card,
        messages: [{ role: 'user', content }],
        model: configStore.chatModel,
        is_stream: true
      }
      const userMessage: MessageItem = createMessage({
        role: 'user',
        content
      })

      session.value!.messages.push(userMessage)
      const botMessage: MessageItem = createMessage({
        role: 'assistant',
        streaming: true,
        content: ''
      })
      session.value!.messages.push(botMessage)

      requestChatStream(reqData, {
        onMessage(message: string, done: boolean) {
          fetching.value = true
          getMessageById(botMessage.id).content = message
          if (done) {
            fetching.value = false
            getMessageById(botMessage.id).streaming = false
            getMessageById(botMessage.id).date = new Date().valueOf()
            if (!session.value?.topic) {
              session.value!.topic = userMessage.content
                .trim()
                .replace(/\r/g, '')
            }
          }
        },
        onError(error: Error, statusCode?: number) {
          console.log(error.message, statusCode)
          fetching.value = false
          if (statusCode === 401) {
            getMessageById(botMessage.id).content =
              '现在是未授权状态，请输入会员卡'
          } else {
            getMessageById(botMessage.id).content +=
              statusCode !== undefined
                ? '\n\n' + error?.message ?? '出错了，稍后重试吧'
                : '网络异常, 请稍后重试!'
          }
          getMessageById(botMessage.id).streaming = false
          // userMessage.isError = true
          getMessageById(botMessage.id).isError = true
          getMessageById(botMessage.id).date = new Date().valueOf()
        }
      })
    }
    /** 初始化判断是否有聊天, 没有创建一个空的 */
    onMounted(() => {
      // sessions.value = []
      if (sessions.value?.length < 1) {
        newChatAction()
      }
    })
    return {
      session,
      sessions,
      fetching,
      currentChat,
      newChatAction,
      clearSessions,
      removeChatAction,
      sendMessageAction,
      changeCurrentChatAction
    }
  },
  // 保存到本地 localStorage
  {
    persist: {
      storage: localStorage
    }
  }
)
