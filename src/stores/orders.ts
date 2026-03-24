import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '@/api'

export const useOrdersStore = defineStore('orders', () => {
  const orders = ref([])
  const allOrders = ref([])        // для статистики (без пагинации)
  const loading = ref(false)
  const totalCount = ref(0)
  const currentPage = ref(1)
  const itemsPerPage = ref(5)
  const searchQuery = ref('')
  const statusFilter = ref('')

  async function fetchOrders() {
    loading.value = true
    try {
      const params: any = {
        _page: currentPage.value,
        _limit: itemsPerPage.value,
      }
      if (searchQuery.value) params.q = searchQuery.value
      if (statusFilter.value) params.status = statusFilter.value

      const response = await api.get('/orders', { params })
      orders.value = response.data
      totalCount.value = parseInt(response.headers['x-total-count'] || '0')
    } finally {
      loading.value = false
    }
  }

  async function fetchAllOrders() {
    // без пагинации, для статистики и графиков
    const response = await api.get('/orders')
    allOrders.value = response.data
  }

  async function deleteOrder(id: number) {
    await api.delete(`/orders/${id}`)
    await fetchOrders()
    await fetchAllOrders()
  }

  async function createOrder(order: any) {
    await api.post('/orders', order)
    await fetchOrders()
    await fetchAllOrders()
  }

  async function updateOrder(id: number, order: any) {
    await api.patch(`/orders/${id}`, order)
    await fetchOrders()
    await fetchAllOrders()
  }

  function setPage(page: number) {
    currentPage.value = page
    fetchOrders()
  }

  function setSearch(query: string) {
    searchQuery.value = query
    currentPage.value = 1
    fetchOrders()
  }

  function setStatusFilter(status: string) {
    statusFilter.value = status
    currentPage.value = 1
    fetchOrders()
  }

  return {
    orders,
    allOrders,
    loading,
    totalCount,
    currentPage,
    itemsPerPage,
    searchQuery,
    statusFilter,
    fetchOrders,
    fetchAllOrders,
    deleteOrder,
    createOrder,
    updateOrder,
    setPage,
    setSearch,
    setStatusFilter
  }
})
