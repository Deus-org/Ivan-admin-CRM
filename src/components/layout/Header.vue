<template>
  <header class="header">
    <div class="header-title">
      <h1>{{ pageTitle }}</h1>
    </div>
    <div class="user-menu">
      <span>{{ user?.name || 'User' }}</span>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

const pageTitle = computed(() => {
  const name = route.name?.toString() || ''
  return name || 'Dashboard'
})

const logout = () => {
  authStore.logout()
  window.location.href = '/login'
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
  height: $header-height;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.header-title h1 {
  font-size: 1.25rem;
  font-weight: 500;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logout-btn {
  background: none;
  border: 1px solid #ddd;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  &:hover {
    background: #f5f5f5;
  }
}
</style>
