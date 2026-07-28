<script setup>
import { ref, onMounted } from 'vue'
import { getKnowledgeArtifacts } from '../services/api'

const API_BASE = 'https://erp-ryss.ap.gov.in'

const activeTab = ref('annual')
const annualReports = ref([])
const socioReports = ref([])
const loading = ref(true)

onMounted(async () => {
  await loadReports()
})

async function loadReports() {
  loading.value = true
  try {
    const data = await getKnowledgeArtifacts({ category: 'Report' })
    const all = data?.message?.data || []
    annualReports.value = all.filter(r => !r.sub_category || r.sub_category === 'Annual')
    socioReports.value = all.filter(r => r.sub_category === 'Socio-Economic')
    if (socioReports.value.length === 0 && annualReports.value.length === 0) {
      annualReports.value = all
    }
  } catch {
    annualReports.value = []
    socioReports.value = []
  } finally {
    loading.value = false
  }
}

function getImageUrl(path) {
  if (!path) return '/img/about-us-1.jpg'
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

function getAttachmentUrl(path) {
  if (!path) return '#'
  if (path.startsWith('http')) return path
  return `${API_BASE}${encodeURI(path)}`
}
</script>

<template>
  <div>
    <div class="page-title dark-background" style="padding: 80px 0;">
      <div class="container position-relative">
        <h1>Reports</h1>
        <nav class="breadcrumbs">
          <ol>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li class="current">Reports</li>
          </ol>
        </nav>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="container section-title" data-aos="fade-up">
          <h2>Reports</h2>
        </div>

        <!-- Tabs -->
        <ul class="nav nav-tabs mb-0" role="tablist">
          <li class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'annual' }"
              @click="activeTab = 'annual'"
            >Annual Reports</button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link"
              :class="{ active: activeTab === 'socio' }"
              @click="activeTab = 'socio'"
            >Socio-Economic Reports</button>
          </li>
        </ul>

        <div class="tab-content p-3 border border-top-0">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <!-- Annual Reports Tab -->
          <div v-show="activeTab === 'annual' && !loading">
            <div v-if="annualReports.length === 0" class="text-center py-5 text-muted">
              No Reports Available
            </div>
            <div
              v-for="report in annualReports"
              :key="report.name"
              class="mb-3"
            >
              <a :href="getAttachmentUrl(report.attachment)" target="_blank" class="text-decoration-none">
                <div class="row newsCard no-gutters align-items-center">
                  <div class="col-md-3">
                    <img :src="getImageUrl(report.thumbnail_image)" class="img-fluid" :alt="report.title" style="height: 120px; object-fit: cover; width: 100%;" />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5>{{ report.title }}</h5>
                      <p class="text-muted small">{{ report.a_short_description_about_the_artifact }}</p>
                      <p class="small text-muted" v-if="report.author"><i class="bi bi-person me-1"></i>{{ report.author }}</p>
                    </div>
                  </div>
                  <div class="col-md-1 text-center">
                    <i class="bi bi-download fs-4 text-success"></i>
                  </div>
                </div>
              </a>
            </div>
          </div>

          <!-- Socio-Economic Reports Tab -->
          <div v-show="activeTab === 'socio' && !loading">
            <div v-if="socioReports.length === 0" class="text-center py-5 text-muted">
              No Reports Available
            </div>
            <div
              v-for="report in socioReports"
              :key="report.name"
              class="mb-3"
            >
              <a :href="getAttachmentUrl(report.attachment)" target="_blank" class="text-decoration-none">
                <div class="row newsCard no-gutters align-items-center">
                  <div class="col-md-3">
                    <img :src="getImageUrl(report.thumbnail_image)" class="img-fluid" :alt="report.title" style="height: 120px; object-fit: cover; width: 100%;" />
                  </div>
                  <div class="col-md-8">
                    <div class="card-body">
                      <h5>{{ report.title }}</h5>
                      <p class="text-muted small">{{ report.a_short_description_about_the_artifact }}</p>
                      <p class="small text-muted" v-if="report.author"><i class="bi bi-person me-1"></i>{{ report.author }}</p>
                    </div>
                  </div>
                  <div class="col-md-1 text-center">
                    <i class="bi bi-download fs-4 text-success"></i>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
