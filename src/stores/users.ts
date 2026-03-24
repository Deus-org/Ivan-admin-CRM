import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import type { User } from '@/types'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(5)
  const searchQuery = ref('')

  async function fetchUsers() {
    loading.value = true
    try {
      const response = await api.get('/users', {
        params: {
          _page: currentPage.value,
          _limit: itemsPerPage.value,
          q: searchQuery.value || undefined
        }
      })
      users.value = response.data
      totalCount.value = parseInt(response.headers['x-total-count'] || '0')
    } finally {
      loading.value = false
    }
  }

  async function deleteUser(id: number) {
    await api.delete(`/users/${id}`)
    await fetchUsers()
  }

  async function createUser(user: Omit<User, 'id'> & { password?: string }) {
    await api.post('/users', user)
    await fetchUsers()
  }

  async function updateUser(id: number, user: Partial<User>) {
    await api.patch(`/users/${id}`, user)
    await fetchUsers()
  }

  function setPage(page: number) {
    currentPage.value = page
    fetchUsers()
  }

  function setSearch(query: string) {
    searchQuery.value = query
    currentPage.value = 1
    fetchUsers()
  }

  return {
    users,
    loading,
    totalCount,
    currentPage,
    itemsPerPage,
    searchQuery,
    fetchUsers,
    deleteUser,
    createUser,
    updateUser,
    setPage,
    setSearch
  }
})
