<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { getAnnouncementList } from '../../services/api'

const auth = useAuthStore()
const router = useRouter()
const mobileNavActive = ref(false)
const announcements = ref([])

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
                  <a href="#" data-bs-toggle="dropdown">
                    Home <i class="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul class="dropdown">
                    <li><RouterLink class="dropdown-item" to="/about" @click="closeMobileNav">About</RouterLink></li>
                    <li><RouterLink class="dropdown-item" to="/our-leaders" @click="closeMobileNav">Our Leaders</RouterLink></li>
                    <li><RouterLink class="dropdown-item" :to="{ path: '/', hash: '#researchPartners' }" @click="closeMobileNav">Our Partners</RouterLink></li>
                  </ul>
                </li>

                <li><RouterLink to="/#academics" class="tab-link" @click="closeMobileNav">Academics</RouterLink></li>
                <li><RouterLink to="/#research" class="tab-link" @click="closeMobileNav">Research</RouterLink></li>

                <!-- Resources Dropdown -->
                <li class="nav-item dropdown">
                  <a href="#" data-bs-toggle="dropdown">
                    Resources <i class="bi bi-chevron-down toggle-dropdown"></i>
                  </a>
                  <ul class="dropdown">
                    <li><RouterLink class="dropdown-item" to="/library" @click="closeMobileNav">Library</RouterLink></li>
                    <li><RouterLink class="dropdown-item" to="/research-library" @click="closeMobileNav">Publications</RouterLink></li>
                    <li><RouterLink class="dropdown-item" to="/success-stories" @click="closeMobileNav">Success Stories</RouterLink></li>
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
</template>

<style scoped>
.logo-img {
  height: 100px;
}
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
</style>
