import { ref } from 'vue'
import { api } from '@/api'

export function useFetch<T>(url: string) {
  const data = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchData = async () => {
    loading.value = true
    try {
      const response = await api.get<T>(url)
      data.value = response.data
    } catch (err: any) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetchData }
}
