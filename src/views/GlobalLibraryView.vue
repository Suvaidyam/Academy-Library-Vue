<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { getDoctypeList, getEbooks } from '../services/api'

const API_BASE = 'https://erp-ryss.ap.gov.in'

const activeCategory = ref('ebooks')

function unique(values) { return [...new Set(values.filter(Boolean))] }
function apiUrl(path) { return !path ? '' : path.startsWith('http') ? path : `${API_BASE}${path}` }
function imageUrl(path) { return apiUrl(path) || '/img/book-1.jpg' }

function selectCategory(category) {
  activeCategory.value = category
  if (category === 'ebooks' && !ebooks.value.length) loadEbooks(1)
}

// ───────────────────────── E-Books ─────────────────────────

const ebookFilters = ref({ book_title: '', sub_title: '', type: '', theme: '', book_category: '', book_subcategory: '', author: '', publisher: '', isbn: '', book_keywords: '' })
const ebooks = ref([])
const ebookLoading = ref(false)
const ebookPage = ref(1)
const ebookTotalPages = ref(1)
const ebookCategories = ref([])
const ebookSubcategories = ref([])
let ebookSearchTimer

async function loadEbookOptions() {
  try {
    const result = await getDoctypeList({
      doctype: 'Knowledge Artifact',
      fields: JSON.stringify(['book_category', 'book_subcategory']),
      or_filters: JSON.stringify([{ category: 'E-Book' }]),
    })
    const data = result?.message || []
    ebookCategories.value = unique(data.map(item => item.book_category)).sort()
    ebookSubcategories.value = unique(data.map(item => item.book_subcategory)).sort()
  } catch { ebookCategories.value = []; ebookSubcategories.value = [] }
}

async function loadEbooks(targetPage = 1) {
  ebookLoading.value = true
  try {
    const result = await getEbooks({ page: targetPage, rowPerPage: 3, ...ebookFilters.value })
    const message = result?.message || {}
    ebooks.value = message.data || (Array.isArray(message) ? message : [])
    ebookPage.value = Number(message.page || targetPage)
    ebookTotalPages.value = Math.max(1, Math.ceil(Number(message.totalRow || ebooks.value.length) / Number(message.rowPerPage || 3)))
  } catch { ebooks.value = []; ebookPage.value = 1; ebookTotalPages.value = 1 } finally { ebookLoading.value = false }
}

function clearEbookFilters() {
  ebookFilters.value = { book_title: '', sub_title: '', type: '', theme: '', book_category: '', book_subcategory: '', author: '', publisher: '', isbn: '', book_keywords: '' }
  loadEbooks(1)
}

watch(ebookFilters, () => {
  if (activeCategory.value !== 'ebooks') return
  clearTimeout(ebookSearchTimer)
  ebookSearchTimer = setTimeout(() => loadEbooks(1), 350)
}, { deep: true })

// ───────────────────────── Journals (static) ─────────────────────────

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

const jrFilters = ref({ keyword: '', journal: '', year: '', volume: '', publisher: '', language: '', access: '' })

function matchText(value, query) {
  return !query || (value || '').toLowerCase().includes(query.toLowerCase())
}
function matchExact(value, query) {
  return !query || (value || '').toLowerCase() === query.toLowerCase()
}

const filteredJournals = computed(() => {
  const f = jrFilters.value
  return allJournals.filter(j =>
    matchText(j.title + ' ' + j.published, f.keyword) &&
    matchText(j.published, f.journal) &&
    matchExact(j.year, f.year) &&
    matchText(j.volume, f.volume) &&
    matchText(j.publisher, f.publisher) &&
    matchExact(j.language, f.language) &&
    matchExact(j.access, f.access)
  )
})

const jrYears = [...new Set(allJournals.map(j => j.year))].sort()
const jrLanguages = [...new Set(allJournals.map(j => j.language))].sort()

function clearJrFilters() {
  jrFilters.value = { keyword: '', journal: '', year: '', volume: '', publisher: '', language: '', access: '' }
}

onMounted(async () => {
  await Promise.all([loadEbookOptions(), loadEbooks(1)])
})
</script>

<template>
  <div>
    <div class="page-title dark-background">
      <div class="container position-relative"><h1>Global Resource</h1></div>
    </div>

    <div class="container mt-4 global-resource-page">
      <div class="global-tabs" role="tablist" aria-label="Global resource sections">
        <button :class="{ active: activeCategory === 'ebooks' }" type="button" @click="selectCategory('ebooks')">E-Books &amp; Reference Materials</button>
        <button :class="{ active: activeCategory === 'researchArticles' }" type="button" @click="selectCategory('researchArticles')">Research Articles</button>
        <button :class="{ active: activeCategory === 'journals' }" type="button" @click="selectCategory('journals')">Journals</button>
      </div>

      <div class="global-content rounded-bottom border bg-white p-3 p-lg-4">
        <div v-if="activeCategory === 'ebooks'" class="row g-4">
          <aside class="col-lg-4">
            <form class="library-filter-card">
              <h2><i class="bi bi-funnel-fill"></i> Filter E-Books</h2>
              <input v-for="key in ['book_title', 'sub_title', 'type', 'theme', 'author', 'publisher', 'isbn', 'book_keywords']" :key="key" v-model="ebookFilters[key]" class="form-control mb-2" :placeholder="key.replaceAll('_', ' ')">
              <select v-model="ebookFilters.book_category" class="form-select mb-2"><option value="">Select Category</option><option v-for="item in ebookCategories" :key="item" :value="item">{{ item }}</option></select>
              <select v-model="ebookFilters.book_subcategory" class="form-select mb-3"><option value="">Select Sub-Category</option><option v-for="item in ebookSubcategories" :key="item" :value="item">{{ item }}</option></select>
              <button class="btn btn-outline-secondary w-100" type="button" @click="clearEbookFilters">Clear</button>
            </form>
          </aside>
          <div class="col-lg-8">
            <h2 class="global-category-title">E-Books &amp; Reference Materials</h2>
            <p v-if="ebookLoading" class="text-muted">Loading e-books…</p>
            <div v-else-if="!ebooks.length" class="library-empty"><i class="bi bi-journal-x"></i><h3>No E-Books Found</h3><p>Try adjusting or clearing the filters.</p></div>
            <div v-else class="d-grid gap-3">
              <article v-for="ebook in ebooks" :key="ebook.name" class="ebook-card">
                <a :href="ebook.resource_link || '#'" target="_blank" rel="noopener" class="ebook-thumb-wrap"><img :src="imageUrl(ebook.thumbnail_image)" :alt="ebook.book_title" @error="$event.target.src = '/img/new_ebook_thumnail_img.jpeg'"></a>
                <div class="ebook-info">
                  <h3>{{ ebook.book_title || 'Untitled E-Book' }}</h3>
                  <p v-if="ebook.sub_title">{{ ebook.sub_title }}</p>
                  <div class="ebook-badges"><span v-for="tag in [ebook.theme, ebook.book_category, ebook.book_subcategory].filter(Boolean)" :key="tag">{{ tag }}</span></div>
                  <small v-if="ebook.author"><i class="bi bi-person-fill me-1"></i>{{ ebook.author }}</small>
                  <small v-if="ebook.publisher"><i class="bi bi-bank ms-3 me-1"></i>{{ ebook.publisher }}</small>
                  <small v-if="ebook.isbn" class="d-block mt-2"><i class="bi bi-upc-scan me-1"></i>ISBN: {{ ebook.isbn }}</small>
                </div>
              </article>
            </div>
            <nav class="d-flex justify-content-end align-items-center gap-3 mt-4">
              <button class="btn btn-outline-secondary" :disabled="ebookPage <= 1 || ebookLoading" @click="loadEbooks(ebookPage - 1)">Previous</button>
              <span class="small text-muted">Page {{ ebookPage }} of {{ ebookTotalPages }}</span>
              <button class="btn btn-outline-secondary" :disabled="ebookPage >= ebookTotalPages || ebookLoading" @click="loadEbooks(ebookPage + 1)">Next</button>
            </nav>
          </div>
        </div>

        <div v-else-if="activeCategory === 'researchArticles'" class="container py-4">
          <div class="row g-4">
            <div v-for="item in [{type:'🔬 Research Article', title:'Impact of Natural Farming on Soil Health', author:'APCNF Research Team', summary:'Assessment of soil biological activity and organic carbon under natural farming systems.', tags:['Soil Health','Carbon'],date:'May 2026'}, {type:'📊 Research Report', title:'Climate Resilience through Natural Farming', author:'Sustainable Agriculture Division', summary:'Study on crop performance under drought and extreme weather conditions.',tags:['Climate','Resilience'],date:'March 2026'}, {type:'📈 Case Study', title:'Farmer Income Improvement Analysis', author:'APCNF Monitoring Team', summary:'Comparative study of farm economics before and after natural farming adoption.',tags:['Income','Economics'],date:'January 2026'}]" :key="item.title" class="col-md-4">
              <article class="research-card">
                <span class="research-badge">{{ item.type }}</span>
                <h5>{{ item.title }}</h5>
                <p class="authors">{{ item.author }}</p>
                <p class="summary">{{ item.summary }}</p>
                <div class="keywords"><span v-for="tag in item.tags" :key="tag">{{ tag }}</span></div>
                <div class="research-footer"><small>{{ item.date }}</small><a href="/img/article.pdf" target="_blank" class="btn btn-success btn-sm">View PDF</a></div>
              </article>
            </div>
          </div>
        </div>

        <div v-else-if="activeCategory === 'journals'" class="row g-4">
          <aside class="col-lg-3">
            <form class="library-filter-card">
              <h2><i class="bi bi-funnel-fill"></i> Filter Journals</h2>
              <input v-model="jrFilters.keyword" class="form-control mb-2" placeholder="Keyword(s)">
              <input v-model="jrFilters.journal" class="form-control mb-2" placeholder="Journal Name">
              <select v-model="jrFilters.year" class="form-select mb-2"><option value="">Publication Year</option><option v-for="y in jrYears" :key="y" :value="y">{{ y }}</option></select>
              <input v-model="jrFilters.volume" class="form-control mb-2" placeholder="Volume &amp; Issue">
              <input v-model="jrFilters.publisher" class="form-control mb-2" placeholder="Publisher">
              <select v-model="jrFilters.language" class="form-select mb-2"><option value="">Language</option><option v-for="l in jrLanguages" :key="l" :value="l">{{ l }}</option></select>
              <select v-model="jrFilters.access" class="form-select mb-3"><option value="">Open Access</option><option>Free</option><option>Subscription</option></select>
              <button class="btn btn-outline-secondary w-100" type="button" @click="clearJrFilters">Clear</button>
            </form>
          </aside>
          <div class="col-lg-9">
            <h2 class="global-category-title">Journals</h2>
            <div v-if="!filteredJournals.length" class="library-empty"><i class="bi bi-journal-x"></i><h3>No journals match your filters</h3><p>Try adjusting or clearing the filters above.</p></div>
            <template v-else>
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
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.global-resource-page { padding-bottom: 3rem; }
.global-tabs { position: relative; z-index: 5; display: flex; gap: 4px; flex-wrap: wrap; border-bottom: 2px solid #e9ecef; }
.global-tabs > button { flex: 0 0 auto; padding: 6px 20px; color: #495057; background: transparent; border: 0; border-radius: 8px 8px 0 0; font-weight: 500; transition: background-color .2s ease, color .2s ease; }
.global-tabs > button:hover { color: #198754; background: #f4f9f2; }
.global-tabs > button.active { color: #198754; background: #f4f9f2; box-shadow: inset 0 -3px 0 #198754; font-weight: 600; }
.global-content { position: relative; z-index: 1; border-top: 0 !important; border-radius: 0 !important; }

.library-filter-card { padding: 20px; border: 1px solid #eef0f2; border-radius: 14px; background: #fff; box-shadow: 0 4px 14px rgba(0, 0, 0, .04); }
.library-filter-card h2 { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; color: #1e4356; font-size: 15px; font-weight: 700; }
.library-filter-card .form-select, .library-filter-card .form-control { border-color: #dfe3e6; border-radius: 8px; }
.library-empty { padding: 4rem 1rem; text-align: center; color: #708089; }
.library-empty i { font-size: 2.5rem; }
.library-empty h3 { margin-top: .75rem; color: #1e4356; font-size: 1.15rem; }

.ebook-card { display: flex; min-height: 190px; gap: 20px; padding: 20px; border: 1.5px solid #b7dcae; border-radius: 20px; background: #fff; color: inherit; }
.ebook-card:hover { border-color: #198754; box-shadow: 0 12px 30px rgba(0, 0, 0, .1); }
.ebook-thumb-wrap { flex: 0 0 140px; height: 190px; overflow: hidden; border-radius: 6px; background: #f4f6f7; box-shadow: 0 4px 14px rgba(0, 0, 0, .15); }
.ebook-card img { width: 100%; height: 100%; object-fit: contain; }
.ebook-info { display: flex; flex: 1; min-width: 0; flex-direction: column; }
.ebook-badges { display: flex; flex-wrap: wrap; gap: 8px; margin-top: .4rem; }
.ebook-badges span, .keywords span { padding: 4px 10px; border: 1.5px solid #8fc07f; border-radius: 20px; font-size: .78rem; }
.global-category-title { margin-bottom: 18px; padding-left: 12px; border-left: 4px solid #198754; color: #1e4356; font-size: 1rem; font-weight: 700; }

.research-card { height: 100%; padding: 1.25rem; border: 1px solid #dce5e9; border-radius: .65rem; background: #fff; box-shadow: 0 3px 12px rgba(23, 59, 73, .05); }
.research-card h5 { margin: .8rem 0 .4rem; color: #1e4356; font-size: 1.05rem; }
.research-card p { color: #667982; font-size: .85rem; }
.research-badge { color: #198754; font-size: .85rem; font-weight: 700; }
.keywords { display: flex; gap: .4rem; flex-wrap: wrap; }
.research-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 1.2rem; }

.journal-card { display: flex; gap: 20px; margin-bottom: 1.5rem; padding: 20px; border: 1px solid #dce5e9; border-radius: 10px; background: #fff; box-shadow: 0 3px 12px rgba(23, 59, 73, .05); }
.journal-icon { font-size: 2.2rem; }
.journal-content h5 { color: #1e4356; }
.journal-content p { margin-bottom: .35rem; color: #6c757d; }
</style>
