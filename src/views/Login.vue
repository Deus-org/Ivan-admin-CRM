<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Admin CRM</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="email" v-model="email" placeholder="Email" required />
        </div>
        <div class="form-group">
          <input type="password" v-model="password" placeholder="Password" required />
        </div>
        <Button variant="primary" :disabled="loading" type="submit">
          {{ loading ? 'Logging in...' : 'Login' }}
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import Button from '@/components/common/Button.vue'

const email = ref('admin@example.com')
const password = ref('admin123')
const loading = ref(false)
const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()

async function handleLogin() {
  loading.value = true
  try {
    await authStore.login({ email: email.value, password: password.value })
    router.push('/')
  } catch (error) {
    console.error('Login failed', error)
    toastStore.add('Invalid credentials', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  @include flex-center;
  background: $bg-light;
}

.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    margin-bottom: 1.5rem;
  }
}

.form-group {
  margin-bottom: 1rem;

  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
}
</style>
