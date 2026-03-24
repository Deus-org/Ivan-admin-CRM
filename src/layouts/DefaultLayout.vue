<template>
  <div class="app-layout">
    <div class="sidebar-overlay" v-if="sidebarOpen" @click="toggleSidebar"></div>
    <aside :class="['sidebar', { 'sidebar-open': sidebarOpen }]">
      <div class="logo">
        <span>Admin CRM</span>
        <button class="close-btn" @click="toggleSidebar" v-if="sidebarOpen">
          <span>✕</span>
        </button>
      </div>
      <nav>
        <router-link to="/" class="nav-link" @click="closeSidebarOnMobile">
          <span>📊 Dashboard</span>
        </router-link>
        <router-link to="/users" class="nav-link" @click="closeSidebarOnMobile">
          <span>👥 Users</span>
        </router-link>
        <router-link to="/orders" class="nav-link" @click="closeSidebarOnMobile">
          <span>📦 Orders</span>
        </router-link>
      </nav>
    </aside>
    <div class="main-content">
      <header class="header">
        <button class="menu-btn" @click="toggleSidebar">☰</button>
        <h1 class="page-title">{{ pageTitle }}</h1>
        <div class="user-menu">
          <button class="theme-toggle" @click="themeStore.toggleTheme">
            {{ themeStore.isDark ? '🌙' : '☀️' }}
          </button>
          <div class="user-info">
            <span>{{ user?.name || 'User' }}</span>
            <button class="logout-btn" @click="logout">Logout</button>
          </div>
        </div>
      </header>
      <div class="page-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'

const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()
const user = computed(() => authStore.user)
const pageTitle = computed(() => route.name?.toString() || 'Dashboard')
const sidebarOpen = ref(false)

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebarOnMobile = () => {
  if (window.innerWidth <= 768) {
    sidebarOpen.value = false
  }
}

const logout = () => {
  authStore.logout()
  window.location.href = '/login'
}

const handleResize = () => {
  if (window.innerWidth > 768) {
    sidebarOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: $sidebar-width;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform $transition-normal;
  transform: translateX(0);

  @include mobile {
    transform: translateX(-100%);
    &.sidebar-open {
      transform: translateX(0);
    }
  }
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 99;
  display: none;
  @include mobile {
    display: block;
  }
}

.logo {
  padding: 1.5rem;
  font-size: 1.25rem;
  font-weight: bold;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  color: white;
  background: none;
  font-size: 1.2rem;
  display: none;
  @include mobile {
    display: block;
  }
}

.nav-link {
  display: block;
  padding: 0.75rem 1.5rem;
  color: var(--sidebar-text);
  transition: background $transition-fast;
  &:hover {
    background: rgba(255,255,255,0.1);
  }
  &.router-link-exact-active {
    background: rgba(255,255,255,0.2);
    border-left: 3px solid $primary;
  }
}

.main-content {
  flex: 1;
  margin-left: $sidebar-width;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  @include mobile {
    margin-left: 0;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: $header-height;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.menu-btn {
  font-size: 1.5rem;
  display: none;
  @include mobile {
    display: block;
  }
}

.page-title {
  font-size: 1.25rem;
  font-weight: 500;
  flex: 1;
  margin-left: 1rem;
  @include mobile {
    margin-left: 0;
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background $transition-fast;
  &:hover {
    background: var(--bg-secondary);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logout-btn {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all $transition-fast;
  font-weight: 500;
  color: var(--text-primary);
  cursor: pointer;
  &:hover {
    background: var(--danger);
    color: white;
    border-color: var(--danger);
  }
}

.page-content {
  padding: 1.5rem;
  flex: 1;
}
</style>
