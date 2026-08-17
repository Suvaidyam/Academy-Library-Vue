<script setup>
import { ref, onMounted } from 'vue'
import { getRTIData } from '../services/api'

const API_BASE = 'https://erp-ryss.ap.gov.in'

const documents = ref([])
const loading   = ref(true)
const page      = ref(1)
const rowPerPage = 10
const totalRow  = ref(0)

onMounted(load)

async function load() {
  loading.value = true
  try {
    const data = await getRTIData(page.value, rowPerPage)
    documents.value = data?.message?.data || []
    totalRow.value  = data?.message?.totalRow || 0
  } catch {
    documents.value = []
    totalRow.value = 0
  } finally {
    loading.value = false
  }
}

function getAttachmentUrl(path) {
  if (!path) return '#'
  return path.startsWith('http') ? path : `${API_BASE}${path}`
}

function prevPage() {
  if (page.value > 1) {
    page.value -= 1
    load()
  }
}

function nextPage() {
  if (page.value * rowPerPage < totalRow.value) {
    page.value += 1
    load()
  }
}
</script>

<template>
  <div>
    <div class="page-title dark-background" style="padding: 80px 0;">
      <div class="container position-relative">
        <h1>RTI</h1>
        <nav class="breadcrumbs">
          <ol>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li class="current">RTI</li>
          </ol>
        </nav>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="container section-title" data-aos="fade-up">
          <h2>Right To Information</h2>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else>
          <div v-if="documents.length === 0" class="text-center py-5 text-muted">
            No documents available
          </div>

          <ul v-else class="list-unstyled">
            <li v-for="doc in documents" :key="doc.name" class="py-2 border-bottom">
              <a :href="getAttachmentUrl(doc.attachment)" target="_blank" rel="noopener" class="text-decoration-none">
                <i class="bi bi-file-earmark-text me-2 text-success"></i>{{ doc.title }}
              </a>
            </li>
          </ul>

          <div v-if="totalRow > rowPerPage" class="d-flex justify-content-between align-items-center mt-4">
            <button
              type="button"
              class="btn btn-outline-success btn-sm"
              :disabled="page === 1"
              @click="prevPage"
            >
              <i class="bi bi-arrow-left-circle-fill me-1"></i> Previous
            </button>
            <span class="text-muted small">Page {{ page }}</span>
            <button
              type="button"
              class="btn btn-outline-success btn-sm"
              :disabled="page * rowPerPage >= totalRow"
              @click="nextPage"
            >
              Next <i class="bi bi-arrow-right-circle-fill ms-1"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
