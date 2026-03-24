import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'
import type { User, Order } from '@/types'

export const useStatsStore = defineStore('stats', () => {
  const users = ref<User[]>([])
  const orders = ref<Order[]>([])
  const loading = ref(false)

  async function fetchAllUsers() {
    const response = await api.get('/users')
    users.value = response.data
  }

  async function fetchAllOrders() {
    const response = await api.get('/orders')
    orders.value = response.data
  }

  async function fetchAllData() {
    loading.value = true
    try {
      await Promise.all([fetchAllUsers(), fetchAllOrders()])
    } finally {
      loading.value = false
    }
  }

  const totalUsers = () => users.value.length
  const totalOrders = () => orders.value.length
  const totalRevenue = () => orders.value.reduce((sum, o) => sum + o.total, 0)
  const ordersByStatus = () => {
    const counts: Record<string, number> = {}
    orders.value.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1
    })
    return { labels: Object.keys(counts), values: Object.values(counts) }
  }
  const revenueByDate = () => {
    const grouped: Record<string, number> = {}
    orders.value.forEach(o => {
      const date = new Date(o.createdAt).toISOString().split('T')[0]
      grouped[date] = (grouped[date] || 0) + o.total
    })
    const sorted = Object.keys(grouped).sort()
    return { labels: sorted, values: sorted.map(d => grouped[d]) }
  }

  return {
    users,
    orders,
    loading,
    fetchAllData,
    totalUsers,
    totalOrders,
    totalRevenue,
    ordersByStatus,
    revenueByDate
  }
})
