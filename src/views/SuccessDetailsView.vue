<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getKnowledgeArtifacts } from '../services/api'

const route = useRoute()
const API_BASE = 'https://erp-ryss.ap.gov.in'

const storyItem = ref(null)
const relatedStories = ref([])
const loading = ref(true)

onMounted(() => loadStory())

async function loadStory() {
  loading.value = true
  try {
    const id = route.query.id
    const data = await getKnowledgeArtifacts({ category: 'Success Story', page_size: 50 })
    const all = data?.message?.data || []
    storyItem.value = all.find(s => s.name === id) || null
    relatedStories.value = all
      .filter(s => s.name !== id)
      .sort((a, b) => new Date(b.date_of_creationpublication) - new Date(a.date_of_creationpublication))
      .slice(0, 5)
  } catch {
    storyItem.value = null
    relatedStories.value = []
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
        <h1>Success Story Details</h1>
        <nav class="breadcrumbs">
          <ol>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/success-stories">Success Stories</RouterLink></li>
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
              <article v-if="storyItem" class="article">
                <div class="post-img">
                  <img :src="getImageUrl(storyItem.thumbnail_image)" :alt="storyItem.title" class="img-fluid w-100" />
                </div>
                <h2 class="title">{{ storyItem.title }}</h2>
                <div class="meta-top">
                  <ul>
                    <li class="d-flex align-items-center" v-if="storyItem.author">
                      <i class="bi bi-person"></i>
                      <span>{{ storyItem.author }}</span>
                    </li>
                    <li class="d-flex align-items-center" v-if="storyItem.date_of_creationpublication">
                      <i class="bi bi-clock"></i>
                      <time>{{ formatDate(storyItem.date_of_creationpublication) }}</time>
                    </li>
                  </ul>
                </div>
                <div class="content">
                  <a
                    v-if="storyItem.success_story_pdf || storyItem.attachment"
                    :href="getImageUrl(storyItem.success_story_pdf || storyItem.attachment)"
                    target="_blank"
                    class="success_story_pdf d-block"
                  >
                    <p>{{ storyItem.a_short_description_about_the_artifact }}</p>
                  </a>
                  <p v-else>{{ storyItem.a_short_description_about_the_artifact }}</p>
                </div>
              </article>

              <div v-else class="text-center py-5">
                <i class="bi bi-award fs-1 text-muted"></i>
                <p class="text-muted mt-2">Success story not found.</p>
                <RouterLink to="/success-stories" class="btn btn-outline-primary mt-2">Back to Success Stories</RouterLink>
              </div>
            </div>
          </section>
        </div>

        <div class="col-lg-4 sidebar">
          <div class="widgets-container">
            <div class="recent-posts-widget widget-item">
              <h3 class="widget-title">More Stories</h3>
              <div>
                <div v-for="item in relatedStories" :key="item.name" class="post-item">
                  <img :src="getImageUrl(item.thumbnail_image)" :alt="item.title" />
                  <div>
                    <h4>
                      <RouterLink :to="{ path: '/success-details', query: { id: item.name } }">{{ item.title }}</RouterLink>
                    </h4>
                    <time>{{ formatDate(item.date_of_creationpublication) }}</time>
                  </div>
                </div>
                <div v-if="relatedStories.length === 0" class="text-muted small py-2">No other stories available.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
