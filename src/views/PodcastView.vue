<script setup>
import { ref, onMounted } from 'vue'
import { getPodcastList } from '../services/api'

const podcasts = ref([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(true)
const API_BASE = 'https://erp-ryss.ap.gov.in'

onMounted(() => loadPodcasts())

async function loadPodcasts(p = 1) {
  loading.value = true
  try {
    const data = await getPodcastList(p, 6)
    const msg = data?.message
    podcasts.value = msg?.data || []
    totalPages.value = msg?.total_pages || 1
    page.value = p
  } catch {
    podcasts.value = []
  } finally {
    loading.value = false
  }
}

function getImageUrl(path) {
  if (!path) return '/img/audio_img.png'
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}
</script>

<template>
  <div>
    <div class="page-title" style="background: radial-gradient(circle, rgba(1,87,99,1) 0%, rgba(0,0,0,1) 100%); padding: 80px 0;">
      <div class="container">
        <h1 style="color:#fff;">Podcast</h1>
        <nav>
          <ol class="breadcrumb" style="color:#ccc;">
            <li class="breadcrumb-item"><a href="/" style="color:#ccc;">Home</a></li>
            <li class="breadcrumb-item active" style="color:#fff;">Podcast</li>
          </ol>
        </nav>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"></div>
        </div>

        <div v-else class="row gy-4">
          <div v-if="podcasts.length === 0" class="col-12 text-center py-5">
            <p class="text-muted">No podcasts available at the moment.</p>
          </div>
          <div v-for="item in podcasts" :key="item.name" class="col-lg-4 col-md-6" data-aos="fade-up">
            <div class="card h-100 shadow-sm border-0">
              <img :src="getImageUrl(item.image || item.img)" class="card-img-top" style="height:200px; object-fit:cover;" :alt="item.title" />
              <div class="card-body">
                <h5 class="card-title" style="color:#1e4356;">{{ item.title }}</h5>
                <p class="card-text text-muted small">{{ item.description || item.content || '' }}</p>
                <span v-if="item.episode_count" class="badge bg-success">{{ item.episode_count }} Episodes</span>
              </div>
              <div class="card-footer bg-transparent border-0">
                <RouterLink :to="{ path: '/podcast-details', query: { id: item.name } }" class="btn btn-sm btn-outline-success">
                  <i class="bi bi-play-circle me-1"></i> Play All
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-content-center mt-4 gap-2">
          <button class="btn btn-outline-secondary" :disabled="page <= 1" @click="loadPodcasts(page - 1)">
            <i class="bi bi-arrow-left"></i> Prev
          </button>
          <span class="btn btn-light disabled">{{ page }} / {{ totalPages }}</span>
          <button class="btn btn-outline-secondary" :disabled="page >= totalPages" @click="loadPodcasts(page + 1)">
            Next <i class="bi bi-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
