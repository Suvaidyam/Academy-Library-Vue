<script setup>
import { onMounted, ref, watch, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getDoctypeList, getKnowledgeArtifacts, getLibraryOptions, getLibrarySessions, getLearningResources } from '../services/api'
import { useAuthStore } from '../stores/auth'

const API_BASE = 'https://erp-ryss.ap.gov.in'
const PAGE_SIZE = 8
const books = ref([])
const years = ref([])
const languages = ref([])
const authors = ref([])
const page = ref(1)
const totalPages = ref(1)
const loading = ref(true)
const filters = ref({ year: '', language: '', author: '', keyword: '' })
const activeTab = ref('books')
const modules = ref([]), topics = ref([]), chapters = ref([]), sessions = ref([])
const courseFilter = ref({ module: '', topic: '', chapter: '', keyword: '', fileTypes: [] })
const courseLoading = ref(false)
const courseView = ref('card')
const tabMenuOpen = ref(false)
const showLockToast = ref(false)
const route = useRoute()
const auth = useAuthStore()
let bookSearchTimer
let lockToastTimer = null

const LR_PAGE_SIZE = 6
const LR_CATEGORIES = [
  { key: 'PDF Resources', label: 'PDF Resources', icon: 'bi-file-earmark-pdf-fill', color: '#e74c3c', desc: 'Training manuals, guides and reference materials.' },
  { key: 'Video Lecture', label: 'Videos', icon: 'bi-camera-video-fill', color: '#2c3e50', desc: 'Training videos, demonstrations and webinars.' },
  { key: 'Documents', label: 'Documents', icon: 'bi-file-earmark-text-fill', color: '#3498db', desc: 'Reports, case studies and technical documents.' },
  { key: 'Presentations', label: 'Presentations', icon: 'bi-easel-fill', color: '#e67e22', desc: 'Training presentations and workshop materials.' },
]
const LR_GRADIENTS = [
  ['#a8d5b5', '#1e6b44'], ['#90c4a8', '#1a5c3a'], ['#b5d5c5', '#256b47'],
  ['#c5e8d0', '#1e5c38'], ['#8ec9a8', '#174f33'],
]
const lrActiveCategory = ref(null)
const lrSearch = ref('')
const lrLoading = ref(false)
const lrArtifacts = ref([])
const lrPage = ref(1)
const lrTotalRecords = ref(0)
const lrGridRef = ref(null)
let lrSearchTimer = null
let lrVideoCleanups = []

function unique(values) { return [...new Set(values.filter(Boolean))] }
function apiUrl(path) { return !path ? '' : path.startsWith('http') ? path : `${API_BASE}${path}` }
function imageUrl(path) { return apiUrl(path) || '/img/book-1.jpg' }
function formatDate(date) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}
function lrThumbGradient(name) {
  const g = LR_GRADIENTS[(name.charCodeAt(0) || 0) % LR_GRADIENTS.length]
  return `linear-gradient(135deg,${g[0]},${g[1]})`
}
function lrCatIcon(key) { return (LR_CATEGORIES.find(c => c.key === key) || {}).icon || 'bi-file-earmark' }
function lrFileUrl(item) {
  const p = item.attachment; if (!p) return null
  return p.startsWith('http') ? p : `${API_BASE}${p}`
}
function isLrVideo(item) {
  return item.category === 'Video Lecture' && !!item.attachment && /youtube\.com|youtu\.be|vimeo\.com|drive\.google\.com/.test(item.attachment)
}
function buildLrAutoplayUrl(url) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1&rel=0&enablejsapi=1`
  const vm = url.match(/vimeo\.com\/(\d+)/)
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&muted=1`
  const gd = url.match(/drive\.google\.com\/file\/d\/([^/]+)/)
  if (gd) return `https://drive.google.com/file/d/${gd[1]}/preview`
  return ''
}
const activeTabLabel = computed(() => {
  const labels = { books: 'Books', course: 'Course Content', reference: 'Reference Materials', learning: 'Learning Resource' }
  return labels[activeTab.value] || 'Select Section'
})
const lrTotalPages = computed(() => Math.max(1, Math.ceil(lrTotalRecords.value / LR_PAGE_SIZE)))
const lrShowStart = computed(() => lrTotalRecords.value === 0 ? 0 : Math.min((lrPage.value - 1) * LR_PAGE_SIZE + 1, lrTotalRecords.value))
const lrShowEnd = computed(() => Math.min(lrPage.value * LR_PAGE_SIZE, lrTotalRecords.value))
const lrPageNumbers = computed(() => {
  const total = lrTotalPages.value, p = lrPage.value, delta = 2, pages = []
  pages.push(p - 1 > 0 ? p - 1 : null)
  pages.length = 0
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= p - delta && i <= p + delta)) pages.push(i)
    else if (i === p - delta - 1 || i === p + delta + 1) pages.push('...')
  }
  return pages
})

async function loadFilters() {
  try {
    const result = await getDoctypeList({
      doctype: 'Knowledge Artifact',
      fields: JSON.stringify(['date_of_creationpublication', 'language', 'author']),
      or_filters: JSON.stringify([{ category: 'Book' }]),
    })
    const data = result?.message || []
    years.value = unique(data.map(item => item.date_of_creationpublication?.slice(0, 4))).sort((a, b) => b.localeCompare(a))
    authors.value = unique(data.map(item => item.author)).sort()
    const languageCodes = unique(data.map(item => item.language))
    if (languageCodes.length) {
      const languageResult = await getDoctypeList({
        doctype: 'Language', fields: JSON.stringify(['name', 'language_name']),
        filters: JSON.stringify({ enabled: '1', name: ['in', languageCodes] }),
      })
      languages.value = languageResult?.message || languageCodes.map(name => ({ name, language_name: name }))
    }
  } catch {
    // Book results remain usable if filter metadata is temporarily unavailable.
  }
}

async function loadBooks(targetPage = 1) {
  loading.value = true
  try {
    const active = filters.value
    const params = { category: 'Book', page: targetPage, page_size: PAGE_SIZE }
    if (active.year) params.year = active.year
    if (active.language) params.language = active.language
    if (active.author) params.authorDropdown = active.author
    if (active.keyword.trim()) params.keySearchInput = active.keyword.trim()
    const result = await getKnowledgeArtifacts(params)
    const message = result?.message || {}
    books.value = message.data || []
    page.value = Number(message.page || targetPage)
    totalPages.value = Number(message.total_pages || 1)
  } catch {
    books.value = []
    totalPages.value = 1
  } finally { loading.value = false }
}

function clearFilters() {
  filters.value = { year: '', language: '', author: '', keyword: '' }
  loadBooks(1)
}


function selectTabAndClose(tab) {
  if (tab === 'learning' && !auth.isLoggedIn) {
    showLockToast.value = true
    clearTimeout(lockToastTimer)
    lockToastTimer = setTimeout(() => {
      showLockToast.value = false
      window.location.href = '/login'
    }, 2000)
    tabMenuOpen.value = false
    return
  }
  selectTab(tab)
  tabMenuOpen.value = false
}
async function selectTab(tab) {
  activeTab.value = tab
  if (tab === 'course' && !modules.value.length) {
    const result = await getLibraryOptions('Module')
    modules.value = result?.message || []
    loadSessions()
  }
  if (tab === 'learning') fetchLearningResources(1)
}
async function loadTopics() {
  topics.value = []; chapters.value = []; courseFilter.value.topic = ''; courseFilter.value.chapter = ''
  if (!courseFilter.value.module) return loadSessions()
  const result = await getLibraryOptions('Topic', { selected_course: courseFilter.value.module })
  topics.value = result?.message || []; loadSessions({ selected_course: courseFilter.value.module })
}
async function loadChapters() {
  chapters.value = []; courseFilter.value.chapter = ''
  if (!courseFilter.value.topic) return loadSessions({ selected_course: courseFilter.value.module })
  const result = await getLibraryOptions('Chapter', { selected_topic: courseFilter.value.topic })
  chapters.value = result?.message || []; loadSessions({ selected_topic: courseFilter.value.topic })
}
async function loadSessions(extra = {}) {
  courseLoading.value = true
  try {
    const params = { ...extra }
    if (courseFilter.value.chapter) params.selected_chapter = courseFilter.value.chapter
    if (courseFilter.value.fileTypes.length && !courseFilter.value.fileTypes.includes('All')) params.file_type = JSON.stringify(courseFilter.value.fileTypes)
    const result = await getLibrarySessions(params)
    sessions.value = Array.isArray(result?.message) ? result.message : []
  } catch { sessions.value = [] } finally { courseLoading.value = false }
}
async function fetchLearningResources(targetPage = 1) {
  lrLoading.value = true
  lrVideoCleanups.forEach(fn => fn()); lrVideoCleanups = []
  try {
    const params = { page: targetPage, limit: LR_PAGE_SIZE }
    if (lrActiveCategory.value) params.category = lrActiveCategory.value
    if (lrSearch.value.trim()) params.search = lrSearch.value.trim()
    const res = await getLearningResources(params)
    const body = res?.message || {}
    lrTotalRecords.value = body.total_records || 0
    lrArtifacts.value = Array.isArray(body.data) ? body.data : []
    lrPage.value = targetPage
  } catch { lrArtifacts.value = []; lrTotalRecords.value = 0 }
  finally { lrLoading.value = false }
}
function lrSelectCategory(key) {
  lrActiveCategory.value = lrActiveCategory.value === key ? null : key
  fetchLearningResources(1)
}
function lrGoToPage(page) {
  if (page < 1 || page > lrTotalPages.value) return
  fetchLearningResources(page)
  lrGridRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function lrOnSearchInput() {
  clearTimeout(lrSearchTimer)
  lrSearchTimer = setTimeout(() => fetchLearningResources(1), 400)
}
function lrResetFilters() {
  lrActiveCategory.value = null; lrSearch.value = ''
  fetchLearningResources(1)
}
function attachLrVideoHover() {
  if (!lrGridRef.value) return
  lrGridRef.value.querySelectorAll('.lr-artifact-card:not(.no-video)').forEach(card => {
    const videoUrl = card.dataset.video; if (!videoUrl) return
    const thumb = card.querySelector('.lr-artifact-thumb')
    const fsBtn = card.querySelector('.lr-fs-btn')
    const playOverlay = card.querySelector('.lr-play-overlay')
    const isDrive = videoUrl.includes('drive.google.com')
    let iframeEl = null, rafId = null, mouseX = 0, mouseY = 0, ytErrHandler = null
    const onDocMove = e => { mouseX = e.clientX; mouseY = e.clientY }
    const removeVideo = () => {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null }
      document.removeEventListener('mousemove', onDocMove)
      if (ytErrHandler) { window.removeEventListener('message', ytErrHandler); ytErrHandler = null }
      if (iframeEl) { iframeEl.remove(); iframeEl = null }
      thumb.querySelector('.lr-iframe-capture')?.remove()
      thumb.querySelector('.lr-embed-error')?.remove()
      if (playOverlay) playOverlay.style.display = ''
    }
    const checkBounds = () => {
      const r = card.getBoundingClientRect()
      if (mouseX < r.left || mouseX > r.right || mouseY < r.top || mouseY > r.bottom) removeVideo()
      else rafId = requestAnimationFrame(checkBounds)
    }
    const startTracking = (x, y) => {
      mouseX = x; mouseY = y
      document.addEventListener('mousemove', onDocMove)
      rafId = requestAnimationFrame(checkBounds)
    }
    const onMouseEnter = e => {
      if (iframeEl) return
      if (playOverlay) playOverlay.style.display = 'none'
      iframeEl = document.createElement('iframe')
      iframeEl.src = buildLrAutoplayUrl(videoUrl)
      iframeEl.frameBorder = '0'
      iframeEl.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen'
      iframeEl.allowFullscreen = true
      iframeEl.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;z-index:5;'
      thumb.appendChild(iframeEl)
      if (isDrive) {
        const capture = document.createElement('div')
        capture.className = 'lr-iframe-capture'
        capture.style.cssText = 'position:absolute;inset:0;z-index:6;'
        capture.innerHTML = '<div class="lr-drive-hint"><i class="bi bi-play-circle-fill"></i><span>Click to play</span></div>'
        capture.addEventListener('click', ev => {
          ev.stopPropagation(); capture.remove(); iframeEl.style.pointerEvents = 'auto'
          startTracking(ev.clientX, ev.clientY)
        }, { once: true })
        thumb.appendChild(capture)
      } else {
        if (/youtube\.com|youtu\.be/.test(videoUrl)) {
          ytErrHandler = event => {
            if (!event.origin.includes('youtube.com')) return
            try {
              const data = JSON.parse(event.data)
              if (data.event === 'onError') {
                window.removeEventListener('message', ytErrHandler); ytErrHandler = null
                if (iframeEl) { iframeEl.remove(); iframeEl = null }
                thumb.querySelector('.lr-iframe-capture')?.remove()
                if (playOverlay) playOverlay.style.display = 'none'
                const errEl = document.createElement('div')
                errEl.className = 'lr-embed-error'
                errEl.innerHTML = `<i class="bi bi-exclamation-circle"></i><span>Video cannot be embedded</span><a href="${videoUrl}" target="_blank" rel="noopener">Watch on YouTube <i class="bi bi-box-arrow-up-right"></i></a>`
                thumb.appendChild(errEl)
              }
            } catch (_) {}
          }
          window.addEventListener('message', ytErrHandler)
        }
        startTracking(e.clientX, e.clientY)
      }
    }
    const onMouseLeave = () => { if (!rafId) removeVideo() }
    const onFsClick = e => { e.stopPropagation(); if (iframeEl?.requestFullscreen) iframeEl.requestFullscreen() }
    card.addEventListener('mouseenter', onMouseEnter)
    card.addEventListener('mouseleave', onMouseLeave)
    fsBtn?.addEventListener('click', onFsClick)
    lrVideoCleanups.push(() => {
      removeVideo()
      card.removeEventListener('mouseenter', onMouseEnter)
      card.removeEventListener('mouseleave', onMouseLeave)
      fsBtn?.removeEventListener('click', onFsClick)
    })
  })
}
watch(lrArtifacts, async () => { await nextTick(); attachLrVideoHover() })

watch(() => filters.value.keyword, () => {
  clearTimeout(bookSearchTimer)
  bookSearchTimer = setTimeout(() => loadBooks(1), 350)
})
function fileIcon(session) { const type = String(session.file_type || session.type || '').toLowerCase(); return type.includes('video') ? 'bi-play-btn' : type.includes('pdf') ? 'bi-file-earmark-pdf' : 'bi-file-earmark-text' }

onMounted(async () => {
  await Promise.all([loadFilters(), loadBooks()])
  if (route.query.tab === 'course') selectTab('course')
})
</script>

<template>
  <div>
    <div class="library-ticker-wrap">
      <div class="library-ticker-track">
        <span class="library-ticker-item">Knowledge is the seed; reading is the water that helps it grow.<span class="ticker-sep">✦</span></span>
        <span class="library-ticker-item">Today a reader, tomorrow a leader. — Margaret Fuller<span class="ticker-sep">✦</span></span>
        <span class="library-ticker-item">The seeds of knowledge, once you planted, yields harvests for generations.<span class="ticker-sep">✦</span></span>
        <span class="library-ticker-item">Knowledge is the root; wisdom is the fruit it grows.<span class="ticker-sep">✦</span></span>
        <span class="library-ticker-item">Today a page, tomorrow a path.<span class="ticker-sep">✦</span></span>
        <span class="library-ticker-item">Knowledge is the seed; reading is the water that helps it grow.<span class="ticker-sep">✦</span></span>
        <span class="library-ticker-item">Today a reader, tomorrow a leader. — Margaret Fuller<span class="ticker-sep">✦</span></span>
        <span class="library-ticker-item">The seeds of knowledge, once you planted, yields harvests for generations.<span class="ticker-sep">✦</span></span>
        <span class="library-ticker-item">Knowledge is the root; wisdom is the fruit it grows.<span class="ticker-sep">✦</span></span>
        <span class="library-ticker-item">Today a page, tomorrow a path.<span class="ticker-sep">✦</span></span>
      </div>
    </div>

    <div class="page-title page-library">
      <div class="container position-relative"><h1>Library</h1></div>
    </div>

    <div class="container-fluid px-0 library-page">
      <div class="container mt-4">
        <div class="library-tabs" role="tablist" aria-label="Library sections">
          <!-- Mobile toggle button -->
          <button class="tab-mobile-toggle" type="button" @click="tabMenuOpen = !tabMenuOpen">
            <span>{{ activeTabLabel }}</span>
            <i :class="['bi', tabMenuOpen ? 'bi-chevron-up' : 'bi-chevron-down']"></i>
          </button>

          <!-- Tab buttons -->
          <div :class="['tab-buttons-wrap', { 'tab-buttons-open': tabMenuOpen }]">
            <button :class="{ active: activeTab === 'books' }" type="button" @click="selectTabAndClose('books')">Books</button>
            <button :class="{ active: activeTab === 'course' }" type="button" @click="selectTabAndClose('course')">Course Content</button>
            <button :class="{ active: activeTab === 'reference' }" type="button" @click="selectTabAndClose('reference')">Reference Materials</button>
            <button :class="['learning-tab-btn', { active: activeTab === 'learning', 'tab-locked': !auth.isLoggedIn }]" type="button" @click="selectTabAndClose('learning')">
              <i v-if="!auth.isLoggedIn" class="bi bi-lock-fill me-1"></i>Learning Resource
            </button>
          </div>
        </div>

        <!-- Login required toast -->
        <transition name="toast-slide">
          <div v-if="showLockToast" class="lr-lock-toast">
            <i class="bi bi-lock-fill me-2"></i> Please sign in to access Learning Resources.
          </div>
        </transition>

        <div class="library-content rounded-bottom border bg-white p-3 p-lg-4">
          <div v-if="activeTab === 'books'" class="row g-4">
            <aside class="col-lg-4">
              <form class="library-filter-card">
                <h2><i class="bi bi-funnel-fill"></i> Filter Books</h2>
                <label>Year<select v-model="filters.year" class="form-select" @change="loadBooks(1)"><option value="">Select Year</option><option v-for="year in years" :key="year" :value="year">{{ year }}</option></select></label>
                <label>Language<select v-model="filters.language" class="form-select" @change="loadBooks(1)"><option value="">Select Language</option><option v-for="language in languages" :key="language.name" :value="language.name">{{ language.language_name || language.name }}</option></select></label>
                <label>Author<select v-model="filters.author" class="form-select" @change="loadBooks(1)"><option value="">Select Author</option><option v-for="author in authors" :key="author" :value="author">{{ author }}</option></select></label>
                <label>Keywords<input v-model="filters.keyword" class="form-control" placeholder="Search title or keywords" /></label>
                <button class="btn btn-outline-secondary w-100" type="button" @click="clearFilters">Clear</button>
              </form>
            </aside>

            <div class="col-lg-8">
              <div class="d-flex justify-content-between align-items-center mb-3"><h2 class="library-results-title mb-0">Books</h2><span class="text-muted small">Page {{ page }} of {{ totalPages }}</span></div>
              <div v-if="loading" class="py-5 text-center"><span class="spinner-border text-success"></span></div>
              <div v-else-if="!books.length" class="library-empty"><i class="bi bi-journal-x"></i><h3>No books found</h3><p>Try changing or clearing the filters.</p></div>
              <div v-else class="d-grid gap-3">
                <a v-for="book in books" :key="book.name" :href="apiUrl(book.attachment) || '#'" :class="['book-result-card', { disabled: !book.attachment }]" target="_blank" rel="noopener">
                  <img :src="imageUrl(book.thumbnail_image)" :alt="book.title || 'Book cover'" @error="$event.target.src = '/img/book-1.jpg'" />
                  <div class="book-result-body"><h3>{{ book.title || 'Untitled Book' }}</h3><p>{{ book.a_short_description_about_the_artifact || 'No description available.' }}</p><div class="book-result-meta"><span v-if="book.author"><i class="bi bi-person-fill"></i>{{ book.author }}</span><span v-if="book.date_of_creationpublication"><i class="bi bi-calendar3"></i>{{ formatDate(book.date_of_creationpublication) }}</span></div></div>
                  <i class="bi bi-box-arrow-up-right book-open-icon"></i>
                </a>
              </div>
              <nav class="d-flex justify-content-end gap-2 mt-4" aria-label="Book pagination"><button class="btn btn-outline-secondary" :disabled="page <= 1 || loading" @click="loadBooks(page - 1)"><i class="bi bi-arrow-left me-1"></i>Previous</button><button class="btn btn-outline-secondary" :disabled="page >= totalPages || loading" @click="loadBooks(page + 1)">Next<i class="bi bi-arrow-right ms-1"></i></button></nav>
            </div>
          </div>
          <div v-else-if="activeTab === 'course'" class="container my-4"><div class="row"><div class="col-lg-9 mb-4"><form class="course-search-container" @submit.prevent="loadSessions()"><div class="search-bar mb-4"><div class="input-group"><input v-model="courseFilter.keyword" class="form-control" placeholder="Tags / keywords for generic / global searches"><button class="btn btn-outline-secondary"><i class="bi bi-search"></i></button></div></div><div v-for="field in [{key:'module', label:'Select a Module', change:loadTopics, items:modules},{key:'topic', label:'Select a Topic', change:loadChapters, items:topics},{key:'chapter', label:'Select a Chapter', change:loadSessions, items:chapters}]" :key="field.key" class="mb-3"><div class="input-group"><select v-model="courseFilter[field.key]" class="form-select" @change="field.change"><option value="">{{ field.label }}</option><option v-for="item in field.items" :key="item.name" :value="item.name">{{ item.name }}</option></select><button type="button" class="btn btn-outline-secondary" @click="field.change"><i class="bi bi-search"></i></button></div></div></form><div class="results-container border rounded p-3 mt-4"><div class="d-flex justify-content-between align-items-center mb-3"><h6 class="mb-0">Session List</h6><div class="view-toggle mb-2"><button class="btn btn-lg" :class="courseView === 'card' ? 'btn-primary' : 'btn-outline-primary'" @click="courseView = 'card'"><i class="bi bi-grid-3x3-gap-fill"></i></button><button class="btn btn-lg ms-2" :class="courseView === 'list' ? 'btn-primary' : 'btn-outline-secondary'" @click="courseView = 'list'"><i class="bi bi-list-ul"></i></button></div></div><p v-if="courseLoading" class="text-muted">loading Session list ............</p><p v-else-if="!sessions.length" class="alert alert-warning text-center mb-0"><i class="bi bi-exclamation-circle-fill me-2"></i>No Sessions are available at the moment. Please check back later!</p><ul v-else :class="['list-unstyled search-results row gy-4 isotope-container', { 'session-list-view': courseView === 'list' }]"><li v-for="session in sessions" :key="session.name" :class="courseView === 'card' ? 'col-lg-4 col-md-6 main1' : 'col-12 main1'"><a :href="apiUrl(session.attachment || session.file) || '#'" target="_blank" class="session-card"><i :class="['bi', fileIcon(session)]"></i><span>{{ session.title || session.session_name || session.name }}</span></a></li></ul></div></div><aside class="col-lg-3"><div class="file-type-container p-3 bg-light rounded"><h6 class="mb-3">File Type</h6><div v-for="type in ['All', 'Docs', 'PDF', 'Video', 'Image', 'PPT']" :key="type" class="mb-2 file-type-option"><div class="d-flex justify-content-between align-items-center"><span>{{ type === 'Docs' ? 'Doc' : type === 'PPT' ? 'Presentation' : type }}</span><div class="form-check"><input v-model="courseFilter.fileTypes" class="form-check-input" type="checkbox" :value="type" @change="loadSessions"></div></div></div></div></aside></div></div>
          <div v-else-if="activeTab === 'reference'" class="container my-4"><div class="row"><div class="col-lg-12 d-flex align-items-center justify-content-center"><div class="featured-section mb-4"><div class="row g-4"><div v-for="(resource, index) in [{type:'PDF'}, {type:'Doc'}, {type:'PDF'}, {type:'PDF'}]" :key="index" class="col-md-4"><article class="resource-card card h-100 shadow-sm"><div class="card-body"><div class="d-flex justify-content-between align-items-start mb-3"><span class="badge bg-success">Crop Management</span><span :class="['resource-type', resource.type.toLowerCase()]">{{ resource.type }}</span></div><h5 class="card-title">Integrated Pest Management Guide</h5><p class="card-text text-muted">Practical guide for identifying and managing major crop pests using eco-friendly methods.</p><div class="resource-meta"><span>🌐 English</span><span>📄 24 Pages</span><span>⭐ Beginner</span></div><hr><div class="d-flex justify-content-between align-items-center"><small class="text-muted">Updated: May 2026</small><a href="#" class="btn btn-success btn-sm">View Resource</a></div></div></article></div></div></div></div></div></div>
          <div v-else-if="!auth.isLoggedIn" class="library-empty"><i class="bi bi-lock-fill"></i><h3>Learning Resource requires sign in</h3><p>Please sign in to access Learning Resources.</p><RouterLink to="/login" class="btn btn-success">Sign in</RouterLink></div>
          <div v-else class="py-4">
            <!-- Category selector -->
            <div class="row g-3 mb-4">
              <div v-for="cat in LR_CATEGORIES" :key="cat.key" class="col-lg-3 col-md-6">
                <div :class="['lr-cat-card', { active: lrActiveCategory === cat.key }]" @click="lrSelectCategory(cat.key)">
                  <div class="lr-cat-icon-wrap" :style="{ color: cat.color }">
                    <i :class="['bi', cat.icon]"></i>
                  </div>
                  <h6>{{ cat.label }}</h6>
                  <p>{{ cat.desc }}</p>
                </div>
              </div>
            </div>
            <!-- Search -->
            <div class="d-flex align-items-center mb-4">
              <div class="input-group" style="max-width:420px;">
                <input type="text" v-model="lrSearch" class="form-control lr-search-input" placeholder="Search Keywords" @input="lrOnSearchInput" />
                <button class="btn btn-outline-secondary lr-search-btn" type="button" @click="fetchLearningResources(1)">
                  <i class="bi bi-search"></i>
                </button>
              </div>
            </div>
            <!-- Skeleton loading -->
            <div v-if="lrLoading" class="row g-4">
              <div v-for="i in LR_PAGE_SIZE" :key="i" class="col-lg-4 col-md-6">
                <div class="lr-skeleton-card"></div>
              </div>
            </div>
            <!-- Empty state -->
            <div v-else-if="!lrArtifacts.length" class="text-center py-5">
              <i class="bi bi-folder2-open" style="font-size:3rem;color:#ccc;"></i>
              <p class="mt-3 text-muted">No resources found. Try a different category or search term.</p>
              <button class="btn btn-outline-success btn-sm" @click="lrResetFilters">Clear filters</button>
            </div>
            <!-- Artifact grid -->
            <div v-else ref="lrGridRef" class="row g-4">
              <div v-for="item in lrArtifacts" :key="item.name" class="col-lg-4 col-md-6">
                <div :class="['lr-artifact-card', { 'no-video': !isLrVideo(item) }]" :data-video="isLrVideo(item) ? item.attachment : ''">
                  <div class="lr-artifact-thumb" :style="{ background: lrThumbGradient(item.name || '') }">
                    <i :class="['bi', lrCatIcon(item.category), 'lr-thumb-icon']"></i>
                    <div v-if="isLrVideo(item)" class="lr-play-overlay"><i class="bi bi-play-fill"></i></div>
                    <button v-if="isLrVideo(item)" class="lr-fs-btn" title="Full Screen"><i class="bi bi-fullscreen"></i></button>
                  </div>
                  <div class="lr-artifact-info">
                    <span class="lr-cat-badge">{{ item.category || '' }}</span>
                    <h6>{{ item.title || item.a_short_description_about_the_artifact || item.name }}</h6>
                    <p class="lr-artifact-desc">{{ item.a_short_description_about_the_artifact || '' }}</p>
                    <div class="lr-artifact-meta">
                      <span v-if="item.author"><i class="bi bi-person me-1"></i>{{ item.author }}</span>
                      <span v-if="item.date_of_creationpublication"><i class="bi bi-calendar3 me-1"></i>{{ formatDate(item.date_of_creationpublication) }}</span>
                    </div>
                    <a v-if="lrFileUrl(item)" class="lr-view-btn" :href="lrFileUrl(item)" target="_blank" rel="noopener">View Resource <i class="bi bi-arrow-right"></i></a>
                    <span v-else class="lr-view-btn disabled">No attachment</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- Pagination -->
            <div v-if="!lrLoading && lrArtifacts.length" class="mt-4">
              <div class="lr-pagination-wrap">
                <span class="lr-page-info">Showing {{ lrShowStart }}–{{ lrShowEnd }} of {{ lrTotalRecords }} resources</span>
                <ul class="pagination pagination-sm mb-0">
                  <li :class="['page-item', { disabled: lrPage <= 1 }]">
                    <button class="page-link" @click="lrGoToPage(lrPage - 1)"><i class="bi bi-chevron-left"></i></button>
                  </li>
                  <li v-for="(p, idx) in lrPageNumbers" :key="idx" :class="['page-item', { active: p === lrPage, disabled: p === '...' }]">
                    <button class="page-link" @click="p !== '...' && lrGoToPage(p)">{{ p }}</button>
                  </li>
                  <li :class="['page-item', { disabled: lrPage >= lrTotalPages }]">
                    <button class="page-link" @click="lrGoToPage(lrPage + 1)"><i class="bi bi-chevron-right"></i></button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
</template>

<style scoped>
/* Scrolling ticker — navbar ke niche, image se pehle */
.library-ticker-wrap { margin-top: 100px; width: 100%; overflow: hidden; background: linear-gradient(90deg, #0f5132 0%, #198754 50%, #0f5132 100%); padding: 11px 0; }
.library-ticker-track { display: flex; width: max-content; animation: libraryTickerScroll 45s linear infinite; }
.library-ticker-track:hover { animation-play-state: paused; }
.library-ticker-item { white-space: nowrap; color: #e8f5e9; font-size: 14.5px; font-weight: 500; padding: 0 30px; letter-spacing: 0.3px; }
.library-ticker-item .ticker-sep { color: #a8d5a2; margin: 0 10px; font-weight: 700; }
@keyframes libraryTickerScroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

.library-page { background: #fff; }
.library-tabs { position: relative; z-index: 20; display: flex; gap: 0; flex-wrap: wrap; overflow: visible; border-bottom: 2px solid #e9ecef; }
.tab-mobile-toggle { display: none; }
.tab-buttons-wrap { display: flex; flex-wrap: wrap; gap: 4px; align-items: stretch; }
.tab-buttons-wrap > button { flex: 0 0 auto; padding: 6px 20px; color: #495057; background: transparent; border: 0; border-radius: 8px 8px 0 0; font-weight: 500; transition: background-color .2s ease, color .2s ease; }
.tab-buttons-wrap > button:hover { color: #198754; background: #f4f9f2; }
.tab-buttons-wrap > button.active { color: #198754; background: #f4f9f2; box-shadow: inset 0 -3px 0 #198754; font-weight: 600; }
.tab-locked { opacity: 0.55; cursor: pointer !important; }
.tab-locked:hover { opacity: 0.75; }
.library-content { position: relative; z-index: 1; border-top: 0 !important; border-radius: 0 !important; }
.lr-lock-toast { position: fixed; bottom: 24px; end: 0; right: 16px; z-index: 9999; background: #fff3cd; color: #664d03; border: 1px solid #ffecb5; border-radius: 8px; padding: 12px 18px; font-size: .9rem; font-weight: 500; box-shadow: 0 4px 16px rgba(0,0,0,.15); display: flex; align-items: center; }
.toast-slide-enter-active, .toast-slide-leave-active { transition: opacity .25s, transform .25s; }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(12px); }

@media (max-width: 767px) {
  .library-tabs { flex-direction: column; border-bottom: 0; gap: 0; }
  .tab-mobile-toggle { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 11px 16px; background: #f4f9f2; border: 1.5px solid #198754; border-radius: 8px; color: #198754; font-weight: 600; font-size: 14px; cursor: pointer; margin-bottom: 2px; }
  .tab-buttons-wrap { display: none; flex-direction: column; gap: 0; background: #fff; border: 1.5px solid #dee2e6; border-radius: 0 0 8px 8px; overflow: hidden; width: 100%; }
  .tab-buttons-wrap.tab-buttons-open { display: flex; }
  .tab-buttons-wrap > button { width: 100%; text-align: left; border-radius: 0 !important; padding: 12px 16px; border-bottom: 1px solid #f0f0f0; box-shadow: none !important; }
  .tab-buttons-wrap > button:last-child { border-bottom: 0; }
  .library-content { border-radius: 0 !important; }
}
.library-filter-card { padding: 20px; border: 1px solid #eef0f2; border-radius: 14px; background: #fff; box-shadow: 0 4px 14px rgba(0, 0, 0, .04); }
.library-filter-card h2, .library-results-title { display: flex; align-items: center; gap: 8px; color: #1e4356; font-size: 15px; font-weight: 700; }
.library-filter-card h2 { margin-bottom: 16px; }
.library-filter-card label { display: grid; gap: .38rem; margin-bottom: 1rem; font-size: .86rem; font-weight: 600; color: #3d5561; }
.library-filter-card .form-select, .library-filter-card .form-control { border-color: #dfe3e6; border-radius: 8px; }
.book-result-card { position: relative; display: grid; grid-template-columns: 16.6667% 1fr; gap: 0; align-items: center; margin: .5rem 0; padding: 0; color: inherit; border: 1px solid #dee2e6; border-radius: .375rem; transition: .2s; overflow: hidden; }
.book-result-card:hover { border-color: #dee2e6; box-shadow: 0 .125rem .25rem rgba(0, 0, 0, .075); transform: none; }
.book-result-card.disabled { pointer-events: none; opacity: .65; }
.book-result-card img { width: 100%; height: 126px; object-fit: cover; border-radius: .25rem; background: #edf2f5; }
.book-result-body { padding: 1rem; }.book-result-body h3 { margin: 0 0 .5rem; font-size: 1.25rem; font-weight: 500; color: #212529; }
.book-result-body p { display: -webkit-box; margin: 0 0 1rem; overflow: hidden; color: #212529; font-size: 1rem; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.book-result-meta { display: flex; flex-wrap: wrap; gap: .75rem; color: #73828a; font-size: .8rem; }.book-result-meta i { margin-right: .3rem; }.book-open-icon { color: #198754; }
.library-empty { padding: 4rem 1rem; text-align: center; color: #708089; }.library-empty i { font-size: 2.5rem; }.library-empty h3 { margin-top: .75rem; color: #1e4356; font-size: 1.15rem; }
.course-panel { padding: 1.5rem 0; }.course-search { padding: 0; background: transparent; }.session-list { padding: 1rem; border: 1px solid #dee2e6; border-radius: .375rem; background: #fff; }.file-type-container { padding: 1rem; border-radius: .375rem; background: #f8f9fa; }.session-list h3, .file-type-container h3 { margin: 0; color: #212529; font-size: 1rem; font-weight: 500; }.session-card { display: flex; align-items: center; gap: .75rem; min-height: 72px; padding: .9rem; color: #284754; border: 1px solid #dce5e9; border-radius: .375rem; background: #fff; font-weight: 600; }.session-card:hover { border-color: #198754; }.session-card i { color: #198754; font-size: 1.5rem; }.file-type-container label { display: flex; justify-content: space-between; padding: .6rem 0; border-bottom: 1px solid #e7edef; color: #455b65; }.file-type-container h3 { margin-bottom: .65rem; }
.featured-section { width: 100%; }.resource-card { color: inherit; }.resource-card .card-body { padding: 1rem; }.resource-card .card-title { color: #212529; }.resource-card .resource-type { padding: .15rem .45rem; border-radius: .25rem; background: #e8f5ed; color: #198754; font-size: .72rem; font-weight: 700; }.resource-meta { display: flex; flex-wrap: wrap; gap: .6rem; font-size: .75rem; }.learning-card { display: block; height: 100%; padding: 1.5rem; border: 1px solid #dce5e9; border-radius: .65rem; background: #fff; text-align: center; }.learning-card:hover { border-color: #198754; box-shadow: 0 5px 15px rgba(25, 135, 84, .1); }.learning-card > div { font-size: 2.6rem; }.learning-resource-card { display: block; padding: 1.5rem; border: 1px solid #dce5e9; border-radius: .65rem; background: #fff; text-align: center; }.learning-resource-card:hover { border-color: #198754; }.learning-resource-card .resource-icon { font-size: 2.6rem; }
@media (max-width: 575.98px) { .book-result-card { grid-template-columns: 78px 1fr; gap: .75rem; }.book-result-card img { width: 78px; height: 100px; }.book-open-icon { display: none; } }

/* ── Learning Resource ─────────────────────────────── */
.lr-cat-card { background: #fff; border: 1.5px solid #dee2e6; border-radius: 12px; padding: 18px 14px; text-align: center; cursor: pointer; transition: border-color .2s, box-shadow .2s, background .2s; height: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; user-select: none; }
.lr-cat-card:hover { border-color: #198754; box-shadow: 0 4px 14px rgba(25,135,84,.1); }
.lr-cat-card.active { border-color: #198754; background: #f4f9f2; box-shadow: 0 4px 14px rgba(25,135,84,.12); }
.lr-cat-icon-wrap { font-size: 2rem; line-height: 1; }
.lr-cat-card h6 { font-size: .88rem; font-weight: 700; color: #1a1a1a; margin: 0; }
.lr-cat-card p { font-size: .75rem; color: #6c757d; margin: 0; line-height: 1.4; }
.lr-artifact-card { background: #fff; border: 1.5px solid #dee2e6; border-radius: 12px; overflow: hidden; height: 100%; display: flex; flex-direction: column; transition: box-shadow .2s, border-color .2s; }
.lr-artifact-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.1); border-color: #b7dcae; }
.lr-artifact-thumb { position: relative; width: 100%; height: 0; padding-top: 56.25%; overflow: hidden; }
.lr-thumb-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); font-size: 2.5rem; color: rgba(255,255,255,.75); }
.lr-artifact-info { padding: 14px 16px; display: flex; flex-direction: column; flex: 1; gap: 6px; }
.lr-cat-badge { display: inline-block; background: #e8f5e9; color: #1e6b3a; font-size: .67rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: .4px; width: fit-content; }
.lr-artifact-info h6 { font-size: .9rem; font-weight: 700; color: #1a1a1a; margin: 0; line-height: 1.4; }
.lr-artifact-desc { font-size: .78rem; color: #666; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; }
.lr-artifact-meta { display: flex; flex-wrap: wrap; gap: 8px; font-size: .72rem; color: #999; margin-top: auto; }
.lr-view-btn { display: inline-flex; align-items: center; gap: 4px; color: #198754; font-size: .8rem; font-weight: 600; text-decoration: none; margin-top: 6px; transition: color .15s; }
.lr-view-btn:hover { color: #0f5132; text-decoration: underline; }
.lr-view-btn.disabled { color: #aaa; cursor: default; pointer-events: none; }
.lr-skeleton-card { height: 260px; border-radius: 12px; background: linear-gradient(90deg,#f2f2f2 25%,#e8e8e8 50%,#f2f2f2 75%); background-size: 400% 100%; animation: lr-shimmer 1.4s infinite; }
@keyframes lr-shimmer { 0% { background-position: 100% 0; } 100% { background-position: -100% 0; } }
.lr-search-input { border-radius: 8px 0 0 8px !important; border-right: 0; }
.lr-search-btn { border-radius: 0 8px 8px 0 !important; border-color: #ced4da; color: #555; }
.lr-search-btn:hover { background: #198754; border-color: #198754; color: #fff; }
.lr-pagination-wrap { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
.lr-page-info { font-size: .8rem; color: #6c757d; }
.pagination .page-link { color: #198754; border-color: #dee2e6; font-size: .82rem; padding: 5px 10px; }
.pagination .page-item.active .page-link { background: #198754; border-color: #198754; color: #fff; }
.pagination .page-link:hover { background: #e8f5e9; color: #0f5132; }
.lr-play-overlay { position: absolute; inset: 0; z-index: 4; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.lr-play-overlay i { display: flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: 50%; background: rgba(255,255,255,.9); color: #198754; font-size: 1.6rem; box-shadow: 0 4px 14px rgba(0,0,0,.25); transition: transform .2s, background .2s; }
.lr-artifact-card:hover .lr-play-overlay i { transform: scale(1.1); background: #fff; }
.lr-fs-btn { position: absolute; bottom: 8px; right: 8px; z-index: 8; background: rgba(0,0,0,.55); border: none; color: #fff; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: .85rem; cursor: pointer; opacity: 0; transition: opacity .2s; }
.lr-artifact-card:hover .lr-fs-btn { opacity: 1; }
.lr-fs-btn:hover { background: rgba(0,0,0,.8); }
</style>

<style>
/* Dynamically inserted LR elements (not scoped — created via DOM manipulation) */
.lr-drive-hint { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: #fff; cursor: pointer; background: rgba(0,0,0,.35); }
.lr-drive-hint i { font-size: 2.2rem; }
.lr-drive-hint span { font-size: .8rem; font-weight: 600; letter-spacing: .3px; }
.lr-embed-error { position: absolute; inset: 0; z-index: 7; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; background: rgba(20,20,20,.88); color: #fff; text-align: center; padding: 12px; }
.lr-embed-error i { font-size: 1.8rem; color: #f87171; }
.lr-embed-error span { font-size: .78rem; color: #ddd; }
.lr-embed-error a { margin-top: 4px; font-size: .8rem; font-weight: 600; color: #fff; background: #dc3545; border-radius: 6px; padding: 6px 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
.lr-embed-error a:hover { background: #b02a37; }
</style>
