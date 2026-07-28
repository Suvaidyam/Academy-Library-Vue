# Academy-Library → Vue 3 Conversion Documentation

## Project Overview

The **Academy-Library** is an educational portal for the Indo-German Global Academy for Agroecology Research and Learning (IGGAARL), operated by Rythu Sadhikara Samstha (RySS), Government of Andhra Pradesh. It serves as an LMS (Learning Management System) backed by a Frappe ERP system.

This document describes the conversion of the original vanilla JavaScript multi-page application (MPA) to a modern **Vue 3 Single Page Application (SPA)**.

---

## Tech Stack

### Original (`Academy-Library/`)
| Layer | Technology |
|-------|-----------|
| Framework | Vanilla JavaScript (ES6 modules) |
| CSS | Bootstrap 5.3.3 + Custom `main.css` |
| Icons | Bootstrap Icons + Font Awesome 4.7 |
| Animations | AOS (Animate on Scroll) |
| Carousels | Swiper.js |
| Lightbox | GLightbox |
| Gallery | Isotope Layout |
| Backend | Frappe ERP (`https://erp-ryss.ap.gov.in`) |
| Build | None (static files) |

### Vue App (`Academy-Library-vue/`)
| Layer | Technology |
|-------|-----------|
| Framework | Vue 3.5 (Composition API + `<script setup>`) |
| Router | Vue Router 4.6 |
| State | Pinia 4.0 |
| Build | Vite 8.1 |
| CSS | Bootstrap 5.3.8 + custom `main.css` |
| Icons | Bootstrap Icons 1.13 |
| Animations | AOS 2.3 |
| HTTP | fetch (native) |
| Notifications | vue3-toastify |
| Calendar | @fullcalendar/vue3 v6 + Tippy.js |

---

## Project Structure

```
Academy-Library-vue/
├── public/
│   └── img/                    # Static images (logos, team, blog, etc.)
├── src/
│   ├── main.js                 # App entry point (AOS init, Pinia, Router)
│   ├── App.vue                 # Root component (RouterView + layout)
│   ├── style.css               # Global styles (Google Fonts import)
│   ├── assets/
│   │   └── css/main.css        # Main stylesheet (Moderna theme, CSS vars)
│   ├── components/
│   │   └── layout/
│   │       ├── AppHeader.vue   # Fixed top navigation with dropdowns
│   │       └── AppFooter.vue   # Footer with links and social media
│   ├── router/
│   │   └── index.js            # Vue Router with 25 routes (lazy-loaded)
│   ├── services/
│   │   └── api.js              # All API functions (Frappe ERP)
│   ├── stores/
│   │   └── auth.js             # Pinia auth store (login/logout/session)
│   └── views/                  # 25 page-level components
│       ├── HomeView.vue
│       ├── LoginView.vue
│       ├── AboutView.vue
│       ├── LearningLibraryView.vue
│       ├── LibraryView.vue
│       ├── ResearchLibraryView.vue      ← enhanced with per-tab filters
│       ├── PodcastView.vue
│       ├── PodcastDetailsView.vue       ← NEW: video/audio player
│       ├── WebinarView.vue
│       ├── WebinarRegisterView.vue
│       ├── GalleryView.vue
│       ├── CalendarView.vue             ← enhanced: FullCalendar v6
│       ├── NewsEventsView.vue           ← NEW
│       ├── NewsDetailsView.vue          ← NEW
│       ├── GlobalLibraryView.vue        ← NEW: tabs + language filter
│       ├── OurLeadersView.vue           ← NEW: read-more toggle
│       ├── ReportsView.vue              ← NEW: Annual + Socio-Economic tabs
│       ├── RTIView.vue                  ← NEW: paginated RTI list
│       ├── CaseStudiesView.vue          ← NEW
│       ├── SuccessStoriesView.vue       ← NEW
│       ├── CaseDetailsView.vue          ← NEW: article + sidebar
│       ├── SuccessDetailsView.vue       ← NEW: article + sidebar
│       ├── CourseContentView.vue        ← NEW: cascading selects
│       ├── DisclaimersView.vue
│       ├── TermsView.vue
│       └── NotFoundView.vue
├── package.json
├── vite.config.js
└── CONVERSION_DOCS.md           ← this file
```

---

## Conversion Progress

| Original Page | Vue View | Status | Notes |
|---------------|----------|--------|-------|
| `index.html` | `HomeView.vue` | ✅ Done | Hero carousel, news, partners |
| `pages/login.html` | `LoginView.vue` | ✅ Done | Full auth with Pinia store |
| `pages/about.html` | `AboutView.vue` | ✅ Done | Static content |
| `pages/learning-library.html` | `LearningLibraryView.vue` | ✅ Done | Course tabs, filtering |
| `pages/library.html` | `LibraryView.vue` | ✅ Done | Books, search, pagination |
| `pages/research-library.html` | `ResearchLibraryView.vue` | ✅ Enhanced | Per-tab filters, card layouts, auth gate |
| `pages/podcast.html` | `PodcastView.vue` | ✅ Done | Podcast cards, pagination |
| `pages/podcast-details.html` | `PodcastDetailsView.vue` | ✅ Done | Video/audio player, episode list |
| `pages/webinar.html` | `WebinarView.vue` | ✅ Done | Webinar listings |
| `pages/webinar-registration.html` | `WebinarRegisterView.vue` | ✅ Done | Registration form |
| `pages/gallery.html` | `GalleryView.vue` | ✅ Done | Image gallery, pagination |
| `pages/Calendar.html` | `CalendarView.vue` | ✅ Enhanced | FullCalendar v6, color-coded events, tooltips |
| `pages/news-events.html` | `NewsEventsView.vue` | ✅ Done | News + Events sections, pagination |
| `pages/news-details.html` | `NewsDetailsView.vue` | ✅ Done | 8/4 layout, related news sidebar |
| `pages/global-library.html` | `GlobalLibraryView.vue` | ✅ Done | 3/9 layout, language filter, tabs |
| `pages/our-leaders.html` | `OurLeadersView.vue` | ✅ Done | Leader cards, read-more toggle |
| `pages/reports.html` | `ReportsView.vue` | ✅ Done | Bootstrap tabs, report cards |
| `pages/rti.html` | `RTIView.vue` | ✅ Done | Paginated RTI documents |
| `pages/case-studies.html` | `CaseStudiesView.vue` | ✅ Done | Card grid with filters |
| `pages/success-stories.html` | `SuccessStoriesView.vue` | ✅ Done | Card grid |
| `research_page/case-details.html` | `CaseDetailsView.vue` | ✅ Done | Article + sidebar |
| `research_page/success-details.html` | `SuccessDetailsView.vue` | ✅ Done | Article + sidebar |
| `pages/library-courseContent.html` | `CourseContentView.vue` | ✅ Done | Cascading selects |
| `pages/disclaimers.html` | `DisclaimersView.vue` | ✅ Done | Static |
| `pages/terms-conditions.html` | `TermsView.vue` | ✅ Done | Static |
| `pages/event-details.html` | — | ⏳ Pending | Not yet implemented |
| `pages/blog-details.html` | — | ⏳ Pending | Not yet implemented |
| `pages/team.html` | — | ⏳ Pending | Full team directory |
| `pages/careers.html` | — | ⏳ Pending | Career listings |
| `pages/sports.html` | — | ⏳ Pending | Sports page |
| `pages/question-library.html` | — | ⏳ Pending | Question bank |
| Individual leader pages | — | ℹ️ Merged | Content folded into OurLeadersView |

---

## API Endpoint Reference

**Base URL:** `https://erp-ryss.ap.gov.in/api/method/`

| Function | Endpoint | Used In |
|----------|----------|---------|
| `getCarouselImages()` | `get_carousel_img` | HomeView |
| `getNewsList(page, pageLength)` | `get_news_list` | HomeView, NewsEventsView, NewsDetailsView |
| `getEventsList(page, pageLength)` | `get_events_list` | HomeView, NewsEventsView |
| `getAnnouncementList()` | `get_announcement_list` | AppHeader |
| `getPodcastList(page, pageLength)` | `get_podcast_data` | PodcastView |
| `getPodcastDetails(id)` | `get_podcast_details` | PodcastDetailsView |
| `getWebinarList(page, pageLength)` | `get_webinar_list` | WebinarView |
| `getGalleryData(page, pageLength)` | `get_gallery_data` | GalleryView |
| `getBookList(params)` | `get_book_list` | LibraryView |
| `getCourses(courseType)` | `get_all_courses` | LearningLibraryView |
| `getKnowledgeArtifacts(params)` | `get_knowledge_artificates` | ResearchLibrary, GlobalLibrary, CaseStudies, Reports |
| `getLanguageList()` | `get_doctype_list` | GlobalLibraryView |
| `getCalendarEvents()` | `get_calendar_events` | CalendarView |
| `getRTIData(page, rowPerPage)` | `rti-data` | RTIView |

### Auth Endpoints (Frappe)
| Action | Endpoint | Method |
|--------|----------|--------|
| Login | `https://erp-ryss.ap.gov.in/api/method/login` | POST |
| Logout | (sessionStorage clear) | — |

---

## Component Patterns & Conventions

### Script Setup Pattern
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { someApiFunction } from '../services/api'

const items = ref([])
const loading = ref(true)
const page = ref(1)
const totalPages = ref(1)

onMounted(() => loadData(1))

async function loadData(p = 1) {
  loading.value = true
  try {
    const data = await someApiFunction(p)
    items.value = data?.message?.data || []
    totalPages.value = data?.message?.total_pages || 1
    page.value = p
  } catch {
    items.value = []
  } finally {
    loading.value = false
  }
}
</script>
```

### Image URL Pattern
```js
function getImageUrl(path) {
  if (!path) return '/img/fallback.jpg'
  if (path.startsWith('http')) return path
  return `https://erp-ryss.ap.gov.in${path}`
}
```

### Pagination Pattern (prev/next arrows)
```html
<div class="d-flex justify-content-between align-items-center mt-4">
  <button class="btn border-0 bg-transparent" :disabled="page <= 1" @click="loadData(page - 1)">
    <i class="bi bi-arrow-left-circle fs-1"></i>
  </button>
  <button class="btn border-0 bg-transparent" :disabled="page >= totalPages" @click="loadData(page + 1)">
    <i class="bi bi-arrow-right-circle fs-1"></i>
  </button>
</div>
```

### Auth Check Pattern
```js
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()

if (!authStore.isLoggedIn) {
  toast.warning('Please sign in to access this content.')
  router.push('/login')
}
```

---

## Key Design Patterns (Pixel-Perfect)

### Page Title Banner
All pages use a dark-background banner with title and breadcrumbs:
```html
<div class="page-title dark-background" style="padding: 80px 0;">
  <div class="container position-relative">
    <h1>Page Title</h1>
    <nav class="breadcrumbs">
      <ol>
        <li><RouterLink to="/">Home</RouterLink></li>
        <li class="current">Current Page</li>
      </ol>
    </nav>
  </div>
</div>
```

### News Card Layout (newsCard class)
```html
<div class="row newsCard">
  <div class="col-md-4"><!-- image --></div>
  <div class="col-md-8"><!-- title + description + date --></div>
</div>
```

### Event Card Layout (evDate class)
```html
<div class="service-item d-flex position-relative h-100">
  <div class="evDate">
    <i class="bi bi-calendar2-check icon flex-shrink-0"></i>
    <p>25 May <span>2024</span></p>
  </div>
  <div><!-- title + description --></div>
</div>
```

### Article Details Layout (8/4 columns)
```html
<div class="row">
  <div class="col-lg-8">
    <article class="article">
      <div class="post-img"><!-- main image --></div>
      <h2 class="title"><!-- title --></h2>
      <div class="meta-top"><!-- author, date --></div>
      <div class="content"><!-- body --></div>
    </article>
  </div>
  <div class="col-lg-4 sidebar">
    <div class="recent-posts-widget widget-item">
      <h3 class="widget-title">More Items</h3>
      <div class="post-item"><!-- thumbnail + title + date --></div>
    </div>
  </div>
</div>
```

---

## CSS Variables (from main.css)

```css
:root {
  --default-font: "Roboto", system-ui, -apple-system, sans-serif;
  --heading-font: "Raleway", sans-serif;
  --nav-font: "Poppins", sans-serif;
  --background-color: #ffffff;
  --default-color: #555555;
  --heading-color: #1e4356;
  --accent-color: #28a745;
  --surface-color: #ffffff;
  --contrast-color: #ffffff;
  --nav-color: #1e4356;
  --nav-hover-color: #28a745;
  --nav-mobile-background-color: #ffffff;
  --nav-dropdown-background-color: #ffffff;
  --nav-dropdown-color: #1e4356;
}
```

---

## Authentication

- **Store:** `src/stores/auth.js` (Pinia)
- **Storage:** `sessionStorage` — cleared on browser close
- **State:** `userInfo`, `isLoggedIn` (computed), `fullName`, `username`
- **Login:** POST to Frappe `/api/method/login` with `usr` + `pwd`
- **Auth Gate:** `router.beforeEach()` checks `to.meta.requiresAuth`
- **Research Library Gate:** Case Studies "Longitudinal Data" tab checks `authStore.isLoggedIn` inline

---

## Route List

| Route | View | Query Params |
|-------|------|-------------|
| `/` | HomeView | — |
| `/login` | LoginView | — |
| `/about` | AboutView | — |
| `/learning-library` | LearningLibraryView | `courseCategory` |
| `/library` | LibraryView | — |
| `/research-library` | ResearchLibraryView | — |
| `/podcast` | PodcastView | — |
| `/podcast-details` | PodcastDetailsView | `id` |
| `/webinar` | WebinarView | — |
| `/webinar-register` | WebinarRegisterView | `webinar_id` |
| `/gallery` | GalleryView | — |
| `/calendar` | CalendarView | — |
| `/news-events` | NewsEventsView | — |
| `/news-details` | NewsDetailsView | `id` |
| `/global-library` | GlobalLibraryView | — |
| `/our-leaders` | OurLeadersView | — |
| `/reports` | ReportsView | — |
| `/rti` | RTIView | — |
| `/case-studies` | CaseStudiesView | — |
| `/success-stories` | SuccessStoriesView | — |
| `/case-details` | CaseDetailsView | `id` |
| `/success-details` | SuccessDetailsView | `id` |
| `/course-content` | CourseContentView | — |
| `/disclaimers` | DisclaimersView | — |
| `/terms-conditions` | TermsView | — |
| `/:pathMatch(.*)` | NotFoundView | — |

---

## Remaining Work / Known Gaps

### Pages Not Yet Implemented
- `event-details.html` — Individual event detail view
- `blog-details.html` — Blog article detail view  
- `team.html` — Full team directory (different from leaders)
- `careers.html` — Career opportunities listing
- `sports.html` — Sports/athletics page
- `question-library.html` — Question bank

### Features That Need Polish
- **Language selector** in header — currently shows static options (English/Telugu/German), not functional
- **Enrolled courses tab** in LearningLibraryView — requires auth and real API data
- **Webinar registration confirmation** — currently no success page/email confirmation
- **Calendar** — Tippy tooltips need import validation across browsers
- **Course content cascading selects** — no real API data, placeholders only

### API Inconsistencies from Original
- `get_knowledge_artificates` — note the typo in the endpoint name (matches backend)
- `get_news_list` vs direct Frappe resource API (`/api/resource/News`) — Vue uses the custom endpoint
- News details uses `id` query param; original vanilla JS used both `name` and `id`

---

## Development Commands

```bash
cd Academy-Library-vue

# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

---

## Key Third-Party Libraries

| Library | Version | Purpose |
|---------|---------|---------|
| vue | 3.5.39 | Core framework |
| vue-router | 4.6.4 | Client-side routing |
| pinia | 4.0.2 | State management |
| vite | 8.1.1 | Build tool |
| bootstrap | 5.3.8 | CSS framework |
| bootstrap-icons | 1.13.1 | Icon font |
| aos | 2.3.4 | Scroll animations |
| vue3-toastify | 0.2.9 | Toast notifications |
| @fullcalendar/vue3 | 6.x | Calendar UI |
| @fullcalendar/daygrid | 6.x | Month view plugin |
| @fullcalendar/timegrid | 6.x | Week/Day view plugin |
| tippy.js | 6.x | Hover tooltips (calendar) |
| axios | 1.18.1 | HTTP client (installed, fetch used instead) |
