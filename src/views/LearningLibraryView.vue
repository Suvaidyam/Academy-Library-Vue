<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getCourses } from '../services/api'
import { useAuthStore } from '../stores/auth'
import BaseModal from '../components/ui/BaseModal.vue'

const route = useRoute()
const auth = useAuthStore()

const categories = ['Under Graduation', 'Post Graduation', 'Certification']
const activeCategory = ref(route.query.courseCategory || 'Under Graduation')
const activeTab = ref('live')
const courses = ref([])
const loading = ref(true)
const selectedCourse = ref(null)
const API_BASE = 'https://erp-ryss.ap.gov.in'

onMounted(() => loadCourses())

async function loadCourses() {
  loading.value = true
  try {
    const data = await getCourses(activeCategory.value)
    courses.value = data?.message?.data || data?.message || []
  } catch {
    courses.value = []
  } finally {
    loading.value = false
  }
}

function setCategory(cat) {
  activeCategory.value = cat
  loadCourses()
}

function getImageUrl(path) {
  if (!path) return '/img/book-1.jpg'
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

function enrol(course) {
  selectedCourse.value = course
}
</script>

<template>
  <div>
    <div class="page-title page-library" style="padding:80px 0;">
      <div class="container">
        <h1 style="color:#fff;">Learning Library</h1>
        <nav>
          <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="/" style="color:#ccc;">Home</a></li>
            <li class="breadcrumb-item active" style="color:#fff;">Academics</li>
          </ol>
        </nav>
      </div>
    </div>

    <section class="section light-background">
      <div class="container">
        <div class="row">
          <!-- Sidebar -->
          <div class="col-lg-3 col-md-4 mb-4">
            <div class="card border-0 shadow-sm p-3">
              <h5 style="color:#1e4356;">Categories</h5>
              <ul class="list-group list-group-flush">
                <li
                  v-for="cat in categories"
                  :key="cat"
                  class="list-group-item list-group-item-action"
                  :class="{ active: activeCategory === cat }"
                  style="cursor:pointer;"
                  @click="setCategory(cat)"
                >
                  {{ cat }}
                </li>
              </ul>
              <hr />
              <div class="bg-success bg-opacity-10 p-3 rounded">
                <h6 style="color:#1e4356;">Need Help?</h6>
                <p class="small text-muted mb-1">Contact us at:</p>
                <a href="mailto:iggaarl@ryss.ap.gov.in" class="small text-success">iggaarl@ryss.ap.gov.in</a>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-lg-9 col-md-8">
            <!-- Tabs -->
            <ul class="nav nav-tabs mb-4">
              <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTab === 'live' }" @click="activeTab = 'live'">Live Courses</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTab === 'upcoming' }" @click="activeTab = 'upcoming'">Upcoming Courses</button>
              </li>
              <li class="nav-item">
                <button class="nav-link" :class="{ active: activeTab === 'enrolled' }" @click="activeTab = 'enrolled'">Enrolled Courses</button>
              </li>
            </ul>

            <!-- Enrolled - requires login -->
            <div v-if="activeTab === 'enrolled' && !auth.isLoggedIn" class="text-center py-5">
              <i class="bi bi-lock fs-1 text-muted"></i>
              <p class="text-muted mt-2">Please <RouterLink to="/login" class="text-success">sign in</RouterLink> to view enrolled courses.</p>
            </div>

            <div v-else>
              <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else>
                <div v-if="courses.length === 0" class="text-center py-5">
                  <i class="bi bi-journal-x fs-1 text-muted"></i>
                  <p class="text-muted mt-2">No courses available for {{ activeCategory }}.</p>
                </div>
                <div class="row g-4">
                  <div v-for="course in courses" :key="course.name" class="col-md-6 col-lg-4" data-aos="fade-up">
                    <div class="card h-100 border-0 shadow-sm">
                      <img :src="getImageUrl(course.image || course.img)" class="card-img-top" style="height:180px; object-fit:cover;" :alt="course.title || course.name" />
                      <div class="card-body">
                        <span v-if="course.course_type" class="badge bg-success mb-1">{{ course.course_type }}</span>
                        <h6 class="card-title" style="color:#1e4356;">{{ course.title || course.name }}</h6>
                        <p class="card-text small text-muted">{{ course.description || '' }}</p>
                      </div>
                      <div class="card-footer bg-transparent border-0 pb-3 px-3">
                        <button class="btn btn-sm btn-success w-100" @click="enrol(course)">Enroll Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <BaseModal :open="Boolean(selectedCourse)" title="Course progress" @close="selectedCourse = null">
    <div class="text-center">
      <i class="bi bi-journal-check text-4xl text-emerald-700"></i>
      <p class="mt-3 mb-1 text-lg text-slate-800">{{ selectedCourse?.title || selectedCourse?.name }}</p>
      <p class="mb-0 text-slate-600">{{ auth.isLoggedIn ? 'Your enrolment request is ready to be submitted.' : 'Please sign in to enrol and track your course progress.' }}</p>
    </div>
    <template #footer>
      <div class="flex justify-end gap-2">
        <button class="btn btn-outline-secondary" @click="selectedCourse = null">Close</button>
        <RouterLink v-if="!auth.isLoggedIn" to="/login" class="btn btn-success" @click="selectedCourse = null">Sign in</RouterLink>
        <RouterLink v-else to="/course-content" class="btn btn-success" @click="selectedCourse = null">View course content</RouterLink>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>
.list-group-item.active {
  background-color: #1e4356;
  border-color: #1e4356;
}
</style>
