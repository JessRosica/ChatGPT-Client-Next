<template>
  <a-layout-sider class="shadow-none w-60">
    <div class="h-full flex flex-col items-stretch overflow-hidden">
      <div class="h-14 flex items-center px-4">
        <a-button long type="primary">
          <template #icon>
            <icon-plus />
          </template>
          New Chat
        </a-button>
      </div>
      <a-scrollbar
        outer-style="flex: 1; overflow: hidden;"
        class="overflow-y-auto h-full px-0 grid grid-cols-1 gap-y-2"
      >
        <a-menu :default-open-keys="['0']" :default-selected-keys="['0_2']">
          <a-menu-item key="0_1"> 用ts写一段关于格式化sql的代码 </a-menu-item>
          <a-menu-item key="0_2">Vue使用localStorage</a-menu-item>
          <a-menu-item key="0_3">WebTorrent P2P 视频播放</a-menu-item>
        </a-menu>
      </a-scrollbar>

      <div class="flex items-center justify-between p-4">
        <a-link type="primary">
          <template #icon><icon-robot-add /></template>
          清除会话
        </a-link>
        <a-link type="primary">
          <template #icon><icon-robot-add /></template>
          加入群聊
        </a-link>
      </div>
    </div>
  </a-layout-sider>
  <a-divider class="m-0 h-full" direction="vertical" />
</template>

<script setup lang="ts"></script>

<style scoped></style>
