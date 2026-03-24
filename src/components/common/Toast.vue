<template>
  <div :class="['toast', `toast-${toast.type}`]">
    <span>{{ toast.message }}</span>
    <button class="toast-close" @click="close">&times;</button>
  </div>
</template>

<script setup lang="ts">
import type { Toast } from '@/stores/toast'

defineProps<{
  toast: Toast
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const close = () => emit('close')
</script>

<style lang="scss" scoped>
.toast {
  position: relative;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 4px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.toast-success {
  background-color: #4caf50;
}
.toast-error {
  background-color: #f44336;
}
.toast-info {
  background-color: #2196f3;
}
.toast-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 0.5rem;
}
</style>
