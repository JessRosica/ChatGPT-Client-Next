<script setup lang="ts">
import { useLayoutStore } from '@/store/layout'

const layoutStore = useLayoutStore()
const visible = ref(false)

watch(
  () => layoutStore.isShowContact,
  v => {
    visible.value = v
  },
  { immediate: true }
)

const handleCloseContactModel = () => {
  visible.value = false
  layoutStore.changeShowContactAction(false)
}
</script>

<template>
  <a-modal
    class="contact-model"
    :esc-to-close="false"
    :mask-closable="false"
    title-align="start"
    v-model:visible="visible"
    @close="handleCloseContactModel"
  >
    <template #title>
      <div class="header-logo gap-x-2">
        <img class="w-6 h-6" src="@/assets/openai.svg" alt="1024 智能 AI" />
        <h1 class="text-base m-0">1024 智能 AI</h1>
      </div>
    </template>
    <div>
      一款<mark>免费</mark>、<mark>免登录</mark>和<mark>无需魔法</mark>的ChatGPT工具
    </div>
    <div>
      网址经常变更，所以使用前一定要记得先加群！！！ 群内不定时
      <mark>发放免费gpt独享账号</mark>
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
    <template #footer>
      <div class="flex items-center justify-center">
        <a-button @click="handleCloseContactModel" type="primary">
          我已加入
        </a-button>
      </div>
    </template>
  </a-modal>
</template>

<style lang="less">
.contact-model {
  width: 100%;
  .arco-modal {
    width: 90%;
    max-width: 640px;
  }
}
</style>
