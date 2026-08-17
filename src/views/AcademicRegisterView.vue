<script setup>
import { reactive, ref } from 'vue'
import { submitAcademicRegistration } from '../services/api'

const form = reactive({
  candidate_name: '',
  surname: '',
  dob: '',
  age: '',
  gender: '',
  social_category: '',
  so_or_wo: '',
  relation: '',
  mobile_no: '',
  education_qualification: '',
  education_specialization: '',
  district_name: '',
  mandal: '',
  gp_name: '',
  vo_name: '',
  village: '',
  rsk: '',
  shg_name: '',
  member: '',
  application_for: '',
  own_land: '',
  nf_extent: '',
  leased_land: '',
  total_area: '',
  nf_started_year: '',
  nf_experience: '',
  pmds_experience: '',
  is_practicing_s2s: '',
  remarks: '',
})

const applicationFormFile = ref(null)
const submitting = ref(false)
const submitStatus = ref(null) // 'success' | 'error' | null

function onFileChange(e) {
  applicationFormFile.value = e.target.files?.[0] || null
}

async function onSubmit() {
  submitting.value = true
  submitStatus.value = null
  try {
    await submitAcademicRegistration({
      ...form,
      application_form: applicationFormFile.value,
    })
    submitStatus.value = 'success'
    Object.keys(form).forEach((key) => { form[key] = '' })
    applicationFormFile.value = null
  } catch {
    submitStatus.value = 'error'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div>
    <div class="page-title dark-background" style="padding: 80px 0;">
      <div class="container position-relative">
        <h1>Academic Registration</h1>
        <nav class="breadcrumbs">
          <ol>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li class="current">Academic Registration</li>
          </ol>
        </nav>
      </div>
    </div>

    <section class="section">
      <div class="container" style="max-width: 900px;">
        <div class="card shadow">
          <div class="card-header bg-success text-white">
            <h4 class="mb-0">Academic Registration Form</h4>
          </div>
          <div class="card-body">
            <div v-if="submitStatus === 'success'" class="alert alert-success">
              Registration submitted successfully.
            </div>
            <div v-if="submitStatus === 'error'" class="alert alert-danger">
              Something went wrong while submitting. Please try again.
            </div>

            <form class="px-3" @submit.prevent="onSubmit">
              <!-- Candidate Profile -->
              <h5 class="bg-light p-2 rounded border-start border-5 border-success">Candidate Profile</h5>
              <div class="row g-3 mb-4 px-2">
                <div class="col-md-6">
                  <label class="form-label">Candidate Name <span class="text-danger">*</span></label>
                  <input v-model="form.candidate_name" type="text" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Surname <span class="text-danger">*</span></label>
                  <input v-model="form.surname" type="text" class="form-control" required>
                </div>

                <div class="col-md-4">
                  <label class="form-label">Date of Birth (as per SSC) <span class="text-danger">*</span></label>
                  <input v-model="form.dob" type="date" class="form-control" required>
                </div>
                <div class="col-md-2">
                  <label class="form-label">Age <span class="text-danger">*</span></label>
                  <input v-model="form.age" type="number" class="form-control" required>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Gender <span class="text-danger">*</span></label>
                  <select v-model="form.gender" class="form-select" required>
                    <option value="">Select</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Social Category <span class="text-danger">*</span></label>
                  <select v-model="form.social_category" class="form-select" required>
                    <option value="">Select</option>
                    <option>SC</option>
                    <option>ST</option>
                    <option>BC</option>
                    <option>General</option>
                    <option>Minority</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Father/Husband Name <span class="text-danger">*</span></label>
                  <input v-model="form.so_or_wo" type="text" class="form-control" required>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Relation <span class="text-danger">*</span></label>
                  <select v-model="form.relation" class="form-select" required>
                    <option value="">Select</option>
                    <option>Self</option>
                    <option>Wife</option>
                    <option>Mother</option>
                    <option>Mother in Law</option>
                    <option>Father</option>
                    <option>Other Family Member</option>
                  </select>
                </div>
                <div class="col-md-3">
                  <label class="form-label">Mobile No <span class="text-danger">*</span></label>
                  <input v-model="form.mobile_no" type="tel" class="form-control" maxlength="10" pattern="[0-9]{10}" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Education Qualification <span class="text-danger">*</span></label>
                  <select v-model="form.education_qualification" class="form-select" required>
                    <option value="">Select</option>
                    <option>Intermediate</option>
                    <option>Diploma</option>
                    <option>U.G-Under Graduate</option>
                    <option>P.G-Diploma</option>
                    <option>P.G-Post Graduate</option>
                    <option>P.H.D</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">Education (Specialization) <span class="text-danger">*</span></label>
                  <input v-model="form.education_specialization" type="text" class="form-control" required>
                </div>
              </div>

              <!-- Location Information -->
              <h5 class="bg-light p-2 rounded border-start border-5 border-success">Location Information</h5>
              <div class="row g-3 mb-4 px-2">
                <div class="col-md-4">
                  <label class="form-label">District <span class="text-danger">*</span></label>
                  <input v-model="form.district_name" type="text" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Mandal <span class="text-danger">*</span></label>
                  <input v-model="form.mandal" type="text" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">GP Name <span class="text-danger">*</span></label>
                  <input v-model="form.gp_name" type="text" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Vo Name <span class="text-danger">*</span></label>
                  <input v-model="form.vo_name" type="text" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Village Name <span class="text-danger">*</span></label>
                  <input v-model="form.village" type="text" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">RSK Name <span class="text-danger">*</span></label>
                  <input v-model="form.rsk" type="text" class="form-control" required>
                </div>
                <div class="col-md-6">
                  <label class="form-label">SHG Name</label>
                  <input v-model="form.shg_name" type="text" class="form-control">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Member</label>
                  <input v-model="form.member" type="text" class="form-control">
                </div>
              </div>

              <!-- Own Field Information -->
              <h5 class="bg-light p-2 rounded border-start border-5 border-success">Own Field Information</h5>
              <div class="row g-3 mb-4 px-2">
                <div class="col-md-4">
                  <label class="form-label">Application For <span class="text-danger">*</span></label>
                  <select v-model="form.application_for" class="form-select" required>
                    <option value="">Select</option>
                    <option>Mentor Intern</option>
                    <option>Farmer scientist</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Own Land (Acres) <span class="text-danger">*</span></label>
                  <input v-model="form.own_land" type="number" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">NF Extent <span class="text-danger">*</span></label>
                  <input v-model="form.nf_extent" type="number" class="form-control">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Leased Land (Acres) <span class="text-danger">*</span></label>
                  <input v-model="form.leased_land" type="number" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Total Area (Acres) <span class="text-danger">*</span></label>
                  <input v-model="form.total_area" type="number" class="form-control" required>
                </div>
                <div class="col-md-4">
                  <label class="form-label">Natural Farming Started Year <span class="text-danger">*</span></label>
                  <input v-model="form.nf_started_year" type="text" class="form-control">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Natural Farming Experience (Years) <span class="text-danger">*</span></label>
                  <input v-model="form.nf_experience" type="number" class="form-control">
                </div>
                <div class="col-md-4">
                  <label class="form-label">PMDS Experience (Years) <span class="text-danger">*</span></label>
                  <input v-model="form.pmds_experience" type="number" class="form-control">
                </div>
                <div class="col-md-4">
                  <label class="form-label">Is Practicing S2S <span class="text-danger">*</span></label>
                  <select v-model="form.is_practicing_s2s" class="form-select">
                    <option value="">Select</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <h5 class="bg-light p-2 rounded border-start border-5 border-success">Others Information</h5>
              <div class="row g-3 mb-4 px-2">
                <div class="col-md-6">
                  <label class="form-label">Upload Application Form (Image)</label>
                  <input type="file" class="form-control" accept="image/*" @change="onFileChange">
                </div>
                <div class="col-md-6">
                  <label class="form-label">Remarks <span class="text-danger">*</span></label>
                  <textarea v-model="form.remarks" class="form-control" rows="3" required></textarea>
                </div>
              </div>

              <div class="col-12 mt-4">
                <button type="submit" class="btn btn-success w-100 py-2 fs-5" :disabled="submitting">
                  {{ submitting ? 'Submitting...' : 'Submit Registration' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
