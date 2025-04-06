// src/stores/auth.js
import { defineStore } from 'pinia'
import { loginApi, registerApi, getUserInfoApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null
  }),
  actions: {
    async login(credentials) {
      try {
        const { token } = await loginApi(credentials)
        this.token = token
        localStorage.setItem('token', token)

        // 获取用户信息
        await this.fetchUser()
        return true
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    async register(userData) {
      try {
        const { token } = await registerApi(userData)
        this.token = token
        localStorage.setItem('token', token)

        await this.fetchUser()
        return true
      } catch (error) {
        console.error('Registration failed:', error)
        throw error
      }
    },

    async fetchUser() {
      if (this.token) {
        this.user = await getUserInfoApi()
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
    }
  }
})
