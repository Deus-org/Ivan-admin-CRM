<template>
  <div class="toast-container">
    <Toast
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      :toast="toast"
      @close="toastStore.remove(toast.id)"
    />
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
import Toast from './Toast.vue'

const toastStore = useToastStore()
</script>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 300px;
}
</style>
