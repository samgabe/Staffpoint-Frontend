import { defineStore } from 'pinia'
import api from '@/api/axios'
import { permissionsForRole } from '@/utils/rbac'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isHydrated: false,
    permissions: [],
  }),

  actions: {
    hydrateFromStorage() {
      this.accessToken = localStorage.getItem('access_token')
      this.refreshToken = localStorage.getItem('refresh_token')
      this.isAuthenticated = Boolean(this.accessToken)
      this.permissions = []
      this.isHydrated = true
    },

    async login(email, password) {
      try {
        const response = await api.post('/auth/login', {
          email,
          password,
        })

        this.accessToken = response.data.access_token
        this.refreshToken = response.data.refresh_token

        localStorage.setItem('access_token', this.accessToken)
        localStorage.setItem('refresh_token', this.refreshToken)

        await this.fetchUser()
        this.isAuthenticated = true

        return { success: true }
      } catch (error) {
        return {
          success: false,
          message: error.response?.data?.error || 'Login failed',
        }
      }
    },

    async register(userData) {
      void userData
      return {
        success: false,
        message: 'Registration is not enabled in this backend',
      }
    },

    async fetchUser() {
      try {
        const response = await api.get('/profile/')
        this.user = {
          email: response.data.email,
          role: response.data.role,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          permissions: response.data.permissions || permissionsForRole(response.data.role),
        }
        this.permissions = this.user.permissions
      } catch (error) {
        this.user = null
        this.permissions = []
      }
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
      this.permissions = []

      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    },
  },
})
