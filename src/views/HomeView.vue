<template>
  <div class="home-logo__wrapper">
    <img src="@/assets/openai.svg" alt="1024 智能 AI" />
    <h1>1024 智能 AI</h1>
  </div>
  <div class="feature-grid">
    <article class="feature">
      <a-button class="icon">🤖</a-button>
      <h2 class="title">智能问答</h2>
      <p class="details">
        对您提出的问题进行回答，根据问题的语义和上下文提供最准确的答案
      </p>
    </article>
    <article class="feature">
      <a-button class="icon">🌐</a-button>
      <h2 class="title">自动翻译</h2>
      <p class="details">
        对您输入的内容进行翻译，将其翻译成指定语言，方便跨语言交流。
      </p>
    </article>
    <article class="feature">
      <a-button class="icon">💡</a-button>
      <h2 class="title">文案生成</h2>
      <p class="details">
        根据您的需求，自动生成符合行业标准的广告文案、营销文案等，提高您的创意和效率。
      </p>
    </article>
    <article class="feature">
      <a-button class="icon">📝</a-button>
      <h2 class="title">智能写作</h2>
      <p class="details">
        根据您提供的主题和要求，自动生成高质量的文章、作文、论文等内容，方便您的写作和创作。
      </p>
    </article>
    <article class="feature">
      <a-button class="icon">🔍</a-button>
      <h2 class="title">自动摘要</h2>
      <p class="details">
        自动提取文章的关键信息和摘要，帮助您快速了解文章内容。
      </p>
    </article>
    <article class="feature">
      <a-button class="icon">✏️</a-button>
      <h2 class="title">自动纠错</h2>
      <p class="details">
        根据您输入的内容进行语法和拼写纠错，提高文本质量和可读性。
      </p>
    </article>
  </div>
  <a-button
    type="primary"
    shape="round"
    class="max-w-max mx-auto mt-6"
    @click="$router.push({ name: 'Chat' })"
  >
    Go Chat
  </a-button>
</template>

<style lang="less" scoped>
.home-logo__wrapper {
  @apply flex flex-col items-center justify-center text-primary pt-10;
}
.feature-grid {
  @apply grid grid-cols-3 max-w-6xl w-full mx-auto gap-6 pt-4;
  .feature {
    background-color: var(--color-secondary);
    @apply p-4;
    .icon {
      @apply bg-gray-200 text-xl h-10 w-10 p-0 rounded-md;
    }
  }
}
</style>
