<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue3-toastify'

const auth = useAuthStore()
const router = useRouter()

const username = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)

async function handleLogin() {
  if (!username.value || !password.value) return
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    toast.success('Login successful! Redirecting...')
    setTimeout(() => router.push('/'), 2000)
  } catch (err) {
    toast.error(err.message || 'Login failed. Please check your credentials.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page-wrapper d-flex min-vh-100 align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-auto">
          <div class="card login-card">
            <form class="card-body cardbody-color px-6 py-4" @submit.prevent="handleLogin">
              <div class="text-center mb-3">
                <img
                  src="/img/login_logo.png"
                  class="img-fluid profile-image-pic img-thumbnail rounded-circle my-3"
                  width="200"
                  alt="Academy Logo"
                />
              </div>

              <div class="mb-3">
                <input
                  v-model="username"
                  type="text"
                  class="form-control"
                  placeholder="User Name"
                  required
                  autocomplete="username"
                />
              </div>

              <div class="mb-3 position-relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  placeholder="Password"
                  required
                  autocomplete="current-password"
                />
                <span
                  class="position-absolute top-50 end-0 translate-middle-y pe-3"
                  style="cursor: pointer; z-index: 10"
                  @click="showPassword = !showPassword"
                >
                  <i :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"></i>
                </span>
              </div>

              <div class="text-center">
                <button
                  type="submit"
                  class="btn btn-color px-5 mb-5 w-100 d-flex justify-content-center align-items-center"
                  :disabled="loading"
                >
                  <span class="d-flex justify-content-center gap-2 align-items-center">
                    Login
                    <span v-if="loading" class="loader1"></span>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page-wrapper {
  background-color: #f5f8f2;
  min-height: 100vh;
}

.btn-color {
  background-color: #0e1c36 !important;
  color: #ffffff !important;
}

.profile-image-pic {
  height: 200px;
  width: 200px;
  object-fit: cover;
}

.login-card {
  width: 400px;
  background-color: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 0 1.5rem rgba(0, 0, 0, 0.1);
}

.cardbody-color {
  background-color: #ffffff;
}

.px-6 {
  padding-left: 4rem !important;
  padding-right: 4rem !important;
}

.loader1 {
  border: 3px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
