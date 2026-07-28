<script setup>
import { ref, onMounted } from 'vue'
import { getKnowledgeArtifacts } from '../services/api'

const API_BASE = 'https://erp-ryss.ap.gov.in'
const PAGE_SIZE = 9

const items = ref([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(true)

onMounted(() => loadItems(1))

async function loadItems(p = 1) {
  loading.value = true
  try {
    const data = await getKnowledgeArtifacts({ category: 'Case Study', page: p, page_size: PAGE_SIZE })
    const msg = data?.message
    items.value = msg?.data || []
    totalPages.value = msg?.total_pages || 1
    page.value = p
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}

function getImageUrl(path) {
  if (!path) return '/img/about-us-1.jpg'
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear()
}
</script>

<template>
  <div>
    <div class="page-title dark-background" style="padding: 80px 0;">
      <div class="container position-relative">
        <h1>Case Studies</h1>
        <nav class="breadcrumbs">
          <ol>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li class="current">Case Studies</li>
          </ol>
        </nav>
      </div>
    </div>

    <section class="section light-background">
      <div class="container">
        <div class="container section-title" data-aos="fade-up">
          <h2>Case Studies</h2>
          <p>Explore our collection of case studies</p>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else>
          <div v-if="items.length === 0" class="text-center py-5">
            <img src="/img/about-us-1.jpg" alt="" class="img-fluid mb-4" style="max-width: 400px;" />
            <p class="text-muted">No case studies available yet. Check back soon.</p>
          </div>

          <div v-else class="row g-4">
            <div
              v-for="item in items"
              :key="item.name"
              class="col-md-6 col-lg-4"
              data-aos="fade-up"
            >
              <div class="card h-100 border-0 shadow-sm">
                <div class="card-header" style="background: #1e4356; color: #fff;">
                  <span v-if="item.theme" class="badge bg-success me-2">{{ item.theme }}</span>
                  <span class="small">{{ formatDate(item.date_of_creationpublication) }}</span>
                </div>
                <img v-if="item.thumbnail_image" :src="getImageUrl(item.thumbnail_image)" class="card-img-top" style="height: 160px; object-fit: cover;" :alt="item.title" />
                <div class="card-body">
                  <p v-if="item.location" class="small text-muted mb-1">📍 {{ item.location }}</p>
                  <h6 class="card-title" style="color: #1e4356;">{{ item.title }}</h6>
                  <p class="small text-muted">{{ item.a_short_description_about_the_artifact }}</p>
                </div>
                <div class="card-footer bg-transparent border-0 pb-3">
                  <RouterLink :to="{ path: '/case-details', query: { id: item.name } }" class="btn btn-sm btn-outline-success">
                    Read More
                  </RouterLink>
                </div>
              </div>
            </div>
          </div>

          <div v-if="totalPages > 1" class="d-flex justify-content-center mt-4 gap-2">
            <button class="btn btn-outline-secondary" :disabled="page <= 1" @click="loadItems(page - 1)">
              <i class="bi bi-arrow-left"></i> Prev
            </button>
            <span class="btn btn-light disabled">{{ page }} / {{ totalPages }}</span>
            <button class="btn btn-outline-secondary" :disabled="page >= totalPages" @click="loadItems(page + 1)">
              Next <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
