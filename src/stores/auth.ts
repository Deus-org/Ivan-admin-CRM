import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { api } from '@/api'
import type { User, LoginCredentials } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(credentials: LoginCredentials) {
    const response = await api.get('/users')
    const users = response.data
    const foundUser = users.find(
      (u: User) => u.email === credentials.email && u.password === credentials.password
    )
    if (foundUser) {
      token.value = `fake-jwt-token-${foundUser.id}`
      user.value = foundUser
      localStorage.setItem('token', token.value)
    } else {
      throw new Error('Invalid credentials')
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return { user, token, isAuthenticated, login, logout }
})
