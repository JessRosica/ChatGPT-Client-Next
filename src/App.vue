<script setup lang="ts">
import { Message } from '@arco-design/web-vue'
import type { RouterLink } from 'vue-router'

import userAvatar from '@/assets/userAvatars/user_avatar_36.webp'
import { useLayoutStore } from '@/store/layout'

import ContactModel from './components/ContactModel.vue'
import { useConfigStore } from './store/config'
import MessageListDrawer from './views/sider/MessageListDrawer.vue'
import SettingDrawer from './views/sider/SettingDrawer.vue'
const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const { isMobileScreen } = useWindowSize()
const current = computed(() => route.name)
const popupVisible = ref(false)
const setupCardLoading = computed(() => configStore.setupCardLoading)

const layoutStore = useLayoutStore()
const handleMenuItemClick = (name: string) => {
  try {
    router.push({ name })
  } catch (_) {
    Message.error('路由未实现~')
  }
}
const handleToRouter = (path: string) => {
  popupVisible.value = false
  router.push(path)
}
</script>

<template>
  <a-layout class="w-full h-full bg-[var(--color-neutral-1)]">
    <a-layout-header
      class="h-14 flex items-center bg-white dark:bg-dark pr-6"
      :class="{ 'pl-2': !$route.meta?.hideLogoText && isMobileScreen }"
    >
      <a-button
        @click="layoutStore.toggleCollapsedAction"
        v-if="!$route.meta?.hideLogoText && isMobileScreen"
      >
        <template #icon><icon-menu /></template>
      </a-button>

      <RouterLink
        to="/"
        class="header-logo"
        :class="[
          { 'is-mobile': isMobileScreen },
          $route.meta?.hideLogoText ? 'justify-start pl-4' : 'justify-center'
        ]"
      >
        <img class="w-8 h-8" src="@/assets/openai.svg" alt="1024 智能 AI" />
        <h1 class="text-base m-0">1024 智能 AI</h1>
      </RouterLink>
      <!-- 移动端不显示 -->
      <a-menu
        v-if="!isMobileScreen"
        @menu-item-click="handleMenuItemClick"
        mode="horizontal"
        :selected-keys="[current]"
        class="header-menu"
      >
        <a-menu-item key="Chat" class="ml-auto">
          <template #icon><icon-message /></template>
          聊天
        </a-menu-item>
        <a-menu-item key="Tools">
          <template #icon><icon-apps /></template>
          工具
        </a-menu-item>
        <a-menu-item key="Tutorial">
          <template #icon><icon-question-circle /></template>
          使用说明
        </a-menu-item>
        <a-menu-item key="About">
          <template #icon><icon-info-circle /></template>
          关于我们
        </a-menu-item>
      </a-menu>
      <i class="flex-1"></i>
      <a-popover
        trigger="click"
        v-model:popup-visible="popupVisible"
        content-class="mr-2"
      >
        <a-avatar
          :image-url="userAvatar"
          :size="32"
          :style="{ backgroundColor: '#14C9C9' }"
        >
        </a-avatar>
        <template #content>
          <a-card
            class="w-48 h-[100px] overflow-hidden rounded mb-2"
            :loading="setupCardLoading"
            :bordered="false"
          >
            <a-descriptions size="mini" :column="1">
              <a-descriptions-item label="账号">
                <span
                  class="flex items-center gap-x-4"
                  :class="[
                    configStore.cardInfo ? 'text-primary' : 'text-danger'
                  ]"
                >
                  <span>{{ configStore.cardInfo ? '会员' : '游客' }}</span>
                  <a-button
                    size="mini"
                    type="text"
                    @click="configStore.setupCardAction(configStore.card)"
                    shape="circle"
                  >
                    <icon-refresh />
                  </a-button>
                </span>
              </a-descriptions-item>
              <a-descriptions-item label="状态">
                <a-badge
                  size="small"
                  :status="
                    configStore.cardInfo?.enable ? 'processing' : 'danger'
                  "
                  :text="
                    configStore.cardInfo
                      ? configStore.cardInfo?.enable
                        ? '正常'
                        : '禁用'
                      : '正常'
                  "
                />
              </a-descriptions-item>
              <a-descriptions-item label="积分">
                <template v-if="configStore.cardInfo">
                  <span class="text-primary">
                    {{ configStore.cardInfo?.remain_points || 0 }}
                  </span>
                  /
                  <span class="text-info">
                    {{ configStore.cardInfo?.points || 0 }}
                  </span>
                </template>
                <span v-else class="text-primary">每日五次免费调用</span>
              </a-descriptions-item>
            </a-descriptions>
          </a-card>
          <div class="grid grid-cols-2 gap-3">
            <a-button @click="handleToRouter('chat')">聊天</a-button>
            <a-button @click="handleToRouter('/tools')">工具</a-button>
            <a-button @click="handleToRouter('/tutorial')">使用说明</a-button>
            <a-button @click="handleToRouter('/about')">关于我们</a-button>
            <SettingDrawer />
            <a-button
              target="_blank"
              href="https://www.houfaka.com/links/193B8193"
            >
              购买会员
            </a-button>
          </div>
        </template>
      </a-popover>
    </a-layout-header>
    <a-divider class="m-0" />
    <a-layout class="flex-1 overflow-hidden relative">
      <RouterView v-if="!isMobileScreen" name="sider"></RouterView>
      <a-layout class="flex-1 overflow-hidden">
        <RouterView />
      </a-layout>
    </a-layout>
  </a-layout>
  <MessageListDrawer v-model:visible="layoutStore.collapsed" />
  <ContactModel />
</template>

<style lang="less" scoped>
:deep(.arco-tabs-nav-tab-list) {
  @apply w-full flex items-center;
  .arco-tabs-tab {
    @apply flex-1;
  }
}
.header-menu {
  :deep(.arco-menu-icon) {
    @apply mr-0;
  }
  :deep(.arco-menu-selected-label) {
    @apply left-0 right-0;
  }
}
</style>
