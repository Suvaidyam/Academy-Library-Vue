<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCarouselImages, getNewsList } from '../services/api'

const router = useRouter()

const carouselImages = ref([])
const newsItems = ref([])
const newsPage = ref(1)
const hasPrevNews = ref(false)
const hasNextNews = ref(true)

const API_BASE = 'https://erp-ryss.ap.gov.in'

onMounted(async () => {
  await loadCarousel()
  await loadNews()
  setupAcademicsLinks()
})

async function loadCarousel() {
  try {
    const data = await getCarouselImages()
    carouselImages.value = data?.message || []
  } catch {
    carouselImages.value = []
  }
}

function truncateNews(text, max = 80) {
  if (!text) return ''
  if (text.length <= max) return text
  return text.substring(0, max).trim() + '...'
}

async function loadNews(page = 1) {
  try {
    const data = await getNewsList(page, 4)
    const msg = data?.message
    // API returns either { data: [], total_pages: N } or directly []
    if (Array.isArray(msg)) {
      newsItems.value = msg
      hasPrevNews.value = false
      hasNextNews.value = false
    } else {
      newsItems.value = msg?.data || []
      hasPrevNews.value = page > 1
      hasNextNews.value = page < (msg?.total_pages || 1)
    }
    newsPage.value = page
  } catch {
    newsItems.value = []
  }
}

function prevNews() {
  if (newsPage.value > 1) loadNews(newsPage.value - 1)
}

function nextNews() {
  loadNews(newsPage.value + 1)
}

function getImageUrl(path) {
  if (!path) return '/img/about-us-1.jpg'
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function setupAcademicsLinks() {
  // handled via router push in template
}

function navigateCourse(type) {
  router.push({ path: '/learning-library', query: { courseCategory: type } })
}
</script>

<template>
  <!-- Hero Carousel -->
  <div
    id="hero-carousel"
    class="carousel slide carousel-fade"
    data-bs-ride="carousel"
    data-bs-interval="5000"
    data-bs-pause="false"
    style="margin-top: 0;"
  >
    <div class="carousel-indicators" v-if="carouselImages.length">
      <button
        v-for="(img, i) in carouselImages"
        :key="i"
        type="button"
        :data-bs-target="'#hero-carousel'"
        :data-bs-slide-to="i"
        :class="{ active: i === 0 }"
      ></button>
    </div>

    <div class="carousel-inner" style="min-height: 400px;">
      <!-- Fallback slide if no API images -->
      <div v-if="carouselImages.length === 0" class="carousel-item active">
        <!-- <img src="/img/1hero-bg.jpg" class="d-block w-100" style="height: 770px; object-fit: fill;" alt="Hero" /> -->
        <div class="carousel-caption d-md-block">
          <h2 class="text-white fw-bold">Welcome to IGGAARL</h2>
          <p class="text-white">Indo-German Global Academy for Agroecology Research and Learning</p>
        </div>
      </div>
      <div
        v-for="(img, i) in carouselImages"
        :key="i"
        class="carousel-item"
        :class="{ active: i === 0 }"
      >
        <img
          :src="getImageUrl(img.image || img.img || img)"
          class="d-block w-100"
          style="height: 770px; object-fit: fill;"
          :alt="img.title || 'Hero Image'"
        />
        <div v-if="img.title" class="carousel-caption d-none d-md-block">
          <h2 class="text-white fw-bold">{{ img.title }}</h2>
          <p v-if="img.description" class="text-white">{{ img.description }}</p>
        </div>
      </div>
    </div>

    <button class="carousel-control-prev " type="button" data-bs-target="#hero-carousel" data-bs-slide="prev">
      <i class='fas fa-angle-left'  style="font-size:36px; color:white;"></i>

      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#hero-carousel" data-bs-slide="next">
      <i class="fas fa-angle-right" style="font-size:36px; color:white;"></i>
      <span class="visually-hidden">Next</span>
    </button>
  </div>

  <main class="main">
    <!-- About Section -->
    <section id="about" class="section about">
      <div class="container">
        <div class="row gy-3">
          <div class="col-lg-6" data-aos="fade-up" data-aos-delay="100">
            <img src="/img/about-us-1.jpg" alt="About IGGAARL" class="img-fluid" />
          </div>
          <div class="col-lg-6 d-flex flex-column justify-content-center" data-aos="fade-up" data-aos-delay="200">
            <div class="about-content ps-0 ps-lg-3">
              <h3 class="grade-2">Welcome to IGGAARL – Indo-German Global Academy for Agroecology Research and Learning</h3>
              <p>
                The Indo-German Global Academy for Agroecology Research and Learning (IGGAARL) is a collaborative
                initiative between the Government of Andhra Pradesh and the Government of Germany to advance agroecology
                research and learning. IGGAARL serves as a global platform for knowledge exchange, capacity building,
                and innovation in agroecology, with a focus on sustainable farming practices and climate resilience.
              </p>
              <a href="/about" class="btn-get-started">Read More</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Academics Section -->
    <section id="academics" class="featured-services section">
      <div class="container section-title" data-aos="fade-up">
        <h2>Academics</h2>
        <p>
          Academy is offering three programs, Under Graduation, Post Graduation, and Certificate Program. Each program
          is tailored to meet the needs of the learner. Click on the below programs to know what courses are being
          offered under each program.
        </p>
      </div>
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="service-item item-cyan position-relative" style="cursor:pointer;" @click="navigateCourse('Under Graduation')">
              <div class="icon">
                <i class="bi bi-mortarboard"></i>
              </div>
              <a class="stretched-link">
                <h3>Under Graduation</h3>
              </a>
              <p>
                Under Graduation program has experiential learning courses. Courses are conducted through classroom
                sessions, field classes, online classes, and field practice with much emphasis on learning by doing.
                Field-based learnings are evaluated at regular intervals.
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div class="service-item item-orange position-relative" style="cursor:pointer;" @click="navigateCourse('Post Graduation')">
              <div class="icon">
                <i class="bi bi-mortarboard-fill"></i>
              </div>
              <a class="stretched-link">
                <h3>Post Graduation</h3>
              </a>
              <p>
                Post-graduation program has courses that are specifically targeted to enhance the learnings of graduates
                from agroecology background. These experiential learning courses are conducted through classroom
                sessions, field classes, online classes, and own field learning.
              </p>
            </div>
          </div>
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div class="service-item item-teal position-relative" style="cursor:pointer;" @click="navigateCourse('Certification')">
              <div class="icon">
                <i><img src="/img/certificate.png" alt="Certificate" width="32" class="img-fluid" /></i>
              </div>
              <a class="stretched-link">
                <h3>Certificate</h3>
              </a>
              <p>
                Certificate program has courses of shorter duration with hybrid learning approach that are either
                self-paced or scheduled.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Research Section -->
    <section id="research" class="about research-content section light-background">
      <div class="container section-title" data-aos="fade-up">
        <h2>Research</h2>
      </div>
      <div class="container">
        <div class="row gy-4">
          <div class="col-lg-6 position-relative align-self-start" data-aos="fade-up" data-aos-delay="100">
            <img src="/img/gallery/research.png" class="img-fluid" alt="Research" />
          </div>
          <div class="col-lg-6 content" data-aos="fade-up" data-aos-delay="200">
            <h3 class="grade-2">Research Collaborations</h3>
            <p>
              The Academy's research focuses on generating robust, science-based evidence on Natural Farming and
              agroecological practices, with an emphasis on sustainability, farmer empowerment, and climate resilience.
            </p>
            <p>
              Academy researchers, together with nearly one thousand Farmer Scientists, Farmer Mentors, and interns,
              are actively involved in participatory research that strengthens farmer-led innovation and field-based
              learning.
            </p>
            <a href="/about" class="btn-get-started">Read More</a>
          </div>
        </div>
      </div>
    </section>

    <!-- News Section -->
    <section id="news" class="section newSection light-background" style="padding: 60px 0; background-color:#E0ECFC;">
      <div class="container">
        <!-- Title row with pagination arrows -->
        <div class="d-flex align-items-center justify-content-between mb-4">
          <div class="flex-grow-1 text-center">
            <h2 class="home-news-title">News</h2>
          </div>
          <div class="d-flex gap-2">
            <button class="btn home-news-arrow" :disabled="!hasPrevNews" @click="prevNews" aria-label="Previous">
              <i class="bi bi-arrow-left"></i>
            </button>
            <button class="btn home-news-arrow" :disabled="!hasNextNews" @click="nextNews" aria-label="Next">
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>

        <!-- Loading skeletons -->
        <div v-if="newsItems.length === 0" class="row g-4">
          <div v-for="i in 4" :key="i" class="col-md-6">
            <div class="newsCard row g-0">
              <div class="col-4 p-2">
                <div class="placeholder-glow">
                  <div class="placeholder col-12 mb-2" style="height:48px; border-radius:50%; width:48px;"></div>
                  <div class="placeholder col-12" style="height:80px; border-radius:4px;"></div>
                </div>
              </div>
              <div class="col-8 p-2">
                <div class="placeholder-glow">
                  <div class="placeholder col-10 mb-2" style="height:14px;"></div>
                  <div class="placeholder col-8 mb-2" style="height:14px;"></div>
                  <div class="placeholder col-6" style="height:12px;"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- News cards -->
        <div v-else class="row g-4 ">
          <div v-for="item in newsItems" :key="item.name" class="col-md-6" data-aos="fade-up">
            <RouterLink :to="{ path: '/news-details', query: { id: item.name } }" class="text-decoration-none">
              <div class="newsCard row g-0">
                <div class="col-5 col-sm-4 p-2">
                  <!-- <div class="news-source-badge"> -->
                    <!-- <img v-if="item.source_image" :src="getImageUrl(item.source_image)" class="source-logo" :alt="item.source || 'Source'" /> -->
                    <!-- <span v-else class="source-initials">APC NF</span> -->
                  <!-- </div> -->
                  <img :src="getImageUrl(item.image || item.img)" class="img-fluid  home-news-thumb" :alt="item.title" />
                </div>
                <div class="col-7 col-sm-8">
                  <div class="card-body news-card-content p-2">
                    <h5 class="home-news-card-title">{{ item.title }}</h5>
                    <p class="card-text home-news-card-desc">
                      {{ truncateNews(item.description, 80) }}
                      <span class="news-more-link">More</span>
                    </p>
                    <p class="post-date mt-auto mb-0">
                      <i class="bi bi-calendar3 me-1"></i><time>{{ formatDate(item.datetime) }}</time>
                    </p>
                  </div>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Research Partners Section -->
    <section id="researchPartners" class="section py-5">
      <div class="container">
        <div class="container section-title" data-aos="fade-up">
          <h2>Our Research Partners</h2>
        </div>
        <div class="row justify-content-center align-items-center gy-4">
          <div v-for="n in 6" :key="n" class="col-4 col-md-2 text-center">
            <img
              :src="`/img/clients/Research-Learning/research-learning_${n}.png`"
              class="img-fluid"
              :alt="`Partner ${n}`"
              style="max-height:80px; object-fit:contain; filter:grayscale(30%);"
            />
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
#hero-carousel {
  margin-top: 92px;
}
.grade-2 {
  color: #1e4356;
  font-weight: 700;
  font-size: 22px;
}

/* Home News Section */
.home-news-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  display: inline-block;
}
.home-news-title::after {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background: #333;
  margin: 6px auto 0;
  border-radius: 2px;
}
.home-news-arrow {
  width: 38px;
  height: 38px;
  border-radius: 50% !important;
  border: 2px solid #aaa !important;
  background: #fff !important;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s;
}
.home-news-arrow:hover:not(:disabled) {
  border-color: #555 !important;
  color: #222;
}
.home-news-arrow:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.news-source-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e8f5e9;
  overflow: hidden;
  flex-shrink: 0;
}
.source-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.source-initials {
  font-size: 10px;
  font-weight: 700;
  color: #2e7d32;
  text-align: center;
  line-height: 1.1;
}
.home-news-thumb {
  width: 100%;
  height: 132px;
  object-fit: cover;
  border-radius: 4px;
}
.home-news-card-title {
  font-size: 14px;
  font-weight: 700;
  color: #222;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.home-news-card-desc {
  font-size: 13px;
  color: #555;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 6px 0 10px;
}
.news-card-content {
  min-height: 148px;
  display: flex;
  flex-direction: column;
}
.news-more-link {
  color: #1a73e8;
  font-weight: 600;
  margin-left: 2px;
}
.post-date time {
  font-size: 12px;
  color: #777;
}
</style>
