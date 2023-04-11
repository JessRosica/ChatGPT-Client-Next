<script setup lang="ts">
import { Message } from '@arco-design/web-vue'

import userAvatar from '@/assets/userAvatars/user_avatar_36.webp'
import { useLayoutStore } from '@/store/layout'
const route = useRoute()
const router = useRouter()
const { isMobileScreen } = useWindowSize()
const visible = ref(false)
const current = computed(() => route.name)

const layoutStore = useLayoutStore()
const handleMenuItemClick = (name: string) => {
  try {
    router.push({ name })
  } catch (_) {
    Message.error('路由未实现~')
  }
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
        <a-menu-item key="Settings">
          <template #icon><icon-settings /></template>
          设置
        </a-menu-item>
        <a-menu-item key="About">
          <template #icon><icon-info-circle /></template>
          关于我们
        </a-menu-item>
      </a-menu>
      <i class="flex-1"></i>
      <a-avatar
        :image-url="userAvatar"
        :size="32"
        :style="{ backgroundColor: '#14C9C9' }"
      >
      </a-avatar>
    </a-layout-header>
    <a-divider class="m-0" />
    <a-layout class="flex-1 overflow-hidden relative">
      <RouterView name="sider"></RouterView>
      <a-layout class="flex-1 overflow-hidden">
        <RouterView />
      </a-layout>
    </a-layout>
  </a-layout>
  <a-modal :width="640" v-model:visible="visible" :footer="false">
    <template #title>
      <div class="header-logo gap-x-2">
        <img class="w-6 h-6" src="@/assets/openai.svg" alt="1024 智能 AI" />
        <h1 class="text-base m-0">1024 智能 AI</h1>
      </div>
    </template>
    <div>一款免费、免登录和无需魔法的ChatGPT工具</div>
    <div>
      网址经常变更，所以使用前一定要记得先加群！！！
      群内不定时发放免费gpt独享账号
    </div>
    <div class="grid grid-cols-2">
      <div class="flex flex-col items-center gap-y-2 py-2">
        <img
          class="max-w-11/12 border-solid border border-gray-200 p-1"
          alt="QQ"
          src="/QQ.png"
        />
        <span class="">QQ群</span>
      </div>
      <div class="flex flex-col items-center gap-y-2 py-2">
        <img
          class="max-w-11/12 border-solid border border-gray-200 p-1"
          alt="WeChat"
          src="/WeChat.png"
        />
        <span class="">微信群</span>
      </div>
    </div>
  </a-modal>
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
