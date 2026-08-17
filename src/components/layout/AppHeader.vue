<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { getAnnouncementList, getTodayTopics } from '../../services/api'

const auth = useAuthStore()
const router = useRouter()
const mobileNavActive  = ref(false)
const announcements    = ref([])
const openDropdown     = ref(null)
const todayTopics      = ref([])
const showTopicsPopup  = ref(false)
const closingTopicsPopup = ref(false)
const topicsUnseen     = ref(false)

const TOPICS_TODAY_KEY = 'today_topics_popup_last_shown'

function closeTopicsPopup() {
  closingTopicsPopup.value = true
  setTimeout(() => {
    showTopicsPopup.value = false
    closingTopicsPopup.value = false
  }, 250)
}

function openTopicsPopup() {
  showTopicsPopup.value = true
  topicsUnseen.value = false
  localStorage.setItem(TOPICS_TODAY_KEY, new Date().toISOString().slice(0, 10))
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function toggleMobileNav() {
  mobileNavActive.value = !mobileNavActive.value
}

function closeMobileNav() {
  mobileNavActive.value = false
  openDropdown.value    = null
}

function toggleDropdown(name, e) {
  if (!mobileNavActive.value) return   // desktop: let Bootstrap handle it
  e.preventDefault()
  openDropdown.value = openDropdown.value === name ? null : name
}

function logout() {
  auth.logout()
  router.push('/')
}

onMounted(async () => {
  try {
    const data = await getAnnouncementList()
    announcements.value = data?.message || []
  } catch {
    // silently fail
  }

  try {
    const data = await getTodayTopics()
    todayTopics.value = data?.message?.topics?.map(t => t.topic) || []
    if (todayTopics.value.length) {
      const today = new Date().toISOString().slice(0, 10)
      topicsUnseen.value = localStorage.getItem(TOPICS_TODAY_KEY) !== today
    }
  } catch {
    // silently fail
  }
})
</script>

<template>
  <header id="header" class="header align-items-end fixed-top" :class="{ 'mobile-nav-active': mobileNavActive }">
    <div class="container-fluid container-xl position-relative px-sm-4" style="padding-top:0;">
      <div class="d-flex align-items-center justify-content-between">
        <!-- Logo -->
        <div>
          <RouterLink to="/">
            <img src="/img/logo.png" class="logo-img" alt="Academy Logo" />
          </RouterLink>
        </div>

        <!-- Right side controls -->
        <div class="mobd-flex">
          <div class="d-flex justify-content-end align-items-center position-relative" style="z-index:2; min-height:48px; margin-top:0;">
            <div class="d-flex align-items-center gap-2">
              <div class="float-container">
                <!-- Calendar -->
                <div class="position-relative z-index-1000 listItem">
                  <RouterLink to="/calendar" class="btn btn-sm position-relative calendar_icon">
                    <i class="bi bi-calendar-check pr-2 font18"></i>&nbsp; Calendar
                  </RouterLink>
                </div>

                <!-- Announcements Dropdown -->
                <div class="dropdown position-relative z-index-1000 listItem">
                  <button type="button" class="btn btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-megaphone-fill pr-2 lh-16 font18"></i>&nbsp; Announcements
                  </button>
                  <ul class="dropdown-menu mx-5">
                    <li>
                      <h6 class="dropdown-header">Latest Announcements</h6>
                    </li>
                    <li v-if="announcements.length === 0">
                      <span class="dropdown-item text-muted">No announcements</span>
                    </li>
                    <li v-for="ann in announcements" :key="ann.name">
                      <a class="dropdown-item" href="#">{{ ann.title || ann.subject || ann.name }}</a>
                    </li>
                  </ul>
                </div>

                <!-- Podcast -->
                <div class="z-index-1000 listItem">
                  <RouterLink to="/podcast" class="btn btn-sm">
                    <i class="bi bi-broadcast-pin pr-2 font18"></i>&nbsp; Podcast
                  </RouterLink>
                </div>

                <!-- Webinar -->
                <div class="z-index-1000 listItem">
                  <RouterLink to="/webinar" class="btn btn-sm">
                    <i class="bi bi-laptop pr-2 font18"></i>&nbsp; Webinar
                  </RouterLink>
                </div>
              </div>

              <!-- Language Dropdown -->
              <div class="dropdown listItem">
                <button type="button" class="btn btn-success btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="bi bi-globe2"></i>
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#">English</a></li>
                  <li><a class="dropdown-item" href="#">Telugu</a></li>
                  <li><a class="dropdown-item" href="#">German</a></li>
                </ul>
              </div>

              <!-- Auth Button -->
              <div class="z-index-1000">
                <RouterLink v-if="!auth.isLoggedIn" to="/login" id="signin" class="btn btn-success btn-sm">
                  Sign in
                </RouterLink>
                <div v-else class="dropdown">
                  <button class="btn btn-success btn-sm dropdown-toggle d-flex align-items-center gap-2" data-bs-toggle="dropdown">
                    <span class="user-avatar">{{ getInitials(auth.fullName || auth.username) }}</span>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li><span class="dropdown-item-text small text-muted px-3">{{ auth.fullName || auth.username }}</span></li>
                    <li><hr class="dropdown-divider my-1"></li>
                    <li><button class="dropdown-item" @click="logout">Logout</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Main Navigation -->
          <div class="d-flex">
            <nav id="navmenu" class="navmenu align-content-end ms-auto">
              <ul>
                <!-- Home Dropdown -->
                <li class="nav-item dropdown">
                  <a href="#" data-bs-toggle="dropdown"
                     @click="toggleDropdown('home', $event)">
                    Home <i class="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul class="dropdown" :class="{ 'mobile-open': openDropdown === 'home' }">
                    <li><RouterLink class="dropdown-item" to="/about" @click="closeMobileNav">About</RouterLink></li>
                    <li><RouterLink class="dropdown-item" to="/our-leaders" @click="closeMobileNav">Our Leaders</RouterLink></li>
                    <li><RouterLink class="dropdown-item" :to="{ path: '/', hash: '#researchPartners' }" @click="closeMobileNav">Our Partners</RouterLink></li>
                  </ul>
                </li>

                <li><RouterLink to="/#academics" class="tab-link" @click="closeMobileNav">Academics</RouterLink></li>
                <li><RouterLink to="/#research" class="tab-link" @click="closeMobileNav">Research</RouterLink></li>

                <!-- Resources Dropdown -->
                <li class="nav-item dropdown">
                  <a href="#" data-bs-toggle="dropdown"
                     @click="toggleDropdown('resources', $event)">
                    Resources <i class="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul class="dropdown" :class="{ 'mobile-open': openDropdown === 'resources' }">
                    <li><RouterLink class="dropdown-item" to="/library" @click="closeMobileNav">Library</RouterLink></li>
                    <li><RouterLink class="dropdown-item" to="/research-library" @click="closeMobileNav">Publications</RouterLink></li>
                    <li><RouterLink class="dropdown-item" to="/global-library" @click="closeMobileNav">Global Resource</RouterLink></li>
                    <li><RouterLink class="dropdown-item" to="/reports" @click="closeMobileNav">Annual Reports</RouterLink></li>
                  </ul>
                </li>

                <li><RouterLink :to="{ path: '/', hash: '#news' }" class="tab-link" @click="closeMobileNav">News &amp; Events</RouterLink></li>
                <li><RouterLink to="/gallery" class="tab-link" @click="closeMobileNav">Gallery</RouterLink></li>
              </ul>

              <i class="mobile-nav-toggle d-xl-none bi bi-list" @click="toggleMobileNav"></i>
            </nav>
          </div>
        </div>
      </div>

    </div>
  </header>

  <div
    v-if="showTopicsPopup"
    class="topics-popup-overlay"
    :class="{ closing: closingTopicsPopup }"
    @click.self="closeTopicsPopup"
  >
    <div class="topics-popup-box">
      <button type="button" class="topics-popup-close" aria-label="Close" @click="closeTopicsPopup">&times;</button>
      <div class="topics-popup-header"><i class="bi bi-megaphone-fill"></i> Today's Topics</div>
      <div class="topics-popup-sub">Fresh from IGGAARl Academy</div>
      <ul class="topics-popup-list">
        <li v-for="(topic, i) in todayTopics" :key="i" :style="{ animationDelay: `${0.15 + i * 0.12}s` }">
          {{ topic }}
        </li>
      </ul>
    </div>
  </div>

  <button
    v-if="todayTopics.length"
    type="button"
    class="topics-float-btn"
    :class="{ 'has-indicator': topicsUnseen }"
    title="Today's Topics"
    aria-label="Show today's topics"
    @click="openTopicsPopup"
  >
    <i class="bi bi-megaphone-fill"></i>
    <span v-if="topicsUnseen" class="topics-float-dot"></span>
  </button>
</template>

<style scoped>
.logo-img {
  height: 100px;
}
</style>

<!-- Mobile nav dropdown needs global selector since navmenu styles are in global CSS -->
<style>
@media (max-width: 1199px) {
  .navmenu ul li ul.dropdown.mobile-open {
    display: block !important;
  }
}
</style>

<style scoped>
@media (max-width: 576px) {
  .logo-img {
    height: 70px;
  }
}
.user-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  color: #198754;
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
  flex-shrink: 0;
}

.topics-popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 30, 20, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  opacity: 0;
  animation: topicsFadeIn 0.3s ease forwards;
}

.topics-popup-overlay.closing {
  animation: topicsFadeOut 0.25s ease forwards;
}

.topics-popup-box {
  background: #fff;
  border-radius: 14px;
  width: 92%;
  max-width: 440px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 26px 24px;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  position: relative;
  opacity: 0;
  transform: translateY(-24px) scale(0.96);
  animation: topicsPopIn 0.4s 0.05s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.topics-popup-close {
  position: absolute;
  top: 10px;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  line-height: 1;
  color: #9aa5a0;
  cursor: pointer;
  transition: color 0.15s ease;
}

.topics-popup-close:hover {
  color: #198754;
}

.topics-popup-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 700;
  color: #146c43;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  margin-bottom: 6px;
}

.topics-popup-sub {
  font-size: 12.5px;
  color: #7a8a82;
  margin-bottom: 16px;
}

.topics-popup-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.topics-popup-list li {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 11px 0;
  border-bottom: 1px solid #eef5f0;
  font-size: 14.5px;
  color: #1d3b2a;
  line-height: 1.4;
  opacity: 0;
  transform: translateX(-16px);
  animation: topicsItemIn 0.4s ease forwards;
}

.topics-popup-list li:last-child {
  border-bottom: none;
}

.topics-popup-list li::before {
  content: "\2022";
  color: #198754;
  font-weight: 700;
  font-size: 20px;
  line-height: 1;
  flex-shrink: 0;
}

@keyframes topicsFadeIn {
  to {
    opacity: 1;
  }
}

@keyframes topicsFadeOut {
  to {
    opacity: 0;
  }
}

@keyframes topicsPopIn {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes topicsItemIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.topics-float-btn {
  position: fixed;
  right: 22px;
  bottom: 22px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22a866, #146c43);
  color: #fff;
  border: none;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 1900;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  animation: topicsFloatIn 0.4s ease;
}

.topics-float-btn.has-indicator {
  animation: topicsFloatIn 0.4s ease, topicsFloatBounce 2.6s ease-in-out 1s infinite;
}

.topics-float-btn.has-indicator i {
  animation: topicsBellRing 2.6s ease-in-out 1.2s infinite;
}

.topics-float-btn.has-indicator::before,
.topics-float-btn.has-indicator::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: #22a866;
  z-index: -1;
  animation: topicsPulseRing 2.6s ease-out infinite;
}

.topics-float-btn.has-indicator::after {
  animation-delay: 0.9s;
}

.topics-float-dot {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #ff4757;
  border: 2px solid #fff;
  animation: topicsDotPulse 1.8s ease-out infinite;
}

.topics-float-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.topics-float-btn:hover,
.topics-float-btn:hover i {
  animation-play-state: paused;
}

@keyframes topicsDotPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0.6);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(255, 71, 87, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 71, 87, 0);
  }
}

@keyframes topicsFloatIn {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes topicsFloatBounce {
  0%, 100% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-6px);
  }
  20% {
    transform: translateY(0);
  }
}

@keyframes topicsBellRing {
  0%, 100% {
    transform: rotate(0);
  }
  5% {
    transform: rotate(-15deg);
  }
  10% {
    transform: rotate(12deg);
  }
  15% {
    transform: rotate(-8deg);
  }
  20% {
    transform: rotate(0);
  }
}

@keyframes topicsPulseRing {
  0% {
    opacity: 0.55;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.7);
  }
}

@media (max-width: 576px) {
  .topics-float-btn {
    right: 14px;
    bottom: 14px;
    width: 48px;
    height: 48px;
    font-size: 20px;
  }
}
</style>
