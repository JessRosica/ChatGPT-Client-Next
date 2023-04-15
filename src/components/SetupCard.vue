<script setup lang="ts">
import { useConfigStore } from '@/store/config'

const configStore = useConfigStore()
const card = ref('')
const handleChangeMode = (value: string) => {
  configStore.setupCardAction(value)
}
onMounted(() => {
  card.value = configStore.card
})
</script>

<template>
  <a-input
    v-model="card"
    @change="handleChangeMode"
    :allow-clear="false"
    placeholder="Please input card..."
  >
  </a-input>
</template>

<style scoped></style>
