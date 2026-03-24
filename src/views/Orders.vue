<template>
  <div>
    <div class="page-header">
      <h1>Orders Management</h1>
      <Button @click="openCreateModal">Add Order</Button>
    </div>

    <div class="filters">
      <div class="filter-group">
        <input
          type="text"
          v-model="ordersStore.searchQuery"
          placeholder="Search orders..."
          @input="handleSearch"
          class="search-input"
        />
      </div>
      <div class="filter-group">
        <select v-model="ordersStore.statusFilter" @change="handleStatusFilter" class="status-select">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>

    <div v-if="ordersStore.loading" class="loading-container">
      <Spinner />
    </div>

    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th><th>User</th><th>Total</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in ordersStore.orders" :key="order.id">
            <td>{{ order.id }}</td>
            <td>{{ getUserName(order.userId) }}</td>
            <td>${{ order.total }}</td>
            <td><span :class="['status-badge', order.status]">{{ order.status }}</span></td>
            <td class="actions">
              <Button variant="secondary" size="small" @click="editOrder(order)">Edit</Button>
              <Button variant="danger" size="small" @click="deleteOrder(order.id)">Delete</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      :current-page="ordersStore.currentPage"
      :total-pages="Math.ceil(ordersStore.totalCount / ordersStore.itemsPerPage)"
      @update:page="ordersStore.setPage"
    />

    <Modal :isOpen="modalOpen" :title="editingOrder ? 'Edit Order' : 'Create Order'" @close="closeModal">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>User</label>
          <select v-model="form.userId" required>
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }} ({{ user.email }})</option>
          </select>
        </div>
        <div class="form-group">
          <label>Total</label>
          <input type="number" step="0.01" v-model="form.total" required />
        </div>
        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div class="modal-footer">
          <Button variant="secondary" @click="closeModal">Cancel</Button>
          <Button variant="primary" type="submit">Save</Button>
        </div>
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useOrdersStore } from '@/stores/orders'
import { useUsersStore } from '@/stores/users'
import Button from '@/components/common/Button.vue'
import Modal from '@/components/common/Modal.vue'
import Pagination from '@/components/common/Pagination.vue'
import Spinner from '@/components/common/Spinner.vue'
import { useToastStore } from '@/stores/toast'

const ordersStore = useOrdersStore()
const usersStore = useUsersStore()
const toastStore = useToastStore()
const users = ref<any[]>([])

const modalOpen = ref(false)
const editingOrder = ref<any>(null)
const form = ref({
  userId: null as number | null,
  total: 0,
  status: 'pending'
})

const resetForm = () => {
  form.value = { userId: null, total: 0, status: 'pending' }
  editingOrder.value = null
}

const openCreateModal = () => {
  resetForm()
  modalOpen.value = true
}

const editOrder = (order: any) => {
  editingOrder.value = order
  form.value = {
    userId: order.userId,
    total: order.total,
    status: order.status
  }
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  resetForm()
}

const handleSearch = () => {
  ordersStore.setSearch(ordersStore.searchQuery)
}

const handleStatusFilter = () => {
  ordersStore.setStatusFilter(ordersStore.statusFilter)
}

const getUserName = (userId: number) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.name : `User ${userId}`
}

const submitForm = async () => {
  try {
    const payload = {
      userId: form.value.userId,
      total: form.value.total,
      status: form.value.status,
      createdAt: new Date().toISOString()
    }
    if (editingOrder.value) {
      await ordersStore.updateOrder(editingOrder.value.id, payload)
      toastStore.add({ message: 'Order updated successfully', type: 'success' })
    } else {
      await ordersStore.createOrder(payload)
      toastStore.add({ message: 'Order created successfully', type: 'success' })
    }
    closeModal()
  } catch (err) {
    console.error('Failed to save order', err)
    toastStore.add({ message: 'Error saving order', type: 'error' })
  }
}

const deleteOrder = async (id: number) => {
  if (confirm('Are you sure?')) {
    try {
      await ordersStore.deleteOrder(id)
      toastStore.add({ message: 'Order deleted successfully', type: 'success' })
    } catch (err) {
      console.error('Delete failed', err)
      toastStore.add({ message: 'Error deleting order', type: 'error' })
    }
  }
}

onMounted(async () => {
  await Promise.all([usersStore.fetchUsers(), ordersStore.fetchOrders()])
  users.value = usersStore.users
})
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
}

.search-input, .status-select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color $transition-fast, box-shadow $transition-fast;
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.2);
  }
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-primary);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);

  th, td {
    padding: 0.75rem 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }

  th {
    background: var(--bg-secondary);
    font-weight: 600;
    color: var(--text-primary);
  }

  tr:hover {
    background: var(--bg-secondary);
  }
}

.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  &.pending {
    background: rgba(255, 152, 0, 0.1);
    color: #ff9800;
  }
  &.completed {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
  }
  &.cancelled {
    background: rgba(211, 47, 47, 0.1);
    color: #d32f2f;
  }
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.form-group {
  margin-bottom: 1rem;
  label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 500;
    color: var(--text-primary);
  }
  input, select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
  }
}
</style>
