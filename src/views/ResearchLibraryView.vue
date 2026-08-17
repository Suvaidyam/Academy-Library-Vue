<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue3-toastify'
import { getJournalsList, getSuccessStoriesList } from '../services/api'

const authStore = useAuthStore()

const API_BASE = 'https://erp-ryss.ap.gov.in'
function unique(values) { return [...new Set(values.filter(Boolean))] }
function apiUrl(path) { return !path ? '' : path.startsWith('http') ? path : `${API_BASE}${path}` }

const activeTab = ref('articles')
const csCategoryIndex = ref(1) // 0=training(gated), 1=farmer, 2=webinars
const showCsDropdown = ref(false)

const csCategories = [
  { label: 'Longitudinal Self-case Studies Data', value: 'training', gated: true },
  { label: 'Longitudinal Self-case Studies', value: 'farmer', gated: false },
  { label: 'Socio-economic Studies', value: 'webinars', gated: false },
]

// ───────────────────────── Static Data ─────────────────────────

const allArticles = [
  {
    id: 1, badge: '🔬 Research Article',
    title: 'Impact of Natural Farming on Soil Health',
    author: 'APCNF Research Team',
    summary: 'Assessment of soil biological activity and organic carbon under natural farming systems.',
    keywords: ['Soil Health', 'Carbon'],
    theme: 'Soil', year: '2026', journal: 'Journal of Sustainable Agriculture',
    country: 'India', language: 'English', doctype: 'Article', date: 'May 2026', pdf: '#',
  },
  {
    id: 2, badge: '📊 Research Report',
    title: 'Climate Resilience through Natural Farming',
    author: 'Sustainable Agriculture Division',
    summary: 'Study on crop performance under drought and extreme weather conditions.',
    keywords: ['Climate', 'Resilience'],
    theme: 'Climate', year: '2026', journal: 'Climate Adaptation Review',
    country: 'India', language: 'English', doctype: 'Review', date: 'March 2026', pdf: '#',
  },
  {
    id: 3, badge: '📈 Case Study',
    title: 'Farmer Income Improvement Analysis',
    author: 'APCNF Monitoring Team',
    summary: 'Comparative study of farm economics before and after natural farming adoption.',
    keywords: ['Income', 'Economics'],
    theme: 'Economics', year: '2026', journal: 'Agricultural Economics Bulletin',
    country: 'India', language: 'English', doctype: 'Conference Paper', date: 'January 2026', pdf: '#',
  },
]

const allNewsletters = [
  {
    id: 1, img: '/img/news-1.jpg', edition: 'June 2026 Edition',
    title: 'Natural Farming Newsletter',
    issue: 'Vol 6, Issue 6', year: '2026', language: 'English',
    keyword: 'natural farming newsletter', pdf: '#',
  },
  {
    id: 2, img: '/img/news-2.jpg', edition: 'June 2026 Edition',
    title: 'Natural Farming Newsletter',
    issue: 'Vol 6, Issue 7', year: '2026', language: 'Telugu',
    keyword: 'natural farming newsletter', pdf: '#',
  },
]

const caseStudyData = {
  training: [
    {
      id: 1, title: 'Improving Soil Health Through Natural Farming',
      location: 'Anantapur District, Andhra Pradesh', year: '2026',
      theme: 'Soil', author: 'APCNF Field Team', language: 'English',
      keyword: 'soil health natural farming',
      summary: 'Farmers adopted natural farming practices resulting in improved soil fertility, reduced input costs, and higher resilience.',
      pdf: '/assets/img/casestudy.pdf',
    },
    {
      id: 2, title: 'Water Conservation in Rainfed Agriculture',
      location: 'Kurnool District, Andhra Pradesh', year: '2025',
      theme: 'Water', author: 'APCNF Field Team', language: 'English',
      keyword: 'water conservation rainfed agriculture',
      summary: 'Community-led interventions improved water retention and crop productivity during drought conditions.',
      pdf: '/assets/img/casestudy.pdf',
    },
    {
      id: 3, title: 'Water Conservation in Rainfed Agriculture',
      location: 'Kurnool District, Andhra Pradesh', year: '2025',
      theme: 'Water', author: 'APCNF Field Team', language: 'English',
      keyword: 'water conservation rainfed agriculture',
      summary: 'Community-led interventions improved water retention and crop productivity during drought conditions.',
      pdf: '/assets/img/casestudy.pdf',
    },
  ],
  farmer: [
    {
      id: 1, title: 'Improving Soil Health Through Natural Farming',
      location: 'Anantapur District, Andhra Pradesh', year: '2026',
      theme: 'Soil', author: 'APCNF Field Team', language: 'English',
      keyword: 'soil health natural farming',
      summary: 'Farmers adopted natural farming practices resulting in improved soil fertility, reduced input costs, and higher resilience.',
      pdf: '/assets/img/casestudy.pdf',
    },
    {
      id: 2, title: 'Water Conservation in Rainfed Agriculture',
      location: 'Kurnool District, Andhra Pradesh', year: '2025',
      theme: 'Water', author: 'APCNF Field Team', language: 'English',
      keyword: 'water conservation rainfed agriculture',
      summary: 'Community-led interventions improved water retention and crop productivity during drought conditions.',
      pdf: '/assets/img/casestudy.pdf',
    },
    {
      id: 3, title: 'Water Conservation in Rainfed Agriculture',
      location: 'Kurnool District, Andhra Pradesh', year: '2025',
      theme: 'Water', author: 'APCNF Field Team', language: 'English',
      keyword: 'water conservation rainfed agriculture',
      summary: 'Community-led interventions improved water retention and crop productivity during drought conditions.',
      pdf: '/assets/img/casestudy.pdf',
    },
  ],
  webinars: [
    {
      id: 1, title: 'Improving Soil Health Through Natural Farming',
      location: 'Anantapur District, Andhra Pradesh', year: '2026',
      theme: 'Soil', author: 'APCNF Field Team', language: 'English',
      keyword: 'soil health natural farming',
      summary: 'Farmers adopted natural farming practices resulting in improved soil fertility, reduced input costs, and higher resilience.',
      pdf: '/assets/img/casestudy.pdf',
    },
    {
      id: 2, title: 'Water Conservation in Rainfed Agriculture',
      location: 'Kurnool District, Andhra Pradesh', year: '2025',
      theme: 'Water', author: 'APCNF Field Team', language: 'English',
      keyword: 'water conservation rainfed agriculture',
      summary: 'Community-led interventions improved water retention and crop productivity during drought conditions.',
      pdf: '/assets/img/casestudy.pdf',
    },
    {
      id: 3, title: 'Water Conservation in Rainfed Agriculture',
      location: 'Kurnool District, Andhra Pradesh', year: '2025',
      theme: 'Water', author: 'APCNF Field Team', language: 'English',
      keyword: 'water conservation rainfed agriculture',
      summary: 'Community-led interventions improved water retention and crop productivity during drought conditions.',
      pdf: '/assets/img/casestudy.pdf',
    },
  ],
}

// ───────────────────────── Filter State ─────────────────────────

const raFilter = ref({ keyword: '', author: '', theme: '', year: '', journal: '', country: '', language: '', doctype: '' })
const nlFilter = ref({ keyword: '', issue: '', year: '', language: '' })
const csFilter = ref({ keyword: '', theme: '', location: '', year: '', author: '', language: '' })

// ───────────────────────── Journals (dynamic — get_journals_list) ─────────────────────────

const JR_PAGE_SIZE = 3
const JR_FETCH_PAGE_SIZE = 50
const JR_MAX_FETCH_PAGES = 10

const jrAllJournals = ref([])
const jrLoading = ref(false)
const jrLoaded = ref(false)
const jrPage = ref(1)
const jrFilters = ref({ keyword: '', journal: '', year: '', volume: '', publisher: '', language: '', access: '' })

function jrFormatVolume(item) {
  const parts = []
  if (item.volume) parts.push(`Vol ${item.volume}`)
  if (item.volume_issue) parts.push(`Issue ${item.volume_issue}`)
  return parts.join(', ')
}
function jrViewLink(item) {
  const raw = item.resource_link || (item.doi ? (/^https?:\/\//i.test(item.doi) ? item.doi : `https://doi.org/${item.doi}`) : '')
  return raw ? (/^https?:\/\//i.test(raw) ? raw : `https://${raw}`) : ''
}
function jrItemField(item, key) {
  switch (key) {
    case 'keyword': return [item.title, item.author, item.publisher].filter(Boolean).join(' ').toLowerCase()
    case 'journal': return (item.publisher || '').toLowerCase()
    case 'year': return String(item.publication_year || '').toLowerCase()
    case 'volume': return jrFormatVolume(item).toLowerCase()
    case 'publisher': return (item.publisher || '').toLowerCase()
    case 'language': return (item.language || '').toLowerCase()
    case 'access': return (item.open_access || '').toLowerCase()
    default: return ''
  }
}

async function fetchJournalsPage(page) {
  try {
    const result = await getJournalsList({ page, page_size: JR_FETCH_PAGE_SIZE })
    return result?.message || {}
  } catch { return {} }
}

async function loadAllJournals() {
  jrLoading.value = true
  try {
    let items = [], page = 1, totalPages = 1
    do {
      const resp = await fetchJournalsPage(page)
      items = items.concat(resp.data || [])
      totalPages = resp.pagination?.total_pages || 1
      page++
    } while (page <= totalPages && page <= JR_MAX_FETCH_PAGES)
    jrAllJournals.value = items
  } finally { jrLoading.value = false; jrLoaded.value = true }
}

const jrYears = computed(() => unique(jrAllJournals.value.map(i => i.publication_year)).sort())
const jrLanguages = computed(() => unique(jrAllJournals.value.map(i => i.language)).sort())
const jrAccessOptions = computed(() => unique(jrAllJournals.value.map(i => i.open_access)).sort())

const filteredJournals = computed(() => {
  const filters = {}
  Object.entries(jrFilters.value).forEach(([k, v]) => { if (v) filters[k] = String(v).toLowerCase() })
  return jrAllJournals.value.filter(item => Object.keys(filters).every(key => jrItemField(item, key).includes(filters[key])))
})
const jrTotalPages = computed(() => Math.max(1, Math.ceil(filteredJournals.value.length / JR_PAGE_SIZE)))
const pagedJournals = computed(() => {
  const page = Math.min(jrPage.value, jrTotalPages.value)
  return filteredJournals.value.slice((page - 1) * JR_PAGE_SIZE, page * JR_PAGE_SIZE)
})

function clearJrFilters() {
  jrFilters.value = { keyword: '', journal: '', year: '', volume: '', publisher: '', language: '', access: '' }
  jrPage.value = 1
}
function jrGoToPage(page) {
  if (page < 1 || page > jrTotalPages.value) return
  jrPage.value = page
}
watch(jrFilters, () => { jrPage.value = 1 }, { deep: true })

// ───────────────────────── Success Stories (dynamic — success_stories_list) ─────────────────────────

const SS_PAGE_SIZE = 6
const DEFAULT_SS_THUMBNAIL = '/img/background-img/success-story.png'

const ssFilters = ref({ keyword: '', theme: '', location: '', year: '', author: '', language: '' })
const ssItems = ref([])
const ssLoading = ref(false)
const ssPage = ref(1)
const ssTotalPages = ref(1)
const ssTotalCount = ref(0)
const ssYears = ref([])
const ssLanguages = ref([])
const ssThemes = ref([])
let ssSearchTimer

function ssExtractYear(val) {
  if (!val) return ''
  const m = String(val).match(/\d{4}/)
  return m ? m[0] : ''
}
function ssThumbnail(item) { return item.thumbnail ? apiUrl(item.thumbnail) : DEFAULT_SS_THUMBNAIL }
function ssLink(item) {
  const raw = item.attachment ? apiUrl(item.attachment) : (item.resource_link || item.link || item.url || '')
  return raw ? (/^https?:\/\//i.test(raw) ? raw : `https://${raw}`) : ''
}
function ssYear(item) {
  return item.year ? String(item.year) : ssExtractYear(item.date_of_creationpublication || item.date || item.publication_date || item.published_date)
}

async function loadSsMeta() {
  try {
    const result = await getSuccessStoriesList({ meta: 1 })
    const data = result?.message || {}
    ssYears.value = data.years || []
    ssLanguages.value = data.languages || []
    ssThemes.value = data.themes || []
  } catch { ssYears.value = []; ssLanguages.value = []; ssThemes.value = [] }
}

async function loadStories(targetPage = 1) {
  ssLoading.value = true
  try {
    const active = ssFilters.value
    const params = { page: targetPage, page_size: SS_PAGE_SIZE }
    if (active.keyword.trim()) params.search = active.keyword.trim()
    if (active.year) params.year = active.year
    if (active.author) params.author = active.author
    if (active.theme) params.theme = active.theme
    if (active.location) params.location = active.location
    if (active.language) params.language = active.language
    const result = await getSuccessStoriesList(params)
    const data = result?.message || {}
    ssItems.value = data.data || []
    ssTotalCount.value = data.total_count || 0
    ssTotalPages.value = data.total_pages || 1
    ssPage.value = targetPage
  } catch { ssItems.value = []; ssTotalCount.value = 0; ssTotalPages.value = 1 } finally { ssLoading.value = false }
}

function clearSsFilters() {
  ssFilters.value = { keyword: '', theme: '', location: '', year: '', author: '', language: '' }
  loadStories(1)
}

watch(ssFilters, () => {
  if (activeTab.value !== 'successstories') return
  clearTimeout(ssSearchTimer)
  ssSearchTimer = setTimeout(() => loadStories(1), 350)
}, { deep: true })

// ───────────────────────── Client-side filtering ─────────────────────────

function matchText(value, query) {
  return !query || (value || '').toLowerCase().includes(query.toLowerCase())
}
function matchExact(value, query) {
  return !query || (value || '').toLowerCase() === query.toLowerCase()
}

const filteredArticles = computed(() => {
  const f = raFilter.value
  return allArticles.filter(a =>
    matchText(a.title + ' ' + a.keyword + ' ' + a.summary, f.keyword) &&
    matchText(a.author, f.author) &&
    matchExact(a.theme, f.theme) &&
    matchExact(a.year, f.year) &&
    matchText(a.journal, f.journal) &&
    matchText(a.country, f.country) &&
    matchExact(a.language, f.language) &&
    matchExact(a.doctype, f.doctype)
  )
})

const filteredNewsletters = computed(() => {
  const f = nlFilter.value
  return allNewsletters.filter(n =>
    matchText(n.keyword + ' ' + n.title, f.keyword) &&
    matchText(n.issue, f.issue) &&
    matchExact(n.year, f.year) &&
    matchExact(n.language, f.language)
  )
})

const currentCsItems = computed(() => {
  const cat = csCategories[csCategoryIndex.value]
  const items = caseStudyData[cat.value] || []
  const f = csFilter.value
  return items.filter(c =>
    matchText(c.keyword + ' ' + c.title + ' ' + c.summary, f.keyword) &&
    matchExact(c.theme, f.theme) &&
    matchText(c.location, f.location) &&
    matchExact(c.year, f.year) &&
    matchText(c.author, f.author) &&
    matchExact(c.language, f.language)
  )
})

// ───────────────────────── Actions ─────────────────────────

function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'journals' && !jrLoaded.value) loadAllJournals()
  if (tab === 'successstories' && !ssItems.value.length) { loadSsMeta(); loadStories(1) }
}

function selectCsCategory(idx) {
  const cat = csCategories[idx]
  if (cat.gated && !authStore.isLoggedIn) {
    toast.warning('Please sign in to access Longitudinal Self-case Studies Data.')
    showCsDropdown.value = false
    return
  }
  csCategoryIndex.value = idx
  showCsDropdown.value = false
  activeTab.value = 'casestudies'
}

function clearRa() { Object.keys(raFilter.value).forEach(k => raFilter.value[k] = '') }
function clearNl() { Object.keys(nlFilter.value).forEach(k => nlFilter.value[k] = '') }
function clearCs() { Object.keys(csFilter.value).forEach(k => csFilter.value[k] = '') }

// Unique year options derived from data
const raYears = [...new Set(allArticles.map(a => a.year))].sort()
const nlYears = [...new Set(allNewsletters.map(n => n.year))].sort()
const csYears = [...new Set(Object.values(caseStudyData).flat().map(c => c.year))].sort()
const raLanguages = [...new Set(allArticles.map(a => a.language))].sort()
const nlLanguages = [...new Set(allNewsletters.map(n => n.language))].sort()
const csLanguages = [...new Set(Object.values(caseStudyData).flat().map(c => c.language))].sort()
</script>

<template>
  <div>
    <div class="page-title dark-background" style="padding: 80px 0;">
      <div class="container position-relative">
        <h1>Publications</h1>
      </div>
    </div>

    <section id="service-details" class="service-details publications-details section">
      <div class="container">

        <!-- Tab Navigation -->
        <ul class="nav nav-tabs" id="pubTabs">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'articles' }" @click="switchTab('articles')">
              Research Articles
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'journals' }" @click="switchTab('journals')">
              Journals
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'newsletters' }" @click="switchTab('newsletters')">
              News Letters
            </button>
          </li>
          
          <!-- Case Studies with hover dropdown -->
          <li class="nav-item hover-dropdown" @mouseenter="showCsDropdown = true" @mouseleave="showCsDropdown = false">
            <button class="nav-link" :class="{ active: activeTab === 'casestudies' }" @click="switchTab('casestudies')">
              Case Studies <i class="bi bi-chevron-down" style="font-size: 10px;"></i>
            </button>
            <ul class="dropdown-menu" :class="{ show: showCsDropdown }">
              <li v-for="(cat, idx) in csCategories" :key="cat.value">
                <a class="dropdown-item" :class="{ active: idx === csCategoryIndex }" href="#" @click.prevent="selectCsCategory(idx)">
                  <i v-if="cat.gated && !authStore.isLoggedIn" class="bi bi-lock-fill me-1" style="color: #ffc107;"></i>
                  {{ cat.label }}
                </a>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'successstories' }" @click="switchTab('successstories')">
              Success Stories
            </button>
          </li>
        </ul>

        <div class="tab-content p-3 border border-top-0">

          <!-- ===== Research Articles ===== -->
          <div v-show="activeTab === 'articles'">
            <div class="row">
              <div class="col-lg-3 mt-2">
                <div class="library-filter-card">
                  <div class="library-filter-title"><i class="bi bi-funnel-fill"></i> Filter Research Articles</div>
                  <form @submit.prevent>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="raFilter.keyword" placeholder="Keyword(s)">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="raFilter.author" placeholder="Author">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="raFilter.theme">
                        <option value="">Research Theme</option>
                        <option>Soil</option><option>Water</option><option>Crop</option>
                        <option>Climate</option><option>Biodiversity</option><option>Economics</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="raFilter.year">
                        <option value="">Publication Year</option>
                        <option v-for="y in raYears" :key="y">{{ y }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="raFilter.journal" placeholder="Journal Name">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="raFilter.country" placeholder="Country">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="raFilter.language">
                        <option value="">Language</option>
                        <option v-for="l in raLanguages" :key="l">{{ l }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="raFilter.doctype">
                        <option value="">Document Type</option>
                        <option>Article</option><option>Review</option><option>Conference Paper</option>
                      </select>
                    </div></div>
                    <div>
                      <button type="button" style="width: 100%;" class="btn btn-outline-secondary" @click="clearRa">Clear</button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="col-lg-9">
                <div class="row g-4" id="ra-results">
                  <div v-for="item in filteredArticles" :key="item.id" class="col-md-4 ra-card-col">
                    <div class="research-card">
                      <span class="research-badge">{{ item.badge }}</span>
                      <h5>{{ item.title }}</h5>
                      <p class="authors">{{ item.author }}</p>
                      <p class="summary">{{ item.summary }}</p>
                      <div class="keywords">
                        <span v-for="kw in item.keywords" :key="kw">{{ kw }}</span>
                      </div>
                      <div class="research-footer">
                        <small>{{ item.date }}</small>
                        <a :href="item.pdf" target="_blank" class="btn btn-success btn-sm">View PDF</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="filteredArticles.length === 0" class="no-results text-center py-4">
                  <h5 class="mt-2">No research articles match your filters</h5>
                  <p class="text-muted">Try adjusting or clearing the filters above.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== Journals (dynamic) ===== -->
          <div v-show="activeTab === 'journals'">
            <div class="row">
              <div class="col-lg-3 mt-2">
                <div class="library-filter-card">
                  <div class="library-filter-title"><i class="bi bi-funnel-fill"></i> Filter Journals</div>
                  <form @submit.prevent>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="jrFilters.keyword" placeholder="Keyword(s)">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="jrFilters.journal" placeholder="Journal Name">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="jrFilters.year">
                        <option value="">Publication Year</option>
                        <option v-for="y in jrYears" :key="y" :value="y">{{ y }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="jrFilters.volume" placeholder="Volume &amp; Issue">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="jrFilters.publisher" placeholder="Publisher">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="jrFilters.language">
                        <option value="">Language</option>
                        <option v-for="l in jrLanguages" :key="l" :value="l">{{ l }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="jrFilters.access">
                        <option value="">Open Access</option>
                        <option v-for="a in jrAccessOptions" :key="a" :value="a">{{ a }}</option>
                      </select>
                    </div></div>
                    <div>
                      <button type="button" style="width: 100%;" class="btn btn-outline-secondary" @click="clearJrFilters">Clear</button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="col-lg-9">
                <div v-if="jrLoading" class="py-5 text-center"><span class="spinner-border text-success"></span></div>
                <template v-else>
                  <div id="jr-results">
                    <div v-for="item in pagedJournals" :key="item.name || item.title" class="journal-card">
                      <div class="journal-icon">📑</div>
                      <div class="journal-content">
                        <h5>{{ item.title || item.sub_title || 'Untitled' }}</h5>
                        <p>Published in {{ item.publisher || item.sub_title || 'N/A' }}</p>
                        <small>Authors: {{ [item.author, item.publication_year].filter(Boolean).join(' | ') || 'N/A' }}</small>
                        <div class="mt-3">
                          <a v-if="jrViewLink(item)" :href="jrViewLink(item)" target="_blank" rel="noopener" class="btn btn-sm btn-success">View Publication</a>
                          <button v-else class="btn btn-sm btn-success" disabled>View Publication</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-if="filteredJournals.length === 0" class="no-results text-center py-4">
                    <h5 class="mt-2">No journals match your filters</h5>
                    <p class="text-muted">Try adjusting or clearing the filters above.</p>
                  </div>
                  <nav v-else class="d-flex justify-content-end align-items-center gap-3 mt-4">
                    <button class="btn btn-outline-secondary" :disabled="jrPage <= 1" @click="jrGoToPage(jrPage - 1)">Previous</button>
                    <span class="small text-muted">Page {{ jrPage }} of {{ jrTotalPages }}</span>
                    <button class="btn btn-outline-secondary" :disabled="jrPage >= jrTotalPages" @click="jrGoToPage(jrPage + 1)">Next</button>
                  </nav>
                </template>
              </div>
            </div>
          </div>

          <!-- ===== Success Stories (dynamic) ===== -->
          <div v-show="activeTab === 'successstories'">
            <div class="row">
              <div class="col-lg-3 mt-2">
                <div class="library-filter-card">
                  <div class="library-filter-title"><i class="bi bi-funnel-fill"></i> Filter Success Stories</div>
                  <form @submit.prevent>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="ssFilters.keyword" placeholder="Keywords">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="ssFilters.theme">
                        <option value="">Theme</option>
                        <option v-for="t in ssThemes" :key="t" :value="t">{{ t }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="ssFilters.location" placeholder="Location (State/District)">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="ssFilters.year">
                        <option value="">Year</option>
                        <option v-for="y in ssYears" :key="y" :value="y">{{ y }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="ssFilters.author" placeholder="Author / Documented By">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="ssFilters.language">
                        <option value="">Language</option>
                        <option v-for="l in ssLanguages" :key="l" :value="l">{{ l }}</option>
                      </select>
                    </div></div>
                    <div>
                      <button type="button" style="width: 100%;" class="btn btn-outline-secondary" @click="clearSsFilters">Clear</button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="col-lg-9">
                <div v-if="ssLoading" class="py-5 text-center"><span class="spinner-border text-success"></span></div>
                <div v-else-if="!ssItems.length" class="no-results text-center py-4">
                  <h5 class="mt-2">No stories found matching your filters</h5>
                  <p class="text-muted">Try adjusting or clearing the filters above.</p>
                </div>
                <template v-else>
                  <div class="d-grid gap-3">
                    <div v-for="item in ssItems" :key="item.name" class="ss-ebook-card">
                      <a :href="ssLink(item) || '#'" :target="ssLink(item) ? '_blank' : undefined" rel="noopener" class="ss-thumb-wrap">
                        <img :src="ssThumbnail(item)" :alt="item.title" class="ss-thumbnail" @error="$event.target.src = DEFAULT_SS_THUMBNAIL">
                      </a>
                      <div class="ss-info">
                        <span class="ss-info-badge">{{ item.theme || 'Success Story' }}</span>
                        <h5 class="ss-info-title">{{ item.title || 'Untitled' }}</h5>
                        <div v-if="item.location" class="ss-info-location"><i class="bi bi-geo-alt-fill"></i> {{ item.location }}</div>
                        <p class="ss-info-desc">{{ item.a_short_description_about_the_artifact || item.description || '' }}</p>
                        <div class="ss-info-meta">
                          <div v-if="ssYear(item)"><i class="bi bi-calendar3"></i> {{ ssYear(item) }}</div>
                          <div v-if="item.author"><i class="bi bi-person-fill"></i> {{ item.author }}</div>
                          <div v-if="item.language"><i class="bi bi-translate"></i> {{ item.language }}</div>
                        </div>
                        <div v-if="(item.tags || []).length" class="ss-tags-wrap"><span v-for="tag in item.tags" :key="tag" class="ss-tag-badge">{{ tag }}</span></div>
                        <a v-if="ssLink(item)" :href="ssLink(item)" target="_blank" rel="noopener" class="ss-view-btn">View Story <i class="bi bi-arrow-right"></i></a>
                      </div>
                    </div>
                  </div>
                  <div v-if="ssTotalPages > 1" class="d-flex align-items-center justify-content-between mt-4 flex-wrap gap-2">
                    <small class="text-muted">Showing {{ (ssPage - 1) * SS_PAGE_SIZE + 1 }}–{{ Math.min(ssPage * SS_PAGE_SIZE, ssTotalCount) }} of {{ ssTotalCount }} records</small>
                    <div class="d-flex align-items-center gap-2">
                      <button class="btn btn-sm btn-outline-secondary" :disabled="ssPage <= 1" @click="loadStories(ssPage - 1)">&larr; Previous</button>
                      <span class="small text-muted">Page {{ ssPage }} of {{ ssTotalPages }}</span>
                      <button class="btn btn-sm btn-outline-secondary" :disabled="ssPage >= ssTotalPages" @click="loadStories(ssPage + 1)">Next &rarr;</button>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- ===== News Letters ===== -->
          <div v-show="activeTab === 'newsletters'">
            <div class="row">
              <div class="col-lg-3 mt-2">
                <div class="library-filter-card">
                  <div class="library-filter-title"><i class="bi bi-funnel-fill"></i> Filter Newsletters</div>
                  <form @submit.prevent>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="nlFilter.keyword" placeholder="Keywords">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="nlFilter.issue" placeholder="Issue / Volume">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="nlFilter.year">
                        <option value="">Publication Year</option>
                        <option v-for="y in nlYears" :key="y">{{ y }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="nlFilter.language">
                        <option value="">Language</option>
                        <option v-for="l in nlLanguages" :key="l">{{ l }}</option>
                      </select>
                    </div></div>
                    <div>
                      <button type="button" style="width: 100%;" class="btn btn-outline-secondary" @click="clearNl">Clear</button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="col-lg-9">
                <div class="row g-4" id="nl-results">
                  <div v-for="item in filteredNewsletters" :key="item.id" class="col-md-4">
                    <div class="newsletter-cover-card">
                      <img :src="item.img" :alt="item.title">
                      <div class="cover-content">
                        <span>{{ item.edition }}</span>
                        <h5>{{ item.title }}</h5>
                        <a :href="item.pdf" target="_blank" class="btn btn-success btn-sm">View Newsletter</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="filteredNewsletters.length === 0" class="no-results text-center py-4">
                  <h5 class="mt-2">No newsletters match your filters</h5>
                  <p class="text-muted">Try adjusting or clearing the filters above.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ===== Case Studies ===== -->
          <div v-show="activeTab === 'casestudies'">
            <div class="row">
              <div class="col-lg-3 mt-2">
                <div class="library-filter-card">
                  <div class="library-filter-title"><i class="bi bi-funnel-fill"></i> Filter Case Studies</div>
                  <form @submit.prevent>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="csFilter.keyword" placeholder="Keywords">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="csFilter.theme">
                        <option value="">Theme</option>
                        <option>Crop</option><option>Livestock</option><option>Water</option>
                        <option>Soil</option><option>Women's Empowerment</option>
                        <option>Livelihood</option><option>H&amp;N</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="csFilter.location" placeholder="Location (State/District)">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="csFilter.year">
                        <option value="">Year</option>
                        <option v-for="y in csYears" :key="y">{{ y }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="csFilter.author" placeholder="Author / Documented By">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="csFilter.language">
                        <option value="">Language</option>
                        <option v-for="l in csLanguages" :key="l">{{ l }}</option>
                      </select>
                    </div></div>
                    <div>
                      <button type="button" style="width: 100%;" class="btn btn-outline-secondary" @click="clearCs">Clear</button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="col-lg-9">
                <h6 id="cs-active-category-label">{{ csCategories[csCategoryIndex]?.label }}</h6>
                <div class="row g-4">
                  <div v-for="item in currentCsItems" :key="item.id + csCategories[csCategoryIndex].value" class="col-md-4">
                    <a :href="item.pdf" target="_blank" class="case-study-card">
                      <div class="case-study-header">
                        <span class="case-tag">Case Study</span>
                        <span class="case-year">{{ item.year }}</span>
                      </div>
                      <h5>{{ item.title }}</h5>
                      <p class="case-location">📍 {{ item.location }}</p>
                      <p class="case-summary">{{ item.summary }}</p>
                      <div class="case-footer">
                        <span>View Case Study →</span>
                      </div>
                    </a>
                  </div>
                </div>
                <div v-if="currentCsItems.length === 0" class="no-results text-center py-4">
                  <h5 class="mt-2">No case studies match your filters</h5>
                  <p class="text-muted">Try adjusting or clearing the filters above.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.library-filter-card {
  background: #fff;
  border: 1px solid #eef0f2;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, .04);
}

.library-filter-title {
  font-size: 15px;
  font-weight: 700;
  color: #1e4356;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.library-filter-card .form-select,
.library-filter-card .form-control {
  border-radius: 8px;
  border-color: #dfe3e6;
}

.library-filter-card .form-select:focus,
.library-filter-card .form-control:focus {
  border-color: #198754;
  box-shadow: 0 0 0 .2rem rgba(25, 135, 84, .15);
}

.library-filter-card .btn-outline-secondary:hover {
  background-color: #198754;
  border-color: #198754;
}

/* Case Studies hover dropdown */
#pubTabs .hover-dropdown {
  position: relative;
}

#pubTabs .hover-dropdown .dropdown-menu {
  position: absolute;
  top: 100%;
  left: auto;
  right: 0;
  z-index: 1050;
  display: block;
  opacity: 0;
  visibility: hidden;
  pointer-events: none;
  transform: translateY(8px);
  transition: opacity .18s ease, transform .18s ease;
  border: none;
  border-radius: 10px;
  box-shadow: 0 12px 28px rgba(0, 0, 0, .14);
  padding: 8px;
  margin-top: 4px;
  min-width: 270px;
}

#pubTabs .hover-dropdown .dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  pointer-events: auto;
  transform: translateY(0);
}

#pubTabs .hover-dropdown .dropdown-item {
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 14px;
  color: #333;
  white-space: normal;
}

#pubTabs .hover-dropdown .dropdown-item:hover {
  background-color: #f4f9f2;
  color: #198754;
}

#pubTabs .hover-dropdown .dropdown-item.active {
  background-color: #198754;
  color: #fff;
}

#cs-active-category-label {
  color: #1e4356;
  font-weight: 700;
  border-left: 4px solid #198754;
  padding-left: 12px;
  margin-bottom: 18px;
}

/* ── Success Story cards ─────────────────────────── */
.ss-ebook-card { display: flex; flex-direction: row; align-items: flex-start; gap: 20px; padding: 20px; border: 1.5px solid #b7dcae; border-radius: 20px; background: #fff; overflow: hidden; transition: transform .3s, box-shadow .3s; }
.ss-ebook-card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(0, 0, 0, .1); }
.ss-thumb-wrap { display: block; flex-shrink: 0; width: 140px; height: 190px; overflow: hidden; border-radius: 6px; background: #f4f6f7; box-shadow: 0 4px 14px rgba(0, 0, 0, .15); text-decoration: none; }
.ss-thumbnail { display: block; width: 100%; height: 100%; object-fit: cover; object-position: center; }
.ss-info { display: flex; flex: 1; min-width: 0; flex-direction: column; }
.ss-info-badge { width: fit-content; margin-bottom: 10px; padding: 4px 12px; border-radius: 20px; background: #eef8f0; color: #198754; font-size: 12px; font-weight: 600; }
.ss-info-title { margin-bottom: 8px; color: #1a1a1a; font-size: 19px; font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.ss-info-location { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; color: #198754; font-size: 13px; }
.ss-info-desc { flex-grow: 1; margin-bottom: 12px; color: #6c757d; font-size: 14px; line-height: 1.6; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.ss-info-meta { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px; color: #1a1a1a; font-size: 14px; }
.ss-info-meta div { display: flex; align-items: center; gap: 8px; }
.ss-info-meta i { color: #1a1a1a; font-size: 16px; }
.ss-tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
.ss-tag-badge { padding: 4px 12px; border: 1.5px solid #8fc07f; border-radius: 20px; background: #fff; color: #1a1a1a; font-size: 13px; font-weight: 500; }
.ss-view-btn { display: inline-flex; align-items: center; gap: 5px; margin-top: auto; color: #198754; font-size: 13px; font-weight: 600; text-decoration: none; transition: gap .2s; }
.ss-view-btn:hover { gap: 10px; }
@media (max-width: 767.98px) {
  .ss-ebook-card { flex-direction: column; }
  .ss-thumb-wrap { margin: 0 auto 16px; }
}
</style>
