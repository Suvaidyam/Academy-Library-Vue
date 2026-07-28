<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import BaseModal from '../components/ui/BaseModal.vue'
import { getGalleryData } from '../services/api'

const API_BASE = 'https://erp-ryss.ap.gov.in'
const categories = ['All', 'Campus', 'Visitors', 'Field Visit', 'Classroom', 'Field Classes', 'Farm Models', 'Labs', 'Fields', 'General', 'Seminar/Workshop', 'Students']
const items = ref([])
const loading = ref(true)
const activeCategory = ref('All')
const selectedItem = ref(null)

function categoryKey(value = '') { return value.toLowerCase().replace(/\//g, '_').replace(/\s+/g, '_').replace(/[^\w-]/g, '') }
function fileUrl(item) { const path = item.gallery_doc || item.image || item.img; return !path ? '' : path.startsWith('http') ? path : `${API_BASE}${path}` }
function isVideo(item) { return /\.(mp4|mov|avi)(?:\?.*)?$/i.test(fileUrl(item)) }
const filteredItems = computed(() => activeCategory.value === 'All' ? items.value : items.value.filter(item => categoryKey(item.category) === categoryKey(activeCategory.value)))
const selectedIndex = computed(() => filteredItems.value.findIndex(item => item === selectedItem.value))

function previousMedia() {
  if (!filteredItems.value.length) return
  selectedItem.value = filteredItems.value[(selectedIndex.value - 1 + filteredItems.value.length) % filteredItems.value.length]
}
function nextMedia() {
  if (!filteredItems.value.length) return
  selectedItem.value = filteredItems.value[(selectedIndex.value + 1) % filteredItems.value.length]
}
function onKeydown(event) {
  if (!selectedItem.value) return
  if (event.key === 'ArrowLeft') previousMedia()
  if (event.key === 'ArrowRight') nextMedia()
}

async function loadGallery() {
  loading.value = true
  try {
    const response = await getGalleryData()
    const message = response?.message || []
    items.value = Array.isArray(message) ? message : message.data || []
  } catch { items.value = [] } finally { loading.value = false }
}
onMounted(() => { loadGallery(); window.addEventListener('keydown', onKeydown) })
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div>
    <div class="page-title bg-#000000">
      <div class="container position-relative"><h1>Gallery</h1></div>
    </div>
    <section id="portfolio" class="portfolio section">
      <div class="container">
        <div class="isotope-layout">
          <ul class="portfolio-filters isotope-filters" data-aos="fade-up" data-aos-delay="100">
            <li v-for="category in categories" :key="category" :class="{ 'filter-active': activeCategory === category }" @click="activeCategory = category">{{ category }}</li>
          </ul>
          <div v-if="loading" class="py-5 text-center"><span class="spinner-border text-success"></span></div>
          <div v-else-if="!items.length" class="gallery-empty"><i class="bi bi-images"></i><h2>No gallery items available</h2></div>
          <div v-else class="row gy-4 isotope-container" data-aos="fade-up" data-aos-delay="200">
            <div v-for="item in filteredItems" :key="item.name || fileUrl(item)" class="col-lg-4 col-md-6 portfolio-item isotope-item">
              <button class="portfolio-content h-100 position-relative" type="button" @click="selectedItem = item">
                <img v-if="!isVideo(item)" :src="fileUrl(item)" class="img-fluid rounded w-100 h-100" :alt="item.title || 'Gallery media'" />
                <img v-else src="/img/gallery/Play-btn.jpeg" class="img-fluid rounded w-100 h-100 gallery-video-thumb" :alt="item.title || 'Gallery video'" />
                <span v-if="isVideo(item)" class="gallery-play"><i class="bi bi-play-circle"></i></span>
                <span class="portfolio-info"><span>{{ item.title || 'No Title' }}</span><i :class="['bi', isVideo(item) ? 'bi-play-circle' : 'bi-zoom-in']"></i></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <BaseModal :open="Boolean(selectedItem)" :title="selectedItem?.title || 'Gallery media'" size="max-w-5xl" @close="selectedItem = null">
      <div class="gallery-lightbox">
        <button class="gallery-nav gallery-prev" type="button" aria-label="Previous media" @click="previousMedia"><i class="bi bi-chevron-left"></i></button>
        <video v-if="selectedItem && isVideo(selectedItem)" :src="fileUrl(selectedItem)" class="w-100" controls autoplay></video>
        <img v-else-if="selectedItem" :src="fileUrl(selectedItem)" :alt="selectedItem.title" class="w-100 rounded" />
        <button class="gallery-nav gallery-next" type="button" aria-label="Next media" @click="nextMedia"><i class="bi bi-chevron-right"></i></button>
      </div>
      <p class="mb-0 mt-3 text-center text-muted">{{ selectedIndex + 1 }} / {{ filteredItems.length }}</p>
    </BaseModal>
  </div>
</template>

<style scoped>
.page-gallery h1 { color: #000; }
.portfolio-filters { display: flex; flex-wrap: wrap; gap: 10px; margin: 0 0 1.5rem; padding: 0; list-style: none; }
.portfolio-filters li { padding: 8px 16px; margin: 0; border: 1px solid #0d6efd; border-radius: 50rem; background: #f8f9fa; color: #1e4356; cursor: pointer; transition: .2s; }
.portfolio-filters li:hover, .portfolio-filters li.filter-active { background: #198754; border-color: #198754; color: #fff; }
.portfolio-content { display: block; width: 100%; min-height: 250px; padding: 0; overflow: hidden; border: 0; border-radius: .375rem; background: #e9ecef; text-align: left; }
.portfolio-content img { min-height: 250px; object-fit: cover; transition: transform .35s ease; }.portfolio-content:hover img { transform: scale(1.08); }.gallery-video-thumb { filter: brightness(.72); }
.portfolio-info { position: absolute; right: 0; bottom: 0; left: 0; display: flex; align-items: center; justify-content: space-between; padding: 16px; background: linear-gradient(transparent, rgba(0,0,0,.8)); color: #fff; font-size: 14px; }.portfolio-info i { font-size: 22px; }.gallery-play { position: absolute; top: 50%; left: 50%; color: #fff; font-size: 52px; line-height: 1; transform: translate(-50%, -50%); text-shadow: 0 2px 8px #000; }.gallery-empty { padding: 5rem 1rem; text-align: center; color: #6c757d; }.gallery-empty i { font-size: 3rem; }.gallery-empty h2 { margin-top: 1rem; font-size: 1.2rem; }
.gallery-lightbox { position: relative; display: flex; align-items: center; min-height: 240px; background: #111; }.gallery-lightbox img, .gallery-lightbox video { max-height: 72vh; object-fit: contain; }.gallery-nav { position: absolute; z-index: 2; top: 50%; width: 44px; height: 44px; border: 0; border-radius: 50%; background: rgba(0,0,0,.65); color: #fff; font-size: 27px; transform: translateY(-50%); }.gallery-nav:hover { background: #198754; }.gallery-prev { left: 12px; }.gallery-next { right: 12px; }
</style>
