<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getNewsList } from '../services/api'

const route = useRoute()
const API_BASE = 'https://erp-ryss.ap.gov.in'

const newsItem = ref(null)
const relatedNews = ref([])
const loading = ref(true)

onMounted(() => loadNews())

async function loadNews() {
  loading.value = true
  try {
    const id = route.query.id
    const data = await getNewsList(1, 50)
    const all = data?.message?.data || []
    const found = all.find(n => n.name === id)
    newsItem.value = found || null
    relatedNews.value = all
      .filter(n => n.name !== id)
      .sort((a, b) => new Date(b.datetime) - new Date(a.datetime))
      .slice(0, 5)
  } catch {
    newsItem.value = null
    relatedNews.value = []
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
    <div class="page-title bg-#000000" style="padding: 80px 0;">
      <div class="container position-relative">
        <h1>News Details</h1>
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
              <article v-if="newsItem" class="article">
                <div class="post-img">
                  <img :src="getImageUrl(newsItem.image)" :alt="newsItem.title" class="img-fluid w-100" />
                </div>

                <h2 class="title">{{ newsItem.title }}</h2>

                <div class="meta-top">
                  <ul>
                    <li class="d-flex align-items-center">
                      <i class="bi bi-clock"></i>
                      <time>{{ formatDate(newsItem.datetime) }}</time>
                    </li>
                  </ul>
                </div>

                <div class="content">
                  <p>{{ newsItem.description }}</p>
                  <div v-if="newsItem.news_link">
                    <a :href="newsItem.news_link" target="_blank" class="btn btn-sm btn-outline-success mt-2">
                      <i class="bi bi-box-arrow-up-right me-1"></i> Read Full Article
                    </a>
                  </div>
                </div>

                <div class="meta-bottom">
                  <ul class="cats">
                    <li><a href="#">News</a></li>
                  </ul>
                </div>
              </article>

              <div v-else class="text-center py-5">
                <i class="bi bi-newspaper fs-1 text-muted"></i>
                <p class="text-muted mt-2">News article not found.</p>
                <RouterLink :to="{ path: '/', hash: '#news' }" class="btn btn-outline-primary mt-2">Back to News</RouterLink>
              </div>
            </div>
          </section>
        </div>

        <div class="col-lg-4 sidebar">
          <div class="widgets-container">
            <div class="recent-posts-widget widget-item">
              <h3 class="widget-title">More News</h3>
              <div id="remaining_news">
                <div
                  v-for="item in relatedNews"
                  :key="item.name"
                  class="post-item"
                >
                  <img :src="getImageUrl(item.image)" :alt="item.title" />
                  <div>
                    <h4>
                      <RouterLink :to="{ path: '/news-details', query: { id: item.name } }">
                        {{ item.title }}
                      </RouterLink>
                    </h4>
                    <time>{{ formatDate(item.datetime) }}</time>
                  </div>
                </div>
                <div v-if="relatedNews.length === 0" class="text-muted small py-2">No other news available.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
