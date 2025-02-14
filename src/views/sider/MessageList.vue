<script setup lang="ts">
import { Message } from '@arco-design/web-vue'

import { useChatStore } from '@/store/chat'
import { useLayoutStore } from '@/store/layout'

defineProps({
  isDrawer: Boolean
})
const layoutStore = useLayoutStore()
const { isMobileScreen } = useWindowSize()
const chatStore = useChatStore()

const handleMenuItemClick = (name: string) => {
  layoutStore.toggleCollapsedAction(false)
  chatStore.changeCurrentChatAction(String(name))
}

type ICommand = 'newChat' | 'editor' | 'del' | 'close'
const handleCommand = (command: ICommand, id?: string) => {
  const markCommandMap: Record<ICommand, () => void> = {
    newChat() {
      chatStore.newChatAction()
      layoutStore.toggleCollapsedAction(false)
    },
    close() {
      layoutStore.toggleCollapsedAction(false)
    },
    editor() {
      Message.info('编辑')
      // chatStore.e
    },
    del() {
      chatStore.removeChatAction(id!)
    }
  }
  markCommandMap[command]()
}
</script>

<template>
  <a-layout-sider :width="240" class="chat-message_list">
    <div class="h-full flex flex-col items-stretch overflow-hidden">
      <div class="h-14 flex items-center px-2 gap-x-2 bg-white dark:bg-dark">
        <a-button
          class="flex-1"
          type="primary"
          @click="handleCommand('newChat')"
        >
          <template #icon>
            <icon-plus />
          </template>
          New Chat
        </a-button>
        <a-button v-if="isMobileScreen" @click="handleCommand('close')">
          <template #icon>
            <icon-close />
          </template>
        </a-button>
      </div>
      <a-divider class="m-0" />
      <a-scrollbar
        outer-style="flex: 1; overflow: hidden;"
        class="overflow-y-auto h-full px-0 flex flex-col gap-y-2"
      >
        <a-menu
          :default-open-keys="['0']"
          :default-selected-keys="['0_1']"
          :selected-keys="[chatStore.currentChat]"
          @menu-item-click="handleMenuItemClick"
        >
          <a-menu-item
            class="chat-item"
            v-for="chat in chatStore.sessions"
            :key="chat.id"
          >
            <span class="flex-1 truncate">
              {{ chat.topic || '新的聊天' }}
            </span>
            <a-button-group size="mini" class="actions">
              <a-button
                @click.stop="handleCommand('del', chat.id)"
                class="flex items-center justify-center"
              >
                <template #icon>
                  <icon-close-circle class="m-0" />
                </template>
              </a-button>
              <ChangeSessionTopic>
                <a-button class="flex items-center justify-center">
                  <template #icon>
                    <icon-edit class="m-0" />
                  </template>
                </a-button>
              </ChangeSessionTopic>
            </a-button-group>
          </a-menu-item>
        </a-menu>
      </a-scrollbar>

      <div class="flex items-center justify-between p-4 bg-white dark:bg-dark">
        <a-link type="primary" @click="chatStore.clearSessions">
          <template #icon><icon-robot-add /></template>
          清除会话
        </a-link>
        <a-link
          @click="() => layoutStore.changeShowContactAction(true)"
          type="primary"
        >
          <template #icon><icon-robot-add /></template>
          加入群聊
        </a-link>
      </div>
    </div>
  </a-layout-sider>
  <a-divider v-if="!isDrawer" class="m-0 h-full" direction="vertical" />
</template>

<style scoped lang="less">
.chat-message_list {
  @apply select-none;
  &.is-mobile {
    width: 100%;
    height: 100%;
  }
}

.chat-item {
  @apply flex items-center relative border border-dashed border-[#f2f3f5] dark:border-[#343435];
  .actions {
    @apply w-0 overflow-hidden  transition-all;
  }
  &:hover .actions {
    @apply w-auto opacity-100;
  }
}
</style>
