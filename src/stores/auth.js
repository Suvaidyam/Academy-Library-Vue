import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'

const API_BASE = 'https://erp-ryss.ap.gov.in'

export const useAuthStore = defineStore('auth', () => {
  const userInfo = ref(JSON.parse(sessionStorage.getItem('user_info') || 'null'))

  const isLoggedIn = computed(() => userInfo.value?.message === 'Logged In')
  const fullName = computed(() => userInfo.value?.full_name || '')
  const username = computed(() => userInfo.value?.username || '')

  async function login(usr, pwd) {
    const response = await fetch(`${API_BASE}/api/method/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cmd: 'login', usr, pwd }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      throw new Error(err.message || 'Login failed. Please try again.')
    }

    const result = await response.json()
    if (result.message === 'Logged In') {
      result.username = usr
      userInfo.value = result
      sessionStorage.setItem('user_info', JSON.stringify(result))
      return true
    } else {
      throw new Error('Login failed. Please check your credentials.')
    }
  }

  function logout() {
    userInfo.value = null
    sessionStorage.clear()
  }

  return { userInfo, isLoggedIn, fullName, username, login, logout }
})
