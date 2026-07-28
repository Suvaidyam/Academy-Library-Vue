<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const route = useRoute()
const router = useRouter()
const webinarId = route.query.webinar_id || ''
const API_BASE = 'https://erp-ryss.ap.gov.in'

const form = ref({
  firstName: '',
  lastName: '',
  organization: '',
  role: '',
  email: '',
  phone: '',
  interests: '',
})
const loading = ref(false)

async function handleSubmit() {
  loading.value = true
  try {
    const res = await fetch(`${API_BASE}/api/method/webinar_register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: webinarId,
        participant_name: `${form.value.firstName} ${form.value.lastName}`,
        participant_email: form.value.email,
        organization: form.value.organization,
        role: form.value.role,
        phone: form.value.phone,
        interests: form.value.interests,
      }),
    })
    if (!res.ok) throw new Error('Registration failed')
    toast.success('Registration successful! See you at the webinar.')
    setTimeout(() => router.push('/webinar'), 2000)
  } catch (err) {
    toast.error(err.message || 'Failed to register. Please try again.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-title" style="background: radial-gradient(circle, rgba(1,87,99,1) 0%, rgba(0,0,0,1) 100%); padding:60px 0;">
      <div class="container">
        <h1 style="color:#fff;">Register for Webinar</h1>
        <p style="color:#ccc;" class="lead mt-2">Join our upcoming webinar and learn from industry experts.</p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <RouterLink to="/webinar" class="btn btn-link mb-3">
          <i class="bi bi-arrow-left-circle-fill"></i> Back to Webinars
        </RouterLink>

        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8">
            <div class="card border-0 shadow p-4">
              <h4 class="mb-4" style="color:#1e4356;">Register Now</h4>
              <form @submit.prevent="handleSubmit">
                <div class="row mb-3">
                  <div class="col">
                    <label class="form-label">First Name <span class="text-danger">*</span></label>
                    <input v-model="form.firstName" type="text" class="form-control" required />
                  </div>
                  <div class="col">
                    <label class="form-label">Last Name <span class="text-danger">*</span></label>
                    <input v-model="form.lastName" type="text" class="form-control" required />
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Organization <span class="text-danger">*</span></label>
                  <input v-model="form.organization" type="text" class="form-control" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Role <span class="text-danger">*</span></label>
                  <select v-model="form.role" class="form-select" required>
                    <option value="" disabled>Select Role</option>
                    <option>Farmer</option>
                    <option>Researcher</option>
                    <option>Student</option>
                    <option>Professional</option>
                    <option>Other</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label class="form-label">Email Address <span class="text-danger">*</span></label>
                  <input v-model="form.email" type="email" class="form-control" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">Phone Number <span class="text-danger">*</span></label>
                  <input v-model="form.phone" type="tel" class="form-control" required />
                </div>

                <div class="mb-3">
                  <label class="form-label">What interests you about this webinar?</label>
                  <textarea v-model="form.interests" class="form-control" rows="3"></textarea>
                </div>

                <button type="submit" class="btn btn-success w-100" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Registering...' : 'Reserve My Seat' }}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
