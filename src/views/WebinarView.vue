<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { toast } from 'vue3-toastify'
import { getWebinarsByType, registerForWebinar, getCalendarEvents } from '../services/api'

const API_BASE = 'https://erp-ryss.ap.gov.in'

// ── State ─────────────────────────────────────────────────────────────────
const upcomingList    = ref([])
const upcomingLoading = ref(true)
const upcomingShowAll = ref(false)
const upcomingAllLoading = ref(false)
const upcomingTotal   = ref(0)
const UPCOMING_PAGE_SIZE = 3

const pastList        = ref([])
const pastLoading     = ref(true)
const pastPage        = ref(1)
const pastTotalPages  = ref(1)
const PAST_PAGE_SIZE  = 8
const pastSearch      = ref('')
const pastTopic       = ref('')
const pastAllTopics   = ref([])
const pastViewAllLoading = ref(false)
const showPastPagination = ref(false)

const webinarMap      = new Map()

// ── Modal state ───────────────────────────────────────────────────────────
const detailsModal    = ref(false)
const registerModal   = ref(false)
const newsletterModal = ref(false)

const selectedWebinar = ref(null)

const regForm = ref({ fname: '', lname: '', org: '', role: '', email: '', phone: '', interests: '' })
const regErrors = ref({})
const regSubmitting = ref(false)

const nlForm = ref({ name: '', email: '' })
const nlSubmitting = ref(false)

// ── Helpers ───────────────────────────────────────────────────────────────
function resolveImg(path) {
  if (!path) return null
  return path.startsWith('http') ? path : `${API_BASE}${path}`
}

function thumbGradient(name = '') {
  const p = [
    ['#a8d5b5', '#1e6b44'], ['#90c4a8', '#1a5c3a'],
    ['#b5d5c5', '#256b47'], ['#c5e8d0', '#1e5c38'], ['#8ec9a8', '#174f33'],
  ]
  return `linear-gradient(135deg,${p[(name.charCodeAt(0) || 0) % p.length].join(',')})`
}

function fmtDate(dtStr) {
  if (!dtStr) return { day: '--', mon: '---', yr: '----', wday: '---' }
  const d = new Date(dtStr)
  return {
    day:  d.getDate(),
    mon:  d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    yr:   d.getFullYear(),
    wday: d.toLocaleString('en-US', { weekday: 'short' }).toUpperCase(),
    full: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
  }
}

function fmtTimeRange(dtStr, durationSec) {
  const start = new Date(dtStr)
  const end   = new Date(start.getTime() + (durationSec || 0) * 1000)
  const opts  = { hour: '2-digit', minute: '2-digit', hour12: true }
  return `${start.toLocaleTimeString('en-IN', opts)} – ${end.toLocaleTimeString('en-IN', opts)} IST`
}

function fmtDuration(sec) {
  if (!sec) return null
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60)
  if (h && m) return `${h}h ${m}m`
  return h ? `${h}h` : m ? `${m}m` : null
}

function fmtShortDuration(sec) {
  if (!sec) return ''
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60)
  return h ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
           : `${String(m).padStart(2, '0')}:00`
}

function fmtViews(n) {
  if (!n) return null
  return n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : String(n)
}

// ── Fetch upcoming ────────────────────────────────────────────────────────
async function fetchUpcoming(all = false) {
  upcomingLoading.value = true
  upcomingShowAll.value = false
  try {
    const pageSize = all ? 100 : UPCOMING_PAGE_SIZE
    const res = await getWebinarsByType('upcoming', 1, pageSize)
    if (res?.message?.success && Array.isArray(res.message.data)) {
      upcomingList.value = res.message.data
      upcomingTotal.value = res.message.total_count || 0
      res.message.data.forEach(wb => {
        webinarMap.set(wb.name, { ...wb, timeRng: fmtTimeRange(wb.date_time, wb.duration) })
      })
      if (!all && upcomingTotal.value > UPCOMING_PAGE_SIZE) {
        upcomingShowAll.value = true
      }
    } else {
      upcomingList.value = []
    }
  } catch {
    upcomingList.value = []
  } finally {
    upcomingLoading.value = false
  }
}

async function loadAllUpcoming() {
  upcomingAllLoading.value = true
  try {
    await fetchUpcoming(true)
    upcomingShowAll.value = false
  } finally {
    upcomingAllLoading.value = false
  }
}

// ── Fetch past ────────────────────────────────────────────────────────────
async function fetchPast(page = 1, all = false) {
  pastLoading.value = true
  pastPage.value = page
  try {
    const pageSize = all ? 100 : PAST_PAGE_SIZE
    const res = await getWebinarsByType('past', page, pageSize)
    if (res?.message?.success && Array.isArray(res.message.data)) {
      pastList.value = res.message.data
      pastTotalPages.value = res.message.total_pages || 1
      res.message.data.forEach(wb => {
        webinarMap.set(wb.name, { ...wb, timeRng: fmtTimeRange(wb.date_time, wb.duration) })
      })
      // populate topic filter
      const topics = [...new Set(res.message.data.map(wb => wb.topic || wb.theme || wb.category || '').filter(Boolean))].sort()
      pastAllTopics.value = topics
      showPastPagination.value = !all && pastTotalPages.value > 1
    } else {
      pastList.value = []
    }
  } catch {
    pastList.value = []
  } finally {
    pastLoading.value = false
  }
}

async function loadAllPast() {
  pastViewAllLoading.value = true
  try {
    await fetchPast(1, true)
    showPastPagination.value = false
  } finally {
    pastViewAllLoading.value = false
  }
}

// ── Filtered past ─────────────────────────────────────────────────────────
const filteredPast = computed(() => {
  const q = pastSearch.value.toLowerCase()
  const t = pastTopic.value.toLowerCase()
  return pastList.value.filter(wb => {
    const title = (wb.title || '').toLowerCase()
    const topic = (wb.topic || wb.theme || wb.category || '').toLowerCase()
    return (!q || title.includes(q)) && (!t || topic === t)
  })
})

// ── Pagination pages ──────────────────────────────────────────────────────
const paginationPages = computed(() => {
  const total = pastTotalPages.value
  const cur   = pastPage.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = [1]
  if (cur > 3) pages.push('…')
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) pages.push(i)
  if (cur < total - 2) pages.push('…')
  pages.push(total)
  return pages
})

// ── Modals ────────────────────────────────────────────────────────────────
function openDetails(id) {
  const wb = webinarMap.get(id)
  if (!wb) return
  selectedWebinar.value = wb
  detailsModal.value = true
}

function closeDetails() { detailsModal.value = false }

function openRegister(id, title) {
  const wb = webinarMap.get(id)
  if (wb) selectedWebinar.value = wb
  else selectedWebinar.value = { name: id, title }
  regForm.value = { fname: '', lname: '', org: '', role: '', email: '', phone: '', interests: '' }
  regErrors.value = {}
  detailsModal.value = false
  registerModal.value = true
}

function closeRegister() { registerModal.value = false }

function openNewsletter() { newsletterModal.value = true }
function closeNewsletter() { newsletterModal.value = false }

// ── Registration submit ───────────────────────────────────────────────────
function validateReg() {
  const errs = {}
  const f = regForm.value
  if (!f.fname.trim()) errs.fname = true
  if (!f.lname.trim()) errs.lname = true
  if (!f.org.trim())   errs.org   = true
  if (!f.role.trim())  errs.role  = true
  if (!f.email.trim()) errs.email = true
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = true
  if (!f.phone.trim()) errs.phone = true
  regErrors.value = errs
  return Object.keys(errs).length === 0
}

async function submitReg() {
  if (!validateReg()) { toast.warning('Please fill in all required fields.'); return }
  regSubmitting.value = true
  try {
    const f = regForm.value
    const res = await registerForWebinar(selectedWebinar.value?.name, {
      first_name: f.fname, last_name: f.lname,
      organization: f.org, role: f.role,
      email: f.email, phone: f.phone, interests: f.interests,
    })
    if (res?.message?.success) {
      toast.success(res.message.message || 'Registered successfully!')
      registerModal.value = false
    } else {
      toast.error(res?.message?.message || 'Registration failed. Please try again.')
    }
  } catch {
    toast.error('Something went wrong. Please try again.')
  } finally {
    regSubmitting.value = false
  }
}

// ── Newsletter submit ──────────────────────────────────────────────────────
function submitNewsletter() {
  const { name, email } = nlForm.value
  if (!name.trim() || !email.trim()) { toast.warning('Please fill in all required fields.'); return }
  toast.success(`Thank you, ${name}! You've been subscribed.`)
  nlForm.value = { name: '', email: '' }
  newsletterModal.value = false
}

// ── Add to Calendar ───────────────────────────────────────────────────────
function addToCalendar() {
  const upcoming = [...webinarMap.values()].find(wb => new Date(wb.date_time) >= new Date())
  if (!upcoming) { toast.info('No upcoming webinars to add.'); return }
  const s   = new Date(upcoming.date_time)
  const e   = new Date(s.getTime() + (upcoming.duration || 7200) * 1000)
  const fmt = d => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//IGGAARL//Webinar//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(s)}`, `DTEND:${fmt(e)}`,
    `SUMMARY:${upcoming.title}`,
    `DESCRIPTION:${(upcoming.key_learnings || '').replace(/\n/g, '\\n')}`,
    upcoming.link ? `URL:${upcoming.link}` : '',
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }))
  a.download = 'webinar.ics'
  a.click()
  URL.revokeObjectURL(a.href)
}

// ── Video helpers ─────────────────────────────────────────────────────────
function buildAutoplayUrl(url) {
  if (!url) return null
  const ytMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0&modestbranding=1`
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
  const driveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([A-Za-z0-9_-]+)/)
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`
  return null
}

function isDriveUrl(url) {
  return !!(url && url.includes('drive.google.com'))
}

function getVideoUrl(wb) {
  return buildAutoplayUrl(wb.webinar_video || wb.video_url || '')
}

const hoveredCard = ref(null)
const videoPopup  = ref({ show: false, title: '', src: '' })

// ── Calendar ──────────────────────────────────────────────────────────────
const calendarEl      = ref(null)
const calendarLoading = ref(false)
let   calendarInstance = null

async function initCalendar() {
  calendarLoading.value = true
  try {
    const res    = await getCalendarEvents()
    const events = (res?.message?.all_events || []).map(ev => ({
      title:       ev.title,
      start:       (ev.start || '').replace(' ', 'T'),
      url:         ev.url || '',
      description: ev.description || '',
    }))

    await nextTick()
    if (!calendarEl.value || !window.FullCalendar) return

    calendarInstance = new window.FullCalendar.Calendar(calendarEl.value, {
      initialView: 'dayGridMonth',
      headerToolbar: {
        left:   'prev,next today',
        center: 'title',
        right:  'dayGridMonth,timeGridWeek,timeGridDay',
      },
      events,
      eventClick(info) {
        info.jsEvent.preventDefault()
        if (info.event.url) window.open(info.event.url, '_blank')
      },
      eventDidMount(info) {
        const today     = new Date(); today.setHours(0, 0, 0, 0)
        const eventDate = new Date(info.event.start); eventDate.setHours(0, 0, 0, 0)
        if (eventDate < today) {
          info.el.style.backgroundColor = '#d9534f'
          info.el.style.color = 'white'
        } else if (eventDate > today) {
          info.el.style.backgroundColor = '#5cb85c'
          info.el.style.color = 'white'
        } else {
          info.el.style.backgroundColor = '#0275d8'
          info.el.style.color = 'white'
        }
        if (window.tippy) {
          window.tippy(info.el, {
            content:   info.event.title + (info.event.extendedProps.description ? '<br>' + info.event.extendedProps.description : ''),
            allowHTML: true,
            theme:     'light',
            placement: 'top',
          })
        }
      },
    })
    calendarInstance.render()
  } catch (e) {
    console.error('initCalendar:', e)
  } finally {
    calendarLoading.value = false
  }
}

function onCardEnter(wb) {
  if (!getVideoUrl(wb)) return
  hoveredCard.value = wb.name
}

function onCardLeave(wb) {
  if (hoveredCard.value === wb.name) hoveredCard.value = null
}

function openVideoPopup(title, src) {
  videoPopup.value = { show: true, title, src }
}

function closeVideoPopup() {
  videoPopup.value = { show: false, title: '', src: '' }
}

// ── Seat fill percentage ──────────────────────────────────────────────────
function seatPct(wb) {
  const spots  = wb.maximum_no_of_participants
  const filled = wb.registration_count || 0
  if (!spots || spots === 'Unlimited') return null
  return Math.min(100, Math.round((filled / spots) * 100))
}

onMounted(() => {
  fetchUpcoming()
  fetchPast(1)
  initCalendar()
})
</script>

<template>
  <div>

    <!-- ══ HERO ═══════════════════════════════════════════════════════════ -->
    <section class="webinar-hero">
      <div class="container hero-inner">
        <div class="hero-label">
          <i class="bi bi-play-circle-fill"></i> WEBINARS
        </div>
        <h1>Webinars</h1>
        <p>Join live sessions with experts, gain valuable insights, and grow your agricultural knowledge from anywhere.</p>
      </div>
    </section>

    <!-- ══ UPCOMING WEBINARS ══════════════════════════════════════════════ -->
    <section class="upcoming-section">
      <div class="container">

        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="sec-icon"><i class="bi bi-calendar-event-fill"></i></div>
            <div>
              <h4 class="mb-0 fw-bold" style="color:#1a1a1a;">Upcoming Webinars</h4>
              <p class="mb-0 text-muted" style="font-size:.84rem;">Join us live and be part of the conversation.</p>
            </div>
          </div>
          <button class="btn btn-outline-success d-flex align-items-center gap-2"
            style="border-radius:8px; font-size:.85rem;" @click="addToCalendar">
            <i class="bi bi-calendar-plus"></i> Add to Calendar
          </button>
        </div>

        <!-- Skeleton -->
        <div v-if="upcomingLoading">
          <div class="wb-skeleton"></div>
          <div class="wb-skeleton"></div>
          <div class="wb-skeleton"></div>
        </div>

        <!-- Empty -->
        <div v-else-if="upcomingList.length === 0" class="text-center py-5 text-muted">
          <i class="bi bi-calendar-x" style="font-size:3rem;color:#ccc;"></i>
          <p class="mt-3">No upcoming webinars scheduled at the moment.<br>Check back soon!</p>
        </div>

        <!-- Cards -->
        <div v-else :class="{ 'upcoming-scrollable': !upcomingShowAll && upcomingList.length > 3 }">
          <div v-for="wb in upcomingList" :key="wb.name" class="webinar-card">

            <!-- Date block -->
            <div class="wb-date">
              <div class="wb-date-inner">
                <div class="day">{{ fmtDate(wb.date_time).day }}</div>
                <div class="mon">{{ fmtDate(wb.date_time).mon }}</div>
                <div class="yr">{{ fmtDate(wb.date_time).yr }}</div>
                <div class="wday">{{ fmtDate(wb.date_time).wday }}</div>
              </div>
            </div>

            <!-- Thumbnail -->
            <div class="wb-thumb"
              :style="!resolveImg(wb.webinar_img) ? { background: thumbGradient(wb.name) } : {}">
              <img v-if="resolveImg(wb.webinar_img)" :src="resolveImg(wb.webinar_img)" :alt="wb.title" />
              <i v-else class="bi bi-camera-video-fill"></i>
            </div>

            <!-- Content -->
            <div class="wb-content">
              <div class="wb-meta">
                <span class="live-badge"><span class="dot"></span>LIVE WEBINAR</span>
                <span class="wb-time"><i class="bi bi-clock"></i>{{ fmtTimeRange(wb.date_time, wb.duration) }}</span>
              </div>
              <h5>{{ wb.title }}</h5>
              <p class="wb-desc">{{ wb.key_learnings || '' }}</p>
              <div class="wb-speaker">
                <i class="bi bi-person-circle"></i>
                <div>
                  <span>{{ wb.speakers || 'Speaker TBA' }}</span>
                  <div v-if="wb.speaker_designation" class="wb-speaker-role">{{ wb.speaker_designation }}</div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="wb-actions">
              <button class="btn-reg" @click="openRegister(wb.name, wb.title)">
                Register Now <i class="bi bi-chevron-right"></i>
              </button>
              <button class="btn-view-det" @click="openDetails(wb.name)">
                View Details <i class="bi bi-chevron-right"></i>
              </button>
            </div>

          </div>
        </div>

        <!-- View All Upcoming -->
        <div v-if="upcomingShowAll" class="text-center mt-4">
          <button class="btn-outline-rounded" @click="loadAllUpcoming" :disabled="upcomingAllLoading">
            <span v-if="upcomingAllLoading" class="spinner-border spinner-border-sm me-1"></span>
            <template v-else>View All Upcoming Webinars <i class="bi bi-arrow-right"></i></template>
          </button>
        </div>

      </div>
    </section>

    <!-- ══ PAST WEBINARS ═════════════════════════════════════════════════ -->
    <section class="py-5" style="background:#f7f9f7;">
      <div class="container">

        <div class="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
          <div class="d-flex align-items-center gap-3">
            <div class="sec-icon"><i class="bi bi-play-circle-fill"></i></div>
            <div>
              <h4 class="mb-0 fw-bold" style="color:#1a1a1a;">Past Webinars</h4>
              <p class="mb-0 text-muted" style="font-size:.84rem;">Watch recordings of our previous webinars.</p>
            </div>
          </div>
          <div class="d-flex gap-2 flex-wrap align-items-center">
            <div class="input-group" style="width:200px;">
              <span class="input-group-text bg-white border-end-0" style="border-radius:8px 0 0 8px;">
                <i class="bi bi-search text-muted" style="font-size:.85rem;"></i>
              </span>
              <input type="search" class="form-control border-start-0" v-model="pastSearch"
                placeholder="Search webinars..." style="border-radius:0 8px 8px 0; font-size:.85rem;">
            </div>
            <select class="form-select" v-model="pastTopic"
              style="width:auto; font-size:.85rem; border-radius:8px; border-color:#dee2e6; color:#555;">
              <option value="">Filter by Topic</option>
              <option v-for="t in pastAllTopics" :key="t" :value="t.toLowerCase()">{{ t }}</option>
            </select>
          </div>
        </div>

        <!-- Skeleton -->
        <div v-if="pastLoading" class="row g-4">
          <div class="col-sm-6 col-lg-3" v-for="i in 4" :key="i">
            <div class="wb-skeleton" style="height:220px;"></div>
          </div>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredPast.length === 0" class="row g-4">
          <div class="col-12 text-center py-5 text-muted">
            <i class="bi bi-play-circle" style="font-size:3rem;color:#ccc;"></i>
            <p class="mt-3">No past webinar recordings available yet.</p>
          </div>
        </div>

        <!-- Cards -->
        <div v-else class="row g-4" id="past-list">
          <div v-for="wb in filteredPast" :key="wb.name" class="col-sm-6 col-lg-3">
            <div class="past-card"
              :class="{ 'no-video': !getVideoUrl(wb) }"
              role="button"
              @click="!getVideoUrl(wb) && openDetails(wb.name)"
              @mouseenter="onCardEnter(wb)"
              @mouseleave="onCardLeave(wb)">
              <div class="past-thumb">
                <!-- inline iframe on hover (non-Drive) -->
                <template v-if="hoveredCard === wb.name && getVideoUrl(wb) && !isDriveUrl(wb.webinar_video || wb.video_url || '')">
                  <iframe :src="getVideoUrl(wb)"
                    frameborder="0" allow="autoplay; encrypted-media; fullscreen"
                    allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;"></iframe>
                </template>
                <template v-else>
                  <img v-if="resolveImg(wb.webinar_img)"
                    :src="resolveImg(wb.webinar_img)" :alt="wb.title"
                    style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;" />
                  <div v-else class="thumb-bg" :style="{ background: thumbGradient(wb.name) }">
                    <i class="bi bi-camera-video-fill"></i>
                  </div>
                  <!-- play overlay only when there's a video -->
                  <div v-if="getVideoUrl(wb)" class="play-overlay">
                    <!-- <div class="play-circle">
                      <i class="bi bi-play-fill" style="margin-left:2px;"></i>
                    </div> -->
                  </div>
                  <!-- Drive "click to play" hint -->
                  <div v-if="isDriveUrl(wb.webinar_video || wb.video_url || '')"
                    class="drive-play-hint"
                    @click.stop="openVideoPopup(wb.title, getVideoUrl(wb))">
                    <i class="bi bi-play-circle-fill"></i>
                    <span>Click to play</span>
                  </div>
                  <div v-if="fmtShortDuration(wb.duration)" class="dur-badge">
                    {{ fmtShortDuration(wb.duration) }}
                  </div>
                </template>
                <!-- fullscreen btn -->
                <button v-if="getVideoUrl(wb)" class="fullscreen-btn"
                  @click.stop="openVideoPopup(wb.title, getVideoUrl(wb))">
                  <i class="bi bi-fullscreen"></i>
                </button>
              </div>
              <div class="past-info">
                <h6>{{ wb.title }}</h6>
                <div class="past-meta">
                  <span><i class="bi bi-calendar3 me-1"></i>{{ fmtDate(wb.date_time).full }}</span>
                  <span v-if="fmtViews(wb.view_count || wb.registration_count)">
                    <i class="bi bi-eye me-1"></i>{{ fmtViews(wb.view_count || wb.registration_count) }} Views
                  </span>
                </div>
                <div v-if="wb.topic || wb.theme || wb.category" class="mt-1">
                  <span class="topic-tag">{{ wb.topic || wb.theme || wb.category }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- View All Past -->
        <div v-if="showPastPagination" class="text-center mt-4">
          <button class="btn-outline-rounded" @click="loadAllPast" :disabled="pastViewAllLoading">
            <span v-if="pastViewAllLoading" class="spinner-border spinner-border-sm me-1"></span>
            <template v-else>View All Webinars <i class="bi bi-arrow-right"></i></template>
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="pastTotalPages > 1 && showPastPagination" class="mt-4">
          <nav aria-label="Webinar pagination">
            <ul class="pagination justify-content-center wb-pagination mb-0">
              <li class="page-item" :class="{ disabled: pastPage === 1 }">
                <button class="page-link" @click="fetchPast(pastPage - 1)">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li v-for="p in paginationPages" :key="p"
                class="page-item"
                :class="{ active: p === pastPage, disabled: p === '…' }">
                <button class="page-link" @click="typeof p === 'number' && fetchPast(p)">{{ p }}</button>
              </li>
              <li class="page-item" :class="{ disabled: pastPage === pastTotalPages }">
                <button class="page-link" @click="fetchPast(pastPage + 1)">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>

      </div>
    </section>

    <!-- ══ WEBINAR CALENDAR ═════════════════════════════════════════════ -->
    <section class="py-5" style="background:#fff;">
      <div class="container">
        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="sec-icon"><i class="bi bi-calendar3-fill"></i></div>
          <div>
            <h4 class="mb-0 fw-bold" style="color:#1a1a1a;">Webinar Calendar</h4>
            <p class="mb-0 text-muted" style="font-size:.84rem;">View all upcoming and past webinars at a glance.</p>
          </div>
        </div>

        <!-- Legend -->
        <div class="d-flex gap-3 flex-wrap mb-3" style="font-size:.8rem;">
          <span class="cal-legend cal-legend--green">Upcoming</span>
          <span class="cal-legend cal-legend--blue">Today</span>
          <span class="cal-legend cal-legend--red">Past</span>
        </div>

        <!-- Loading skeleton -->
        <div v-if="calendarLoading" class="wb-skeleton" style="height:480px;"></div>

        <!-- Calendar mount point -->
        <div v-show="!calendarLoading" ref="calendarEl" id="webinar-calendar"></div>
      </div>
    </section>

    <!-- ══ NEWSLETTER ════════════════════════════════════════════════════ -->
    <section class="newsletter-sec py-4">
      <div class="container">
        <div class="newsletter-card">
          <div class="d-flex align-items-center gap-3">
            <i class="bi bi-bell-fill fs-2" style="color:#2d6a4f; flex-shrink:0;"></i>
            <div>
              <h5 class="mb-1">Never miss an update!</h5>
              <p>Subscribe to our newsletter to get notified about upcoming webinars.</p>
            </div>
          </div>
          <button class="btn btn-success d-flex align-items-center gap-2"
            style="border-radius:8px; padding:10px 22px; font-size:.88rem; white-space:nowrap;"
            @click="openNewsletter">
            Subscribe Now <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- ══ DETAILS MODAL ══════════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="detailsModal" class="modal-backdrop-overlay" @click.self="closeDetails">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable" role="document">
          <div class="modal-content">
            <div class="modal-header border-0 pb-0">
              <button type="button" class="btn-close" @click="closeDetails"></button>
            </div>
            <div class="modal-body pt-1" v-if="selectedWebinar">
              <h4 class="fw-bold mb-3">{{ selectedWebinar.title }}</h4>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span class="live-badge"><span class="dot"></span>WEBINAR</span>
                <span class="text-muted" style="font-size:.85rem;">
                  <i class="bi bi-clock text-success me-1"></i>
                  {{ fmtTimeRange(selectedWebinar.date_time, selectedWebinar.duration) }}
                </span>
                <span class="text-muted" style="font-size:.85rem;">
                  <i class="bi bi-hourglass-split text-success me-1"></i>
                  {{ fmtDuration(selectedWebinar.duration) || '—' }}
                </span>
              </div>
              <div class="rounded-3 p-3 mb-3" style="background:#f0faf3;border:1px solid #c8e6c9;">
                <div class="text-uppercase fw-bold mb-2" style="font-size:.72rem;letter-spacing:.5px;color:#2d6a4f;">Speaker</div>
                <div class="d-flex align-items-center gap-2">
                  <i class="bi bi-person-circle" style="font-size:1.6rem;color:#2d6a4f;"></i>
                  <span class="fw-semibold">{{ selectedWebinar.speakers || 'TBA' }}</span>
                </div>
              </div>
              <div class="mb-3">
                <div class="text-uppercase fw-bold mb-2" style="font-size:.72rem;letter-spacing:.5px;color:#555;">Key Learnings</div>
                <p style="color:#444;font-size:.92rem;line-height:1.6;">{{ selectedWebinar.key_learnings || 'Details will be shared soon.' }}</p>
              </div>
              <div class="d-flex gap-4 text-muted mb-2" style="font-size:.84rem;flex-wrap:wrap;">
                <span><i class="bi bi-people me-1 text-success"></i>Max seats: <strong class="text-dark">{{ selectedWebinar.maximum_no_of_participants || 'Unlimited' }}</strong></span>
                <span><i class="bi bi-person-check me-1 text-success"></i>Registered: <strong class="text-dark">{{ selectedWebinar.registration_count || 0 }}</strong></span>
              </div>
              <div v-if="seatPct(selectedWebinar) !== null" class="mb-3">
                <div class="d-flex justify-content-between mb-1" style="font-size:.78rem;color:#666;">
                  <span>Seats filled</span><span>{{ seatPct(selectedWebinar) }}%</span>
                </div>
                <div class="progress" style="height:6px;border-radius:4px;">
                  <div class="progress-bar bg-success" :style="{ width: seatPct(selectedWebinar) + '%' }"></div>
                </div>
              </div>
              <div v-if="selectedWebinar.link" class="mt-2">
                <a :href="selectedWebinar.link" target="_blank" class="text-success text-decoration-none" style="font-size:.85rem;">
                  <i class="bi bi-link-45deg"></i> Join Link
                </a>
              </div>
            </div>
            <div class="modal-footer border-0">
              <button class="btn btn-light" @click="closeDetails">Close</button>
              <button class="btn btn-success d-flex align-items-center gap-2"
                @click="openRegister(selectedWebinar?.name, selectedWebinar?.title)">
                <i class="bi bi-pencil-square"></i> Register Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══ REGISTRATION MODAL ════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="registerModal" class="modal-backdrop-overlay" @click.self="closeRegister">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" style="max-width:520px;" role="document">
          <div class="modal-content">
            <div class="modal-header border-0 pb-0">
              <div>
                <h5 class="modal-title fw-bold mb-0">Register Now</h5>
                <p class="text-muted mb-0" style="font-size:.82rem;">{{ selectedWebinar?.title }}</p>
              </div>
              <button type="button" class="btn-close" @click="closeRegister"></button>
            </div>
            <div class="modal-body">
              <div class="row g-3 mb-3">
                <div class="col-6">
                  <label class="form-label fw-semibold" style="font-size:.85rem;">First Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control form-control-sm" :class="{ 'is-invalid': regErrors.fname }"
                    v-model="regForm.fname" placeholder="First name" @input="delete regErrors.fname">
                </div>
                <div class="col-6">
                  <label class="form-label fw-semibold" style="font-size:.85rem;">Last Name <span class="text-danger">*</span></label>
                  <input type="text" class="form-control form-control-sm" :class="{ 'is-invalid': regErrors.lname }"
                    v-model="regForm.lname" placeholder="Last name" @input="delete regErrors.lname">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size:.85rem;">Organization <span class="text-danger">*</span></label>
                <input type="text" class="form-control form-control-sm" :class="{ 'is-invalid': regErrors.org }"
                  v-model="regForm.org" placeholder="Your organization" @input="delete regErrors.org">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size:.85rem;">Role <span class="text-danger">*</span></label>
                <input type="text" class="form-control form-control-sm" :class="{ 'is-invalid': regErrors.role }"
                  v-model="regForm.role" placeholder="e.g. Farmer, Researcher, Student" @input="delete regErrors.role">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size:.85rem;">Email Address <span class="text-danger">*</span></label>
                <input type="email" class="form-control form-control-sm" :class="{ 'is-invalid': regErrors.email }"
                  v-model="regForm.email" placeholder="you@example.com" @input="delete regErrors.email">
              </div>
              <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size:.85rem;">Phone Number <span class="text-danger">*</span></label>
                <input type="tel" class="form-control form-control-sm" :class="{ 'is-invalid': regErrors.phone }"
                  v-model="regForm.phone" placeholder="+91 00000 00000" @input="delete regErrors.phone">
              </div>
              <div class="mb-1">
                <label class="form-label fw-semibold" style="font-size:.85rem;">What interests you about this webinar?</label>
                <textarea class="form-control form-control-sm" v-model="regForm.interests" rows="3"
                  placeholder="Share what you hope to learn…"></textarea>
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button class="btn btn-light" @click="closeRegister">Cancel</button>
              <button class="btn btn-success d-flex align-items-center gap-2"
                @click="submitReg" :disabled="regSubmitting">
                <span v-if="regSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                <template v-else><i class="bi bi-check-circle"></i></template>
                Reserve My Seat
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ══ VIDEO POPUP (floating, Drive videos) ═════════════════════════ -->
    <Teleport to="body">
      <div v-if="videoPopup.show" id="video-popup">
        <div class="vp-header">
          <span class="vp-title">{{ videoPopup.title }}</span>
          <div class="vp-controls">
            <button class="vp-btn" title="Close" @click="closeVideoPopup">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>
        <div class="vp-body">
          <iframe :src="videoPopup.src"
            frameborder="0" allow="autoplay; encrypted-media; fullscreen"
            allowfullscreen style="width:100%;height:100%;display:block;"></iframe>
        </div>
      </div>
    </Teleport>

    <!-- ══ NEWSLETTER MODAL ══════════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="newsletterModal" class="modal-backdrop-overlay" @click.self="closeNewsletter">
        <div class="modal-dialog modal-dialog-centered" style="max-width:440px;" role="document">
          <div class="modal-content">
            <div class="modal-header border-0">
              <h5 class="modal-title fw-bold">Subscribe to Newsletter</h5>
              <button type="button" class="btn-close" @click="closeNewsletter"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label fw-semibold" style="font-size:.9rem;">Full Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="nlForm.name" placeholder="Your full name">
              </div>
              <div class="mb-2">
                <label class="form-label fw-semibold" style="font-size:.9rem;">Email Address <span class="text-danger">*</span></label>
                <input type="email" class="form-control" v-model="nlForm.email" placeholder="you@example.com">
              </div>
            </div>
            <div class="modal-footer border-0 pt-0">
              <button class="btn btn-light" @click="closeNewsletter">Cancel</button>
              <button class="btn btn-success" @click="submitNewsletter">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
/* ─── Hero ─────────────────────────────────────────────────────── */
.webinar-hero {
  position: relative;
  min-height: 360px;
  display: flex;
  align-items: center;
  background: url('/img/webinar_hero.png') center / cover no-repeat;
  padding-top: 80px;
  padding-bottom: 110px;
  overflow: visible;
}
.webinar-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,.38);
  pointer-events: none;
}
.webinar-hero .hero-inner { position: relative; z-index: 1; padding: 40px 0 0; }
.hero-label {
  display: inline-flex; align-items: center; gap: 7px;
  color: rgba(255,255,255,.85); font-size: 12px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px;
}
.webinar-hero h1 { color: #fff; font-size: 2.8rem; font-weight: 700; margin-bottom: 12px; line-height: 1.15; }
.webinar-hero p  { color: rgba(255,255,255,.88); font-size: .97rem; max-width: 480px; line-height: 1.7; }

/* ─── Upcoming section: overlaps hero ───────────────────────────── */
.upcoming-section {
  position: relative; z-index: 2;
  width: 85%; margin: -52px auto 0;
  background: #fff; border-radius: 16px;
  padding: 36px 32px 40px;
  box-shadow: 0 4px 32px rgba(0,0,0,.10);
}

/* ─── Section icon chip ──────────────────────────────────────────── */
.sec-icon {
  width: 46px; height: 46px; background: #e8f5e9; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #2d6a4f; font-size: 1.25rem; flex-shrink: 0;
}

/* ─── Upcoming Webinar Card ──────────────────────────────────────── */
.webinar-card {
  background: #fff; border: 1px solid #eef2ee; border-radius: 12px;
  padding: 18px 20px; display: flex; align-items: center;
  gap: 16px; margin-bottom: 12px; transition: box-shadow .2s, border-color .2s;
}
.webinar-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.08); border-color: #c8e6c9; }

.wb-date { text-align: center; min-width: 58px; flex-shrink: 0; }
.wb-date .day  { font-size: 2.1rem; font-weight: 800; color: #2d6a4f; line-height: 1; }
.wb-date .mon  { font-size: .75rem; font-weight: 700; color: #2d6a4f; text-transform: uppercase; letter-spacing: .5px; }
.wb-date .yr   { font-size: .72rem; color: #aaa; margin-top: 2px; }
.wb-date .wday {
  display: inline-block; background: #2d6a4f; color: #fff;
  font-size: .63rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;
  text-transform: uppercase; margin-top: 5px; letter-spacing: .5px;
}

.wb-thumb {
  width: 120px; height: 96px; border-radius: 10px; flex-shrink: 0;
  overflow: hidden; display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,.7); font-size: 2rem;
}
.wb-thumb img { width: 100%; height: 100%; object-fit: cover; }

.wb-content { flex: 1; min-width: 0; }
.wb-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 7px; }

.live-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: #e8f5e9; color: #2d6a4f; border: 1px solid #a5d6a7;
  border-radius: 20px; font-size: .7rem; font-weight: 700; padding: 2px 10px;
}
.live-badge .dot {
  width: 7px; height: 7px; background: #43a047; border-radius: 50%;
  animation: blink 1.4s ease-in-out infinite;
}
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }

.wb-time { font-size: .8rem; color: #555; display: flex; align-items: center; gap: 4px; }
.wb-time i { color: #2d6a4f; }
.wb-content h5 { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin: 0 0 5px; }
.wb-content .wb-desc {
  font-size: .83rem; color: #666; margin-bottom: 10px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.wb-speaker { display: flex; align-items: center; gap: 6px; font-size: .82rem; color: #444; }
.wb-speaker i { color: #2d6a4f; font-size: 1.1rem; }
.wb-speaker-role { font-size: .75rem; color: #888; }

.wb-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 8px; flex-shrink: 0; }
.btn-reg {
  display: inline-flex; align-items: center; gap: 5px;
  border: 1.5px solid #2d6a4f; color: #2d6a4f; background: #fff;
  border-radius: 7px; padding: 7px 16px; font-size: .84rem; font-weight: 600;
  text-decoration: none; white-space: nowrap; transition: background .18s, color .18s; cursor: pointer;
}
.btn-reg:hover { background: #2d6a4f; color: #fff; }
.btn-view-det {
  background: none; border: none; cursor: pointer;
  display: inline-flex; align-items: center; gap: 4px;
  color: #2d6a4f; font-size: .8rem; font-weight: 500;
  padding: 0; transition: color .15s;
}
.btn-view-det:hover { color: #1a4028; text-decoration: underline; }

/* ─── Skeleton ───────────────────────────────────────────────────── */
.wb-skeleton {
  height: 130px; border-radius: 12px; margin-bottom: 14px;
  background: linear-gradient(90deg,#f2f2f2 25%,#e8e8e8 50%,#f2f2f2 75%);
  background-size: 400% 100%; animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:-100% 0} }

/* ─── View-All btn ───────────────────────────────────────────────── */
.btn-outline-rounded {
  border: 1.5px solid #2d6a4f; color: #2d6a4f; border-radius: 24px;
  padding: 9px 28px; font-size: .88rem; font-weight: 600;
  display: inline-flex; align-items: center; gap: 6px;
  background: transparent; cursor: pointer; transition: background .18s, color .18s;
}
.btn-outline-rounded:hover:not(:disabled) { background: #2d6a4f; color: #fff; }
.btn-outline-rounded:disabled { opacity: .6; cursor: not-allowed; }

/* ─── Scrollable upcoming ────────────────────────────────────────── */
.upcoming-scrollable {
  max-height: 420px; overflow-y: auto; padding-right: 6px; scroll-behavior: smooth;
}
.upcoming-scrollable::-webkit-scrollbar { width: 5px; }
.upcoming-scrollable::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 4px; }
.upcoming-scrollable::-webkit-scrollbar-thumb { background: #2d6a4f; border-radius: 4px; }

/* ─── Past Webinar Cards ─────────────────────────────────────────── */
#past-list .col-sm-6 { display: flex; }
.past-card {
  border-radius: 12px; overflow: hidden; background: #fff;
  border: 1px solid #e4e4e4; transition: box-shadow .2s;
  cursor: pointer; width: 100%; display: flex; flex-direction: column;
}
.past-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.1); }
.past-card.no-video { cursor: default; }
.past-card.no-video:hover { box-shadow: none; }

/* padding-top / height:0 trick for 16:9 */
.past-thumb {
  position: relative; width: 100%;
  height: 0; padding-top: 56.25%;
  overflow: hidden;
}
.past-thumb img,
.past-thumb .thumb-bg,
.past-thumb iframe {
  position: absolute; top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover; display: block; border: 0;
}
.thumb-bg {
  display: flex; align-items: center;
  justify-content: center; color: rgba(255,255,255,.6); font-size: 2.5rem;
}
.play-overlay {
  position: absolute; inset: 0;
  display: flex; align-items: center;
  justify-content: center; background: rgba(0,0,0,.12); transition: background .2s;
}
.past-card:hover .play-overlay { background: rgba(0,0,0,.22); }
.play-circle {
  width: 46px; height: 46px; background: rgba(255,255,255,.9); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: #2d6a4f; font-size: 1.2rem; backdrop-filter: blur(4px); transition: transform .2s;
}
.past-card:hover .play-circle { transform: scale(1.08); }
.dur-badge {
  position: absolute; bottom: 8px; left: 8px;
  background: rgba(0,0,0,.72); color: #fff;
  font-size: .7rem; font-weight: 600; padding: 2px 7px; border-radius: 4px;
}

/* Drive "click to play" hint */
.drive-play-hint {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 6px;
  background: rgba(0,0,0,.45); color: #fff;
  cursor: pointer; transition: background .2s;
}
.drive-play-hint i { font-size: 2.2rem; }
.drive-play-hint span { font-size: .78rem; font-weight: 600; letter-spacing: .5px; }
.drive-play-hint:hover { background: rgba(0,0,0,.6); }

/* Fullscreen button — shown on card hover */
.fullscreen-btn {
  position: absolute; top: 8px; right: 8px;
  background: rgba(0,0,0,.65); color: #fff;
  border: none; border-radius: 5px;
  padding: 4px 8px; font-size: .78rem;
  cursor: pointer; z-index: 10;
  display: none; align-items: center; gap: 4px;
  transition: background .15s;
}
.past-card:hover .fullscreen-btn { display: flex; }
.fullscreen-btn:hover { background: rgba(0,0,0,.9); }
.past-info { padding: 12px 14px; flex: 1; }
.past-info h6 { font-size: .9rem; font-weight: 700; color: #1a1a1a; margin-bottom: 5px; line-height: 1.4; }
.past-meta { display: flex; align-items: center; gap: 10px; font-size: .74rem; color: #999; margin-bottom: 8px; }
.topic-tag {
  display: inline-block; background: #e8f5e9; color: #2d6a4f;
  font-size: .67rem; font-weight: 700; padding: 2px 8px; border-radius: 4px;
  text-transform: uppercase; letter-spacing: .5px;
}

/* ─── Newsletter ─────────────────────────────────────────────────── */
.newsletter-sec { background: #f7f9f7; }
.newsletter-card {
  background: #fff; border-radius: 12px; border: 1px solid #e0e0e0;
  padding: 24px 32px; display: flex; align-items: center;
  justify-content: space-between; gap: 20px;
}
.newsletter-card h5 { font-weight: 700; margin-bottom: 3px; color: #1a1a1a; }
.newsletter-card p  { font-size: .84rem; color: #666; margin: 0; }

/* ─── Pagination ─────────────────────────────────────────────────── */
.wb-pagination .page-link { color: #2d6a4f; border-color: #d0e8da; font-size: .84rem; }
.wb-pagination .page-item.active .page-link { background: #2d6a4f; border-color: #2d6a4f; color: #fff; }
.wb-pagination .page-link:hover { background: #e8f5e9; color: #1a4028; }
.wb-pagination .page-item.disabled .page-link { color: #bbb; }

/* ─── Modal overlay ──────────────────────────────────────────────── */
.modal-backdrop-overlay {
  position: fixed; inset: 0; z-index: 1055;
  background: rgba(0,0,0,.5);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}
.modal-backdrop-overlay .modal-dialog { margin: auto; width: 100%; }
.modal-backdrop-overlay .modal-content {
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 40px rgba(0,0,0,.2);
}
.modal-backdrop-overlay .modal-header { padding: 16px 20px 8px; }
.modal-backdrop-overlay .modal-body   { padding: 8px 20px 12px; }
.modal-backdrop-overlay .modal-footer { padding: 8px 20px 16px; }

/* ─── Floating Video Popup ───────────────────────────────────────── */
#video-popup {
  position: fixed; bottom: 24px; right: 24px; z-index: 9999;
  width: 360px; background: #1a1a1a; border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0,0,0,.55); overflow: hidden;
}
.vp-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 8px 12px; background: #111; gap: 8px;
}
.vp-title {
  font-size: .8rem; color: #ddd; font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;
}
.vp-controls { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.vp-btn {
  background: none; border: none; color: #aaa; cursor: pointer;
  padding: 2px 6px; border-radius: 4px; font-size: .85rem; line-height: 1.4;
  transition: color .15s, background .15s;
}
.vp-btn:hover { color: #fff; background: rgba(255,255,255,.1); }
.vp-body { height: 203px; } /* 360 × 9/16 = 202.5 */

/* ─── Calendar ───────────────────────────────────────────────────── */
#webinar-calendar {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e4e4e4;
  padding: 16px;
}
.cal-legend {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 3px 12px; border-radius: 20px;
  font-weight: 600; font-size: .76rem;
}
.cal-legend::before {
  content: ''; width: 10px; height: 10px; border-radius: 50%;
}
.cal-legend--green { background: #e8f5e9; color: #2d6a4f; }
.cal-legend--green::before { background: #5cb85c; }
.cal-legend--blue  { background: #e3f2fd; color: #1565c0; }
.cal-legend--blue::before  { background: #0275d8; }
.cal-legend--red   { background: #fce8e6; color: #b71c1c; }
.cal-legend--red::before   { background: #d9534f; }

/* ─── Responsive ─────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .webinar-hero { padding-bottom: 80px; }
  .upcoming-section { width: 95%; margin-top: -48px; border-radius: 12px; padding: 24px 16px 28px; }
  .webinar-hero h1 { font-size: 2rem; }
  .webinar-card { flex-wrap: wrap; gap: 12px; padding: 16px; }
  .wb-date { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; min-width: 54px; }
  .wb-thumb { flex: 1; height: 100px; min-width: 0; width: auto; }
  .wb-content { width: 100%; flex-basis: 100%; }
  .wb-actions { flex-direction: row; width: 100%; flex-basis: 100%; justify-content: flex-end; align-items: center; }
  .newsletter-card { flex-direction: column; text-align: center; }
}
@media (max-width: 480px) {
  .upcoming-section { width: 96%; margin-top: -32px; padding: 20px 12px 24px; }
  .wb-date .day { font-size: 1.8rem; }
  .wb-thumb { height: 80px; }
  .webinar-hero .hero-inner { padding: 40px 10px 0; }
}
</style>
