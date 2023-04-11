<script setup lang="ts">
import { ALL_MODELS } from '@/config'
import { useLayoutStore } from '@/store/layout'
import type { ThemeMode } from '@/types/theme'

import { version } from '../../../package.json'
const themeTitleMap: Record<ThemeMode, string> = {
  light: '浅色模式',
  dark: '深色模式',
  auto: '跟随系统'
}
const layoutStore = useLayoutStore()
const { isMobileScreen } = useWindowSize()
const handleChangeTheme = (v: string | number | boolean) => {
  layoutStore.changeModeAction(v as unknown as ThemeMode)
}

enum SubmitKey {
  Enter = 'Enter',
  ShiftEnter = 'Shift + Enter'
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
</script>

<template>
  <a-scrollbar
    outer-style="flex: 1; overflow: hidden;"
    :outer-class="['settings-wrapper', { 'is-mobile': isMobileScreen }]"
    class="overflow-y-auto h-full p-4 grid grid-cols-1 gap-y-2"
  >
    <div class="max-w-4xl w-full mx-auto">
      <a-form
        ref="formRef"
        :label-col-props="{ span: 12 }"
        label-align="left"
        :model="configState"
        class="w-full mt-0 flex flex-col gap-y-3"
      >
        <div class="setting-card dark:bg-dark">
          <a-form-item
            label-col-flex="1"
            :label-attrs="{ align: 'left' }"
            class="mb-0 font-medium pl-4 dark:text-light-900 nowrap"
            field="theme"
            label="Version"
          >
            v{{ version }}
          </a-form-item>
        </div>
        <div class="setting-card dark:bg-dark">
          <a-form-item class="mb-0" field="theme" label="主题">
            <div class="flex flex-wrap gap-y-2 items-center">
              <a-radio-group
                :model-value="layoutStore.themeMode"
                type="button"
                @change="handleChangeTheme"
              >
                <a-radio value="light"><icon-sun /></a-radio>
                <a-radio value="dark"><icon-moon /></a-radio>
                <a-radio value="auto"><icon-relation /></a-radio>
              </a-radio-group>
              <span class="font-medium pl-4 text-primary">
                {{ themeTitleMap[layoutStore.themeMode] }}
              </span>
            </div>
          </a-form-item>
          <a-form-item class="mb-0" field="submitKey" label="发送键">
            <a-select v-if="isMobileScreen" v-model="configState.submitKey">
              <a-option
                v-for="item in Object.values(SubmitKey)"
                :key="item"
                :value="item"
                >{{ item }}</a-option
              >
            </a-select>
            <a-radio-group v-else type="button" v-model="configState.submitKey">
              <a-radio
                v-for="item in Object.values(SubmitKey)"
                :key="item"
                :value="item"
              >
                {{ item }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
        <div class="setting-card dark:bg-dark">
          <a-form-item class="mb-0" field="apiKey" label="Api Key">
            <a-input
              v-model="configState.apiKey"
              placeholder="OpenAI API Key"
            />
          </a-form-item>
        </div>

        <div class="setting-card dark:bg-dark">
          <a-form-item
            field="compressMessageLengthThreshold"
            label="历史消息长度压缩阈值"
          >
            <a-input-number
              :mode="isMobileScreen ? 'button' : 'embed'"
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
              <a-option
                v-for="item in ALL_MODELS"
                :key="item.name"
                :value="item.name"
              >
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

<style lang="less">
.settings-wrapper {
  .setting-card {
    background-color: rgba(247, 248, 250, 0.7);
    @apply rounded-md py-4 flex flex-col gap-y-4 px-6 dark:shadow-md;
  }
  &.is-mobile {
    .arco-form-item.arco-form-item-layout-horizontal {
      flex-direction: column !important;
      &.nowrap {
        flex-direction: row !important;
      }
      .arco-form-item-label-col {
        @apply w-max justify-start whitespace-nowrap;
      }
    }
  }
}
</style>
