import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/HomeView.vue') },
  { path: '/login', name: 'Login', component: () => import('../views/LoginView.vue') },
  { path: '/about', name: 'About', component: () => import('../views/AboutView.vue') },
  { path: '/learning-library', name: 'LearningLibrary', component: () => import('../views/LearningLibraryView.vue') },
  { path: '/library', name: 'Library', component: () => import('../views/LibraryView.vue') },
  { path: '/research-library', name: 'ResearchLibrary', component: () => import('../views/ResearchLibraryView.vue') },
  { path: '/podcast', name: 'Podcast', component: () => import('../views/PodcastView.vue') },
  { path: '/webinar', name: 'Webinar', component: () => import('../views/WebinarView.vue') },
  { path: '/webinar-register', name: 'WebinarRegister', component: () => import('../views/WebinarRegisterView.vue') },
  { path: '/gallery', name: 'Gallery', component: () => import('../views/GalleryView.vue') },
  { path: '/calendar', name: 'Calendar', component: () => import('../views/CalendarView.vue') },
  { path: '/disclaimers', name: 'Disclaimers', component: () => import('../views/DisclaimersView.vue') },
  { path: '/terms-conditions', name: 'Terms', component: () => import('../views/TermsView.vue') },
  { path: '/news-events', redirect: { path: '/', hash: '#news' } },
  { path: '/news-details', name: 'NewsDetails', component: () => import('../views/NewsDetailsView.vue') },
  { path: '/podcast-details', name: 'PodcastDetails', component: () => import('../views/PodcastDetailsView.vue') },
  { path: '/global-library', name: 'GlobalLibrary', component: () => import('../views/GlobalLibraryView.vue') },
  { path: '/our-leaders', name: 'OurLeaders', component: () => import('../views/OurLeadersView.vue') },
  { path: '/reports', name: 'Reports', component: () => import('../views/ReportsView.vue') },
  { path: '/rti', name: 'RTI', component: () => import('../views/RTIView.vue') },
  { path: '/case-studies', name: 'CaseStudies', component: () => import('../views/CaseStudiesView.vue') },
  { path: '/success-stories', name: 'SuccessStories', component: () => import('../views/SuccessStoriesView.vue') },
  { path: '/case-details', name: 'CaseDetails', component: () => import('../views/CaseDetailsView.vue') },
  { path: '/success-details', name: 'SuccessDetails', component: () => import('../views/SuccessDetailsView.vue') },
  // Course Content is a Library tab in the source application.  Keeping a
  // dedicated URL makes old links work while rendering the same live view.
  { path: '/course-content', name: 'CourseContent', redirect: '/library?tab=course' },
  // Legacy source URLs are retained so existing links/bookmarks keep working.
  { path: '/pages/about.html', redirect: '/about' },
  { path: '/pages/about-research.html', redirect: '/about' },
  { path: '/pages/learning-library.html', redirect: '/learning-library' },
  { path: '/pages/library.html', redirect: '/library' },
  { path: '/pages/new_library.html', redirect: '/library' },
  { path: '/pages/research-library.html', redirect: '/research-library' },
  { path: '/pages/new_research-library.html', redirect: '/research-library' },
  { path: '/pages/podcast.html', redirect: '/podcast' },
  { path: '/pages/podcast-details.html', redirect: '/podcast-details' },
  { path: '/pages/webinar.html', redirect: '/webinar' },
  { path: '/pages/webinar-registration.html', redirect: '/webinar-register' },
  { path: '/pages/gallery.html', redirect: '/gallery' },
  { path: '/pages/new_gallery.html', redirect: '/gallery' },
  { path: '/pages/Calendar.html', redirect: '/calendar' },
  { path: '/pages/news-events.html', redirect: { path: '/', hash: '#news' } },
  { path: '/pages/events.html', redirect: { path: '/', hash: '#news' } },
  { path: '/pages/event-details.html', redirect: '/news-details' },
  { path: '/pages/news-details.html', redirect: '/news-details' },
  { path: '/pages/blog-details.html', redirect: '/news-details' },
  { path: '/pages/global-library.html', redirect: '/global-library' },
  { path: '/pages/global-library_bkp.html', redirect: '/global-library' },
  { path: '/pages/our-leaders.html', redirect: '/our-leaders' },
  { path: '/pages/reports.html', redirect: '/reports' },
  { path: '/pages/rti.html', redirect: '/rti' },
  { path: '/pages/case-studies.html', redirect: '/case-studies' },
  { path: '/pages/success-stories.html', redirect: '/success-stories' },
  { path: '/research_page/case-details.html', redirect: '/case-details' },
  { path: '/research_page/success-details.html', redirect: '/success-details' },
  { path: '/pages/library-courseContent.html', redirect: '/library?tab=course' },
  { path: '/pages/login.html', redirect: '/login' },
  { path: '/pages/signup.html', redirect: '/login' },
  { path: '/pages/disclaimers.html', redirect: '/disclaimers' },
  { path: '/pages/terms-conditions.html', redirect: '/terms-conditions' },
  { path: '/pages/Academic-Register.html', name: 'AcademicRegister', component: () => import('../views/AcademicRegisterView.vue') },
  { path: '/pages/assignment_bank.html', name: 'AssignmentBank', component: () => import('../views/LegacyContentView.vue'), meta: { page: { title: 'Assignment Bank', intro: 'Browse academic assignments and learning materials.' } } },
  { path: '/pages/question-library.html', name: 'QuestionLibrary', component: () => import('../views/LegacyContentView.vue'), meta: { page: { title: 'Question Library', intro: 'Practice questions and self-assessment resources.' } } },
  { path: '/pages/careers.html', name: 'Careers', component: () => import('../views/LegacyContentView.vue'), meta: { page: { title: 'Careers', intro: 'Opportunities to work and learn with IGGAARL.' } } },
  { path: '/pages/sports.html', name: 'Sports', component: () => import('../views/LegacyContentView.vue'), meta: { page: { title: 'Sports', intro: 'Sports and community activities at IGGAARL.' } } },
  { path: '/pages/team.html', name: 'Team', component: () => import('../views/LegacyContentView.vue'), meta: { page: { title: 'Our Team', intro: 'The people supporting IGGAARL research and learning.' } } },
  { path: '/pages/:leader(atchannaidu|cm|muralidhar|raidu|rajasekhar|rama-rao|varaprasad|vijay-kumar).html', redirect: '/our-leaders' },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'Login' }
  }
})

export default router
