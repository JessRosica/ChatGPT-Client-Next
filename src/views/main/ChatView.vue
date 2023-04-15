<script setup lang="ts">
import { Message, type ScrollbarInstance } from '@arco-design/web-vue'

import assistant from '@/assets/openai-white.svg'
import userAvatar from '@/assets/userAvatars/user_avatar_36.webp'
import { useChatStore } from '@/store/chat'
import { useConfigStore } from '@/store/config'
import { SubmitKey } from '@/types/keys'

const chatStore = useChatStore()
const configStore = useConfigStore()
const session = computed(() => chatStore.session)
const { isMobileScreen } = useWindowSize()
const avatar: Record<string, string> = {
  user: userAvatar,
  assistant: assistant
}
const scrollbarRef = ref<ScrollbarInstance>()
const currentTitle = ref(chatStore.session?.topic)
const message = ref('')

// function copyText(text: string): Promise<void> {
//   if (!navigator.clipboard) {
//     return Promise.reject()
//   }
//   return navigator.clipboard.writeText(text)
// }

const handleSendMessage = () => {
  if (isAllWhitespace(message.value)) {
    Message.clear()
    Message.error('请输入消息内容')
    return
  }
  chatStore.sendMessageAction(message.value)
  message.value = ''
}

onMounted(() => {
  nextTick(() => {
    scrollbarRef.value?.scrollTop(
      (scrollbarRef.value?.containerRef?.scrollHeight ?? 0) - 200
    )
  })
})
const handleSubmitChange = (value: any) => {
  configStore.changeSubmitKeyAction(value as SubmitKey)
}

// const handleEnter = (e: MouseEvent) => {
//   const isShift = e.shiftKey
//   const isSubmitKey = isShift
//     ? configStore.submitKey === SubmitKey.ShiftEnter
//     : configStore.submitKey === SubmitKey.Enter

//   if (isSubmitKey) {
//     handleSendMessage()
//     return
//   }
//   message.value += '\n'
// }

const handleEnter = (event: KeyboardEvent) => {
  // 如果设置为 "enter 发送消息"
  if (configStore.submitKey === SubmitKey.Enter) {
    // 如果按下了 Shift + Enter，则输入回车符
    if (event.shiftKey && event.code === 'Enter') {
      event.preventDefault()
      message.value += '\n'
    }
    // 如果按下了 Enter，则发送消息
    else if (!event.shiftKey && event.code === 'Enter') {
      event.preventDefault()
      handleSendMessage()
    }
  }
  // 如果设置为 "Shift + Enter 发送消息"
  if (configStore.submitKey === SubmitKey.ShiftEnter) {
    // 如果按下了 Enter，则输入回车符
    if (!event.shiftKey && event.code === 'Enter') {
      event.preventDefault()
      message.value += '\n'
    }
    // 如果按下了 Shift + Enter，则发送消息
    else if (event.shiftKey && event.code === 'Enter') {
      event.preventDefault()
      handleSendMessage()
    }
  }
}
</script>

<template>
  <a-layout-header class="h-14 px-4 flex items-center bg-white dark:bg-dark">
    <div
      class="flex flex-col editable-title__wrapper"
      :class="{ 'is-mobile': isMobileScreen }"
    >
      <a-typography-paragraph
        class="m-0"
        editable
        v-model:editText="currentTitle"
      >
        {{ currentTitle }}
      </a-typography-paragraph>
    </div>
    <i class="flex-1" v-if="!isMobileScreen"></i>
    <a-input-group v-if="!isMobileScreen">
      <ChangeChatModel class="w-44" />
      <SetupCard class="w-60" />
    </a-input-group>
  </a-layout-header>
  <a-divider class="m-0" />
  <a-layout-content class="flex flex-col flex-1 overflow-hidden">
    <main class="chat-wrapper">
      <a-scrollbar
        ref="scrollbarRef"
        outer-style="flex: 1; overflow: hidden;"
        class="overflow-y-auto h-full p-4 grid grid-cols-1 gap-y-2"
      >
        <section
          v-for="item in session?.messages ?? []"
          :key="item.id"
          class="message-item"
          :class="item.role === 'assistant' ? 'is-reply' : 'is-request'"
        >
          <a-spin :loading="item.streaming && item.role === 'assistant'">
            <a-avatar
              :size="32"
              :class="
                item.role === 'assistant' ? 'bg-primary p-2' : 'bg-success'
              "
            >
              <img :src="avatar[item.role] ?? ''" />
            </a-avatar>
          </a-spin>
          <section
            :class="[
              'flex flex-1 overflow-hidden px-4 py-3 text-sm rounded-lg max-w-max',
              {
                'justify-end bg-primary text-white': item.role === 'user'
              },
              { 'bg-white dark:bg-dark': item.role === 'assistant' }
            ]"
          >
            <MessageContent
              :key="item.content"
              :text="item.content"
              :inversion="item.role !== 'assistant'"
            ></MessageContent>
          </section>
        </section>
      </a-scrollbar>
      <a-divider class="m-0" />
      <footer class="chat-footer">
        <a-textarea
          :disabled="chatStore.fetching"
          v-model="message"
          @keydown.enter.prevent="handleEnter"
          class="bg-white dark:bg-dark-900 border-none"
          :auto-size="{ minRows: 3, maxRows: 5 }"
          placeholder="请输入您的信息..."
        />
        <a-dropdown-button
          :disabled="chatStore.fetching"
          @click="handleSendMessage"
          @select="handleSubmitChange"
          type="primary"
        >
          <icon-send class="mr-2" />
          发送
          <template #icon>
            <icon-down />
          </template>
          <template #content>
            <a-doption
              v-for="item in Object.values(SubmitKey)"
              :key="item"
              :value="item"
            >
              <div class="flex items-center gap-x-2 w-32">
                <span class="flex-1"> {{ item }}</span>
                <icon-check
                  v-if="item === configStore.submitKey"
                  class="text-primary"
                />
              </div>
            </a-doption>
          </template>
        </a-dropdown-button>
      </footer>
    </main>
  </a-layout-content>
</template>

<style lang="less">
.chat-wrapper {
  @apply flex-1 flex flex-col overflow-hidden;
  .message-item {
    @apply flex items-start justify-items-start gap-x-2 pl-0;
    &.is-reply {
      @apply pr-10;
    }
    &.is-request {
      @apply flex-row-reverse  pl-10 max-w-max ml-auto;
    }
  }
}
.chat-footer {
  @apply w-full flex items-end bg-white dark:bg-dark-900 pl-2 pr-4 justify-end pt-3 pb-2;
}
</style>
