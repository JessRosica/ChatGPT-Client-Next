<template>
  <a-scrollbar
    outer-style="flex: 1; overflow: hidden;"
    class="overflow-y-auto h-full p-4 grid grid-cols-1 gap-y-2"
  >
    <div class="max-w-4xl w-full mx-auto">
      <a-breadcrumb class="my-6">
        <a-breadcrumb-item>
          <a-link @click="$router.back">
            <icon-arrow-left />
            返回
          </a-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>设置中心</a-breadcrumb-item>
      </a-breadcrumb>
      <a-form
        ref="formRef"
        :model="configState"
        class="w-full mt-0 flex flex-col gap-y-3"
      >
        <div class="setting-card">
          <a-form-item class="mb-0" field="theme" label="Version">
            v{{ version }}
          </a-form-item>
        </div>
        <div class="setting-card">
          <a-form-item class="mb-0" field="theme" label="主题">
            <a-radio-group v-model="configState.theme" type="button">
              <a-radio value="auto"><icon-relation /></a-radio>
              <a-radio value="dark"><icon-moon /></a-radio>
              <a-radio value="light"><icon-sun /></a-radio>
            </a-radio-group>
            <span class="pl-4">{{ themeTitleMap[configState.theme] }}</span>
          </a-form-item>
          <a-form-item class="mb-0" field="submitKey" label="发送键">
            <a-radio-group type="button" v-model="configState.submitKey">
              <a-radio v-for="item in Object.values(SubmitKey)" :value="item">
                {{ item }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
        <div class="setting-card">
          <a-form-item class="mb-0" field="apiKey" label="Api Key">
            <a-input
              v-model="configState.apiKey"
              placeholder="OpenAI API Key"
            />
          </a-form-item>
        </div>

        <div class="setting-card">
          <a-form-item
            field="compressMessageLengthThreshold"
            label="历史消息长度压缩阈值"
          >
            <a-input-number
              mode="button"
              v-model="configState.compressMessageLengthThreshold"
              :min="500"
              :max="4000"
              :precision="1"
            />
          </a-form-item>

          <a-form-item
            class="mb-0"
            field="modelConfig.model"
            label="模型(Model)"
          >
            <a-select
              v-model="configState.modelConfig.model"
              placeholder="Please select ..."
              allow-clear
            >
              <a-option v-for="item in ALL_MODELS" :value="item.name">
                {{ item.name }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item
            class="mb-0"
            field="modelConfig.temperature"
            label="随机性 (temperature)"
          >
            <a-slider
              v-model="configState.modelConfig.temperature"
              :step="0.1"
              :min="0"
              :max="2"
            />
          </a-form-item>
        </div>
      </a-form>
    </div>
  </a-scrollbar>
</template>

<script setup lang="ts">
import { version } from '../../../package.json'
const themeTitleMap: Record<string, string> = {
  auto: '跟随系统',
  dark: '深色模式',
  light: '浅色模式'
}

const ENABLE_GPT4 = true

const ALL_MODELS = [
  {
    name: 'gpt-4',
    available: ENABLE_GPT4
  },
  {
    name: 'gpt-4-0314',
    available: ENABLE_GPT4
  },
  {
    name: 'gpt-4-32k',
    available: ENABLE_GPT4
  },
  {
    name: 'gpt-4-32k-0314',
    available: ENABLE_GPT4
  },
  {
    name: 'gpt-3.5-turbo',
    available: true
  },
  {
    name: 'gpt-3.5-turbo-0301',
    available: true
  }
]

enum SubmitKey {
  Enter = 'Enter',
  CtrlEnter = 'Ctrl + Enter',
  ShiftEnter = 'Shift + Enter',
  AltEnter = 'Alt + Enter',
  MetaEnter = 'Meta + Enter'
}
const configState = reactive({
  theme: 'auto',
  apiKey: '',
  submitKey: SubmitKey.Enter,
  historyMessageCount: 4,
  compressMessageLengthThreshold: 1000,
  modelConfig: {
    model: 'gpt-3.5-turbo',
    temperature: 0.1,
    max_tokens: 2000,
    presence_penalty: 0
  }
})
const options = [
  {
    value: 'beijing',
    label: 'Beijing',
    children: [
      {
        value: 'chaoyang',
        label: 'ChaoYang',
        children: [
          {
            value: 'datunli',
            label: 'Datunli'
          }
        ]
      },
      {
        value: 'haidian',
        label: 'Haidian'
      },
      {
        value: 'dongcheng',
        label: 'Dongcheng'
      },
      {
        value: 'xicheng',
        label: 'XiCheng'
      }
    ]
  },
  {
    value: 'shanghai',
    label: 'Shanghai',
    children: [
      {
        value: 'shanghaishi',
        label: 'Shanghai',
        children: [
          {
            value: 'huangpu',
            label: 'Huangpu'
          }
        ]
      }
    ]
  }
]
const treeData = [
  {
    key: 'node1',
    title: 'Node1',
    children: [
      {
        key: 'node2',
        title: 'Node2'
      }
    ]
  },
  {
    key: 'node3',
    title: 'Node3',
    children: [
      {
        key: 'node4',
        title: 'Node4'
      },
      {
        key: 'node5',
        title: 'Node5'
      }
    ]
  }
]
</script>

<style scoped lang="less">
.setting-card {
  @apply bg-white rounded-md py-4 flex flex-col gap-y-4 px-6;
}
</style>
