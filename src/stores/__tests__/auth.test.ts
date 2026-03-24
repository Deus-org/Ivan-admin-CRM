import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../auth'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock API
vi.mock('@/api', () => ({
  api: {
    get: vi.fn()
  }
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should have initial state', () => {
    const store = useAuthStore()
    expect(store.user).toBe(null)
    expect(store.token).toBe(null)
    expect(store.isAuthenticated).toBe(false)
  })
})
