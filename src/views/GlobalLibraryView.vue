<script setup>
import { ref, onMounted } from 'vue'
import { getKnowledgeArtifacts, getLanguageList } from '../services/api'

const API_BASE = 'https://erp-ryss.ap.gov.in'
const PAGE_SIZE = 4

const activeTab = ref('subscribed')
const languages = ref([])
const selectedLanguage = ref('')
const keyword = ref('')

const subscribedItems = ref([])
const subscribedPage = ref(1)
const subscribedTotal = ref(0)

const allItems = ref([])
const allPage = ref(1)
const allTotal = ref(0)

const loading = ref(true)

onMounted(async () => {
  await Promise.all([loadLanguages(), loadSubscribed(1), loadAll(1)])
})

async function loadLanguages() {
  try {
    const data = await getLanguageList()
    languages.value = data?.message || []
  } catch {
    languages.value = []
  }
}

async function loadSubscribed(p = 1) {
  loading.value = true
  try {
    const params = {
      page_size: PAGE_SIZE,
      page: p,
      category: 'Global Resource',
      Subscribe: '1',
    }
    if (selectedLanguage.value) params.language = selectedLanguage.value
    if (keyword.value) params.keySearchInput = keyword.value
    const data = await getKnowledgeArtifacts(params)
    const msg = data?.message
    subscribedItems.value = msg?.data || []
    subscribedTotal.value = msg?.total_count || 0
    subscribedPage.value = p
  } catch {
    subscribedItems.value = []
  } finally {
    loading.value = false
  }
}

async function loadAll(p = 1) {
  loading.value = true
  try {
    const params = {
      page_size: PAGE_SIZE,
      page: p,
      category: 'Global Resource',
      source: 'External',
    }
    if (selectedLanguage.value) params.language = selectedLanguage.value
    if (keyword.value) params.keySearchInput = keyword.value
    const data = await getKnowledgeArtifacts(params)
    const msg = data?.message
    allItems.value = msg?.data || []
    allTotal.value = msg?.total_count || 0
    allPage.value = p
  } catch {
    allItems.value = []
  } finally {
    loading.value = false
  }
}

function switchTab(tab) {
  activeTab.value = tab
}

function applyFilter() {
  if (activeTab.value === 'subscribed') loadSubscribed(1)
  else loadAll(1)
}

function clearFilter() {
  selectedLanguage.value = ''
  keyword.value = ''
  activeTab.value = 'subscribed'
  loadSubscribed(1)
  loadAll(1)
}

function getImageUrl(path) {
  if (!path) return '/img/blog/blog-1.jpg'
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

const subscribedTotalPages = () => Math.max(1, Math.ceil(subscribedTotal.value / PAGE_SIZE))
const allTotalPages = () => Math.max(1, Math.ceil(allTotal.value / PAGE_SIZE))
</script>

<template>
  <div>
    <div class="page-title page-global-information dark-background" style="padding: 80px 0;">
      <div class="container position-relative">
        <h1>Global Resources</h1>
      </div>
    </div>

    <section id="service-details" class="service-details section">
      <div class="container">
        <div class="row gy-5">
          <!-- Sidebar Filters -->
          <div class="col-lg-3" data-aos="fade-up" data-aos-delay="100">
            <div class="service-box">
              <form @submit.prevent="applyFilter">
                <div class="row mb-3">
                  <div class="col-sm-12">
                    <select
                      class="form-select"
                      v-model="selectedLanguage"
                      @change="applyFilter"
                    >
                      <option disabled value="">Language</option>
                      <option v-for="lang in languages" :key="lang.name" :value="lang.name">
                        {{ lang.language_name || lang.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-sm-12">
                    <input
                      class="form-control"
                      v-model="keyword"
                      placeholder="Keywords"
                      @input="applyFilter"
                    />
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="services-list">
                    <button
                      type="button"
                      style="width: 100%;"
                      class="btn btn-outline-secondary"
                      @click="clearFilter"
                    >Clear</button>
                  </div>
                </div>
              </form>
            </div>

            <div class="help-box d-flex flex-column justify-content-center align-items-center">
              <i class="bi bi-envelope help-icon"></i>
              <h4>Have a Question?</h4>
              <p class="d-flex align-items-center mt-1 mb-0">
                <i class="bi bi-envelope me-2"></i>
                <a href="mailto:iggaarl@ryss.ap.gov.in">iggaarl@ryss.ap.gov.in</a>
              </p>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-lg-9 ps-lg-5" data-aos="fade-up" data-aos-delay="200">
            <nav>
              <div class="nav nav-tabs mb-3" role="tablist">
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'subscribed', disabled: activeTab === 'subscribed' }"
                  @click="switchTab('subscribed')"
                  type="button"
                >Subscribed</button>
                <button
                  class="nav-link"
                  :class="{ active: activeTab === 'all', disabled: activeTab === 'all' }"
                  @click="switchTab('all')"
                  type="button"
                >All</button>
              </div>
            </nav>

            <div class="tab-content p-3 border border-top-0">
              <!-- Subscribed Tab -->
              <div v-show="activeTab === 'subscribed'">
                <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status"></div>
                </div>
                <section v-else id="blog-posts" class="blog-posts">
                  <div class="row gy-4">
                    <div v-if="subscribedItems.length === 0" class="col-12 text-center py-4">
                      <p class="text-muted">No subscribed resources found.</p>
                    </div>
                    <div
                      v-for="item in subscribedItems"
                      :key="item.name"
                      class="col-lg-6"
                    >
                      <article>
                        <div class="post-img">
                          <img :src="getImageUrl(item.thumbnail_image)" :alt="item.title" class="img-fluid blog-img" />
                        </div>
                        <p class="post-category">{{ item.category }}</p>
                        <h2 class="title">
                          <a :href="item.resource_link || '#'" target="_blank" class="blog-title">{{ item.title }}</a>
                        </h2>
                        <div class="d-flex align-items-center">
                          <img src="/img/blog/blog-author.jpg" alt="" class="img-fluid post-author-img flex-shrink-0" />
                          <div class="post-meta">
                            <p class="post-author">{{ item.internalauthor || item.author }}</p>
                            <p class="post-date"><time>{{ formatDate(item.date_of_creationpublication) }}</time></p>
                          </div>
                        </div>
                        <div v-if="item.resource_link" class="mt-3">
                          <a :href="item.resource_link" target="_blank" class="resource_link btn btn-sm btn-outline-success">
                            <i class="bi bi-box-arrow-up-right me-1"></i> View Resource
                          </a>
                        </div>
                      </article>
                    </div>
                  </div>
                </section>

                <div v-if="subscribedTotal > PAGE_SIZE" class="d-flex justify-content-between align-items-center mt-3">
                  <button
                    class="btn border-0 bg-transparent"
                    :disabled="subscribedPage <= 1"
                    @click="loadSubscribed(subscribedPage - 1)"
                  ><i class="bi bi-arrow-left-circle fs-1"></i></button>
                  <button
                    class="btn border-0 bg-transparent"
                    :disabled="subscribedPage >= subscribedTotalPages()"
                    @click="loadSubscribed(subscribedPage + 1)"
                  ><i class="bi bi-arrow-right-circle fs-1"></i></button>
                </div>
              </div>

              <!-- All Tab -->
              <div v-show="activeTab === 'all'">
                <div v-if="loading" class="text-center py-5">
                  <div class="spinner-border text-primary" role="status"></div>
                </div>
                <div v-else class="row">
                  <div v-if="allItems.length === 0" class="col-12 text-center py-4">
                    <p class="text-muted">No resources found.</p>
                  </div>
                  <div
                    v-for="item in allItems"
                    :key="item.name"
                    class="col-lg-6 mb-4"
                  >
                    <article>
                      <div class="post-img">
                        <img :src="getImageUrl(item.thumbnail_image)" :alt="item.title" class="img-fluid blog-img" />
                      </div>
                      <p class="post-category">{{ item.category }}</p>
                      <h2 class="title">
                        <a :href="item.resource_link || '#'" target="_blank" class="blog-title">{{ item.title }}</a>
                      </h2>
                      <div class="d-flex align-items-center">
                        <img src="/img/blog/blog-author.jpg" alt="" class="img-fluid post-author-img flex-shrink-0" />
                        <div class="post-meta">
                          <p class="post-author">{{ item.internalauthor || item.author }}</p>
                          <p class="post-date"><time>{{ formatDate(item.date_of_creationpublication) }}</time></p>
                        </div>
                      </div>
                      <p class="small text-muted mt-2">{{ item.a_short_description_about_the_artifact }}</p>
                      <div v-if="item.resource_link" class="mt-2">
                        <a :href="item.resource_link" target="_blank" class="resource_link btn btn-sm btn-outline-success">
                          <i class="bi bi-box-arrow-up-right me-1"></i> View Resource
                        </a>
                      </div>
                    </article>
                  </div>
                </div>

                <div v-if="allTotal > PAGE_SIZE" class="d-flex justify-content-between align-items-center mt-3">
                  <button
                    class="btn border-0 bg-transparent"
                    :disabled="allPage <= 1"
                    @click="loadAll(allPage - 1)"
                  ><i class="bi bi-arrow-left-circle fs-1"></i></button>
                  <button
                    class="btn border-0 bg-transparent"
                    :disabled="allPage >= allTotalPages()"
                    @click="loadAll(allPage + 1)"
                  ><i class="bi bi-arrow-right-circle fs-1"></i></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
