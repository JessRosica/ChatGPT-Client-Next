<script setup lang="ts">
import assistant from '@/assets/openai-white.svg'
import userAvatar from '@/assets/userAvatars/user_avatar_36.webp'
import MessageContent from '@/components/MessageContent.vue'
const currentTitle = ref('Vue使用localStorage')

const avatar: Record<string, string> = {
  user: userAvatar,
  assistant: assistant
}

// function copyText(text: string): Promise<void> {
//   if (!navigator.clipboard) {
//     return Promise.reject()
//   }
//   return navigator.clipboard.writeText(text)
// }

const messages = [
  {
    id: 1680976980950,
    date: '2023/4/9 02:03:00',
    role: 'user',
    content: 'vue  使用 localStore\n\n\n'
  },
  {
    id: 1680976980950,
    date: '2023/4/9 02:03:00',
    role: 'assistant',
    content:
      "Vue可以使用LocalStorage来存储数据。LocalStorage是浏览器提供的一种本地存储方式，通过它可以在客户端保存键值对数据。\n\n以下是一个例子：\n\n```javascript\n// 存储数据\nlocalStorage.setItem('key', 'value');\n\n// 读取数据\nvar value = localStorage.getItem('key');\nconsole.log(value);\n```\n\n在实际的Vue应用中，我们可以在Vuex中使用LocalStorage来存储全局数据。例如：\n\n```javascript\nimport Vuex from 'vuex';\n\nlet store = new Vuex.Store({\n  state: {\n    count: 0\n  },\n  mutations: {\n    increment(state) {\n      state.count++;\n      localStorage.setItem('count', state.count.toString());\n    },\n    initCount(state) {\n      let count = localStorage.getItem('count');\n      if (count != null) {\n        state.count = parseInt(count);\n      }\n    }\n  }\n});\n\nstore.commit('initCount');\n```\n\n在上面的例子中，我们在increment方法里面更新了count的值，并将其存储到了LocalStorage中。在initCount方法里面，我们通过getItem方法从LocalStorage中读取count的值，并更新到state中。\n\n当我们在其他组件中需要访问count数据的时候，只需要通过this.$store.state.count来获取即可。",
    streaming: false
  }
]
</script>

<template>
  <a-layout-header class="h-14 px-4 flex items-center bg-white">
    <div class="flex flex-col">
      <a-typography-paragraph
        class="m-0"
        editable
        v-model:editText="currentTitle"
      >
        {{ currentTitle }}
      </a-typography-paragraph>
    </div>
    <i class="flex-1"></i>
  </a-layout-header>
  <a-divider class="m-0" />
  <a-layout-content class="flex flex-col flex-1 overflow-hidden">
    <main class="chat-wrapper">
      <a-scrollbar
        outer-style="flex: 1; overflow: hidden;"
        class="overflow-y-auto h-full p-4 grid grid-cols-1 gap-y-2"
      >
        <section
          v-for="item in messages"
          :key="item.id"
          class="message-item"
          :class="item.role === 'assistant' ? 'is-reply' : 'is-request'"
        >
          <a-avatar
            :size="32"
            :class="item.role === 'assistant' ? 'bg-primary p-2' : 'bg-success'"
          >
            <img :src="avatar[item.role] ?? ''" />
          </a-avatar>
          <section
            :class="[
              'flex flex-1 overflow-hidden px-4 py-3 text-sm rounded-lg',
              { 'justify-end bg-white text-primary': item.role === 'user' },
              { 'bg-white': item.role === 'assistant' }
            ]"
          >
            <MessageContent
              :text="item.content"
              :inversion="item.role !== 'assistant'"
            ></MessageContent>
          </section>
        </section>
      </a-scrollbar>
      <a-divider class="m-0" />
      <footer class="w-full flex items-end bg-white px-2 justify-end pt-3 pb-2">
        <a-textarea
          class="bg-white border-none"
          :auto-size="{
            minRows: 3,
            maxRows: 5
          }"
          placeholder="请输入您的信息..."
        />
        <a-button type="primary">
          <template #icon><icon-send /></template>
          发送
        </a-button>
      </footer>
    </main>
  </a-layout-content>
</template>

<style lang="less">
.chat-wrapper {
  @apply flex flex-col overflow-hidden;
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
</style>
