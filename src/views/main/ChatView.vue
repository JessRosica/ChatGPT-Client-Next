<script setup lang="ts">
import { Message, type ScrollbarInstance } from '@arco-design/web-vue'

import assistant from '@/assets/openai-white.svg'
import userAvatar from '@/assets/userAvatars/user_avatar_36.webp'
import { useChatStore } from '@/store/chat'
import { useConfigStore } from '@/store/config'
import { SubmitKey } from '@/types/keys'

useCopyCode()
const chatStore = useChatStore()
const configStore = useConfigStore()
const session = computed(() => chatStore.session)
const { isMobileScreen } = useWindowSize()

const avatar: Record<string, string> = {
  user: userAvatar,
  assistant: assistant
}

const scrollbarRef = ref<ScrollbarInstance>()
const currentTitle = ref('新的聊天')
watchEffect(() => {
  currentTitle.value = chatStore.session?.topic || '新的聊天'
})
const message = ref('')

// function copyText(text: string): Promise<void> {
//   if (!navigator.clipboard) {
//     return Promise.reject()
//   }
//   return navigator.clipboard.writeText(text)
// }
const abortController = ref<AbortController>()
const handleSendMessage = () => {
  if (isAllWhitespace(message.value)) {
    Message.clear()
    Message.error('请输入消息内容')
    return
  }
  chatStore.sendMessageAction(
    message.value,
    () => {
      scrollbarRef.value?.scrollTop(
        (scrollbarRef.value?.containerRef?.scrollHeight ?? 0) - 200
      )
    },
    ctl => {
      abortController.value = ctl
    }
  )
  message.value = ''
}

onMounted(() => {
  nextTick(() => {
    scrollbarRef.value?.scrollTop(
      (scrollbarRef.value?.containerRef?.scrollHeight ?? 0) - 200
    )
  })
})
/** 修改提交键 */
const handleSubmitChange = (value: any) => {
  configStore.changeSubmitKeyAction(value as SubmitKey)
}

/**
 * 修改当前标题
 * @param value string 标题
 */
const handleEditEnd = () => {
  chatStore.handleChangeSessionTopicAction(currentTitle.value)
}

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

const handleCopyMessage = (value: string) => {
  copyText({ text: value })
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
        @edit-end="handleEditEnd"
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
        class="overflow-y-auto h-full p-4 flex flex-col gap-y-2"
      >
        <section
          v-for="item in session?.messages ?? []"
          :key="item.id"
          class="message-item"
          :class="[item.role === 'assistant' ? 'is-reply' : 'is-request']"
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
          <small
            v-if="item.streaming && item.role === 'assistant'"
            class="text-info"
          >
            正在输入...
          </small>
          <section
            :class="[
              'message-item__content',
              {
                'is-user': item.role === 'user'
              },
              { 'is-assistant': item.role === 'assistant' }
            ]"
          >
            <div v-if="item.role === 'assistant'" class="message-item__actions">
              <a-tooltip content-class="text-xs" content="复制" position="top">
                <a-button
                  @click="handleCopyMessage(item.content)"
                  size="mini"
                  shape="circle"
                  type="text"
                >
                  <icon-copy class="text-base" />
                </a-button>
              </a-tooltip>
              <!-- <a-tooltip content-class="text-xs" content="复制" position="top">
                <a-button size="mini" shape="circle" type="text">
                  <icon-copy class="text-base" />
                </a-button>
              </a-tooltip>
              <a-tooltip content-class="text-xs" content="重试" position="top">
                <a-button size="mini" shape="circle" type="text">
                  <icon-sync class="text-base" />
                </a-button>
              </a-tooltip>
              <a-divider direction="vertical" :margin="0" /> -->
            </div>
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
        <a-spin :loading="chatStore.fetching" class="footer-spin">
          <template #icon>
            <a-tooltip content-class="text-xs" content="停止" position="top">
              <a-button
                @click="abortController?.abort()"
                shape="circle"
                status="danger"
              >
                <icon-record-stop class="text-lg" />
              </a-button>
            </a-tooltip>
          </template>
          <a-textarea
            v-model="message"
            @keydown.enter.prevent="handleEnter"
            class="bg-white dark:bg-dark-900 border-none"
            :auto-size="{ minRows: 3, maxRows: 5 }"
            placeholder="请输入您的消息..."
          />
          <a-dropdown-button
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
        </a-spin>
      </footer>
    </main>
  </a-layout-content>
</template>

<style lang="less">
.chat-wrapper {
  @apply flex-1 flex flex-col overflow-hidden;
  .message-item {
    @apply flex flex-col items-start justify-items-start gap-2 pl-0;
    max-width: 75%;
    &.is-reply {
      // @apply pr-10;
    }
    &.is-request {
      @apply items-end pl-10 max-w-max ml-auto;
    }
    .message-item__content {
      @apply relative flex flex-col px-4 py-3 text-sm rounded-lg max-w-max;
      &.is-user {
        @apply justify-end bg-primary text-white;
      }

      &.is-assistant {
        @apply bg-white dark:bg-dark;
      }
    }

    .message-item__actions {
      @apply flex items-center gap-x-1 pl-4 absolute -top-9 right-8 opacity-0  transition-all duration-500;
    }
    &:hover .message-item__actions {
      @apply right-0 opacity-100;
    }
  }
}
.chat-footer {
  @apply w-full flex items-end bg-white dark:bg-dark-900 pl-2 pr-4 justify-end pt-3 pb-2;
}

.footer-spin {
  @apply w-full flex flex-col items-center justify-center;
  .arco-spin-mask {
    background-color: rgba(255, 255, 255, 0.92);
  }
}
</style>
