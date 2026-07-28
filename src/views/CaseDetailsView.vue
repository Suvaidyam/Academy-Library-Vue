<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getKnowledgeArtifacts } from '../services/api'

const route = useRoute()
const API_BASE = 'https://erp-ryss.ap.gov.in'

const caseItem = ref(null)
const relatedCases = ref([])
const loading = ref(true)

onMounted(() => loadCase())

async function loadCase() {
  loading.value = true
  try {
    const id = route.query.id
    const data = await getKnowledgeArtifacts({ category: 'Case Study', page_size: 50 })
    const all = data?.message?.data || []
    caseItem.value = all.find(c => c.name === id) || null
    relatedCases.value = all
      .filter(c => c.name !== id)
      .sort((a, b) => new Date(b.date_of_creationpublication) - new Date(a.date_of_creationpublication))
      .slice(0, 5)
  } catch {
    caseItem.value = null
    relatedCases.value = []
  } finally {
    loading.value = false
  }
}

function getImageUrl(path) {
  if (!path) return '/img/blog/blog-1.jpg'
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}
</script>

<template>
  <div>
    <div class="page-title dark-background" style="padding: 80px 0;">
      <div class="container position-relative">
        <h1>Case Study Details</h1>
        <nav class="breadcrumbs">
          <ol>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/case-studies">Case Studies</RouterLink></li>
            <li class="current">Details</li>
          </ol>
        </nav>
      </div>
    </div>

    <div class="container" style="padding-top: 40px; padding-bottom: 60px;">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else class="row">
        <div class="col-lg-8">
          <section id="blog-details" class="blog-details section">
            <div class="container">
              <article v-if="caseItem" class="article">
                <div class="post-img">
                  <img :src="getImageUrl(caseItem.thumbnail_image)" :alt="caseItem.title" class="img-fluid w-100" />
                </div>
                <h2 class="title">{{ caseItem.title }}</h2>
                <div class="meta-top">
                  <ul>
                    <li class="d-flex align-items-center" v-if="caseItem.author">
                      <i class="bi bi-person"></i>
                      <span>{{ caseItem.author }}</span>
                    </li>
                    <li class="d-flex align-items-center" v-if="caseItem.date_of_creationpublication">
                      <i class="bi bi-clock"></i>
                      <time>{{ formatDate(caseItem.date_of_creationpublication) }}</time>
                    </li>
                    <li class="d-flex align-items-center" v-if="caseItem.location">
                      <i class="bi bi-geo-alt"></i>
                      <span>{{ caseItem.location }}</span>
                    </li>
                  </ul>
                </div>
                <div class="content">
                  <p>{{ caseItem.a_short_description_about_the_artifact }}</p>
                  <a
                    v-if="caseItem.success_story_pdf || caseItem.attachment"
                    :href="getImageUrl(caseItem.success_story_pdf || caseItem.attachment)"
                    target="_blank"
                    class="btn btn-sm btn-outline-success mt-3"
                  >
                    <i class="bi bi-file-pdf me-1"></i> View Full Document
                  </a>
                </div>
                <div class="meta-bottom" v-if="caseItem.theme">
                  <ul class="cats">
                    <li><a href="#">{{ caseItem.theme }}</a></li>
                  </ul>
                </div>
              </article>

              <div v-else class="text-center py-5">
                <i class="bi bi-journal-richtext fs-1 text-muted"></i>
                <p class="text-muted mt-2">Case study not found.</p>
                <RouterLink to="/case-studies" class="btn btn-outline-primary mt-2">Back to Case Studies</RouterLink>
              </div>
            </div>
          </section>
        </div>

        <div class="col-lg-4 sidebar">
          <div class="widgets-container">
            <div class="recent-posts-widget widget-item">
              <h3 class="widget-title">More Cases</h3>
              <div id="remaining_cases">
                <div v-for="item in relatedCases" :key="item.name" class="post-item">
                  <img :src="getImageUrl(item.thumbnail_image)" :alt="item.title" />
                  <div>
                    <h4>
                      <RouterLink :to="{ path: '/case-details', query: { id: item.name } }">{{ item.title }}</RouterLink>
                    </h4>
                    <time>{{ formatDate(item.date_of_creationpublication) }}</time>
                  </div>
                </div>
                <div v-if="relatedCases.length === 0" class="text-muted small py-2">No other case studies available.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
