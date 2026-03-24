<template>
  <div>
    <div class="page-header">
      <h1>Users Management</h1>
      <Button @click="openCreateModal">Add User</Button>
    </div>

    <div class="filters">
      <input
        type="text"
        v-model="usersStore.searchQuery"
        placeholder="Search by name or email..."
        @input="handleSearch"
        class="search-input"
      />
    </div>

    <div v-if="usersStore.loading" class="loading-container">
      <Spinner />
    </div>

    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th> </tr>
        </thead>
        <tbody>
          <tr v-for="user in usersStore.users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td><span :class="['role-badge', user.role]">{{ user.role }}</span></td>
            <td class="actions">
              <Button variant="secondary" size="small" @click="editUser(user)">Edit</Button>
              <Button variant="danger" size="small" @click="deleteUser(user.id)">Delete</Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <Pagination
      :current-page="usersStore.currentPage"
      :total-pages="Math.ceil(usersStore.totalCount / usersStore.itemsPerPage)"
      @update:page="usersStore.setPage"
    />

    <Modal :isOpen="modalOpen" :title="editingUser ? 'Edit User' : 'Create User'" @close="closeModal">
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label>Name</label>
          <input v-model="form.name" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" required />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select v-model="form.role">
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
        <div class="form-group">
          <label>Password (leave blank to keep unchanged when editing)</label>
          <input type="password" v-model="form.password" />
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
import { useUsersStore } from '@/stores/users'
import Button from '@/components/common/Button.vue'
import Modal from '@/components/common/Modal.vue'
import Pagination from '@/components/common/Pagination.vue'
import Spinner from '@/components/common/Spinner.vue'
import { useToastStore } from '@/stores/toast'

const usersStore = useUsersStore()
const toastStore = useToastStore()
const modalOpen = ref(false)
const editingUser = ref<any>(null)
const form = ref({
  name: '',
  email: '',
  role: 'user',
  password: ''
})

const resetForm = () => {
  form.value = { name: '', email: '', role: 'user', password: '' }
  editingUser.value = null
}

const openCreateModal = () => {
  resetForm()
  modalOpen.value = true
}

const editUser = (user: any) => {
  editingUser.value = user
  form.value = {
    name: user.name,
    email: user.email,
    role: user.role,
    password: ''
  }
  modalOpen.value = true
}

const closeModal = () => {
  modalOpen.value = false
  resetForm()
}

const handleSearch = () => {
  usersStore.setSearch(usersStore.searchQuery)
}

const submitForm = async () => {
  try {
    if (editingUser.value) {
      const payload: any = {
        name: form.value.name,
        email: form.value.email,
        role: form.value.role
      }
      if (form.value.password) payload.password = form.value.password
      await usersStore.updateUser(editingUser.value.id, payload)
      toastStore.add({ message: 'User updated successfully', type: 'success' })
    } else {
      await usersStore.createUser({
        ...form.value,
        createdAt: new Date().toISOString()
      })
      toastStore.add({ message: 'User created successfully', type: 'success' })
    }
    closeModal()
  } catch (err) {
    console.error('Failed to save user', err)
    toastStore.add({ message: 'Error saving user', type: 'error' })
  }
}

const deleteUser = async (id: number) => {
  if (confirm('Are you sure?')) {
    try {
      await usersStore.deleteUser(id)
      toastStore.add({ message: 'User deleted successfully', type: 'success' })
    } catch (err) {
      console.error('Delete failed', err)
      toastStore.add({ message: 'Error deleting user', type: 'error' })
    }
  }
}

onMounted(() => usersStore.fetchUsers())
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.filters {
  margin-bottom: 1.5rem;
}

.search-input {
  width: 100%;
  max-width: 300px;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.875rem;
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

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

.role-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;

  &.admin {
    background: rgba(25, 118, 210, 0.1);
    color: var(--primary);
  }
  &.user {
    background: var(--bg-secondary);
    color: var(--text-secondary);
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
