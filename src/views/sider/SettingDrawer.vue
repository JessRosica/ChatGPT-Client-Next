<script lang="ts" setup>
import SettingsView from '../main/SettingsView.vue'
const visible = ref(false)
</script>

<template>
  <div @click="visible = true" class="cursor-pointer">
    <slot></slot>
  </div>
  <a-drawer
    v-model:visible="visible"
    width="100%"
    class="settings-drawer"
    title="设置中心"
    cancel-text="关闭"
    :drawer-style="{ maxWidth: '500px' }"
  >
    <SettingsView />
  </a-drawer>
</template>

<style scoped></style>
