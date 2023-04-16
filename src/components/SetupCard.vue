<script setup lang="ts">
import { debounce } from 'lodash-es'

import { useConfigStore } from '@/store/config'

const configStore = useConfigStore()
const card = ref('')
const loading = computed(() => configStore.setupCardLoading)

const handleInputCard = debounce((value: string) => {
  configStore.setupCardAction(value)
}, 500)

onMounted(() => {
  card.value = configStore.card
})
</script>

<template>
  <a-spin :loading="loading">
    <a-input
      v-model="card"
      @input="handleInputCard"
      :allow-clear="false"
      placeholder="请输入积分卡"
    >
    </a-input>
  </a-spin>
</template>

<style scoped></style>
