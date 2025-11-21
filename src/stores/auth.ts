import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const currentUser = computed(() => user.value)

  // Actions
  const login = async (email: string, password: string) => {
    try {
      // Replace with your actual API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()

      token.value = data.token
      user.value = data.user

      // Persist token
      localStorage.setItem('auth_token', data.token)

      return { success: true }
    }
    catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Invalid credentials' }
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('auth_token')
  }

  const fetchCurrentUser = async () => {
    if (!token.value)
      return

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }

      const data = await response.json()
      user.value = data.user
    }
    catch (error) {
      console.error('Fetch user error:', error)
      logout() // Clear invalid token
    }
  }

  // Initialize auth state on store creation
  const initialize = async () => {
    if (token.value) {
      await fetchCurrentUser()
    }
  }

  return {
    user,
    token,

    isAuthenticated,
    currentUser,

    login,
    logout,
    fetchCurrentUser,
    initialize,
  }
})
