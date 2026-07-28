<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { toast } from 'vue3-toastify'

const authStore = useAuthStore()

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

const allJournals = [
  {
    id: 1,
    title: 'Natural Farming and Climate Resilience: Evidence from Andhra Pradesh',
    published: 'Published in Agricultural Sustainability Journal',
    author: 'APCNF Research Division', year: '2026',
    volume: 'Vol 12, Issue 3', publisher: 'Elsevier',
    language: 'English', peer: 'Yes', access: 'Subscription', pdf: '#',
  },
  {
    id: 2,
    title: 'Natural Farming and Climate Resilience: Evidence from Andhra Pradesh',
    published: 'Published in Agricultural Sustainability Journal',
    author: 'APCNF Research Division', year: '2025',
    volume: 'Vol 11, Issue 4', publisher: 'Springer',
    language: 'English', peer: 'Yes', access: 'Free', pdf: '#',
  },
  {
    id: 3,
    title: 'Natural Farming and Climate Resilience: Evidence from Andhra Pradesh',
    published: 'Published in Agricultural Sustainability Journal',
    author: 'APCNF Research Division', year: '2025',
    volume: 'Vol 10, Issue 2', publisher: 'Taylor & Francis',
    language: 'Telugu', peer: 'No', access: 'Subscription', pdf: '#',
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
const jrFilter = ref({ keyword: '', journal: '', year: '', volume: '', publisher: '', language: '', peer: '', access: '' })
const nlFilter = ref({ keyword: '', issue: '', year: '', language: '' })
const csFilter = ref({ keyword: '', theme: '', location: '', year: '', author: '', language: '' })

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

const filteredJournals = computed(() => {
  const f = jrFilter.value
  return allJournals.filter(j =>
    matchText(j.title + ' ' + j.published, f.keyword) &&
    matchText(j.published, f.journal) &&
    matchExact(j.year, f.year) &&
    matchText(j.volume, f.volume) &&
    matchText(j.publisher, f.publisher) &&
    matchExact(j.language, f.language) &&
    matchExact(j.peer, f.peer) &&
    matchExact(j.access, f.access)
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
function clearJr() { Object.keys(jrFilter.value).forEach(k => jrFilter.value[k] = '') }
function clearNl() { Object.keys(nlFilter.value).forEach(k => nlFilter.value[k] = '') }
function clearCs() { Object.keys(csFilter.value).forEach(k => csFilter.value[k] = '') }

// Unique year options derived from data
const raYears = [...new Set(allArticles.map(a => a.year))].sort()
const jrYears = [...new Set(allJournals.map(j => j.year))].sort()
const nlYears = [...new Set(allNewsletters.map(n => n.year))].sort()
const csYears = [...new Set(Object.values(caseStudyData).flat().map(c => c.year))].sort()
const raLanguages = [...new Set(allArticles.map(a => a.language))].sort()
const jrLanguages = [...new Set(allJournals.map(j => j.language))].sort()
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

          <!-- ===== Journals ===== -->
          <div v-show="activeTab === 'journals'">
            <div class="row">
              <div class="col-lg-3 mt-2">
                <div class="library-filter-card">
                  <div class="library-filter-title"><i class="bi bi-funnel-fill"></i> Filter Journals</div>
                  <form @submit.prevent>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="jrFilter.keyword" placeholder="Keyword(s)">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="jrFilter.journal" placeholder="Journal Name">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="jrFilter.year">
                        <option value="">Publication Year</option>
                        <option v-for="y in jrYears" :key="y">{{ y }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="jrFilter.volume" placeholder="Volume &amp; Issue">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <input type="text" class="form-control" v-model="jrFilter.publisher" placeholder="Publisher">
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="jrFilter.language">
                        <option value="">Language</option>
                        <option v-for="l in jrLanguages" :key="l">{{ l }}</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="jrFilter.peer">
                        <option value="">Peer Reviewed</option>
                        <option>Yes</option><option>No</option>
                      </select>
                    </div></div>
                    <div class="row mb-3"><div class="col-sm-12">
                      <select class="form-select" v-model="jrFilter.access">
                        <option value="">Open Access</option>
                        <option>Free</option><option>Subscription</option>
                      </select>
                    </div></div>
                    <div>
                      <button type="button" style="width: 100%;" class="btn btn-outline-secondary" @click="clearJr">Clear</button>
                    </div>
                  </form>
                </div>
              </div>

              <div class="col-lg-9">
                <div id="jr-results">
                  <div v-for="item in filteredJournals" :key="item.id" class="journal-card">
                    <div class="journal-icon">📑</div>
                    <div class="journal-content">
                      <h5>{{ item.title }}</h5>
                      <p>{{ item.published }}</p>
                      <small>Authors: {{ item.author }} | {{ item.year }}</small>
                      <div class="mt-3">
                        <a :href="item.pdf" target="_blank" class="btn btn-sm btn-success">View Publication</a>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="filteredJournals.length === 0" class="no-results text-center py-4">
                  <h5 class="mt-2">No journals match your filters</h5>
                  <p class="text-muted">Try adjusting or clearing the filters above.</p>
                </div>
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
</style>
