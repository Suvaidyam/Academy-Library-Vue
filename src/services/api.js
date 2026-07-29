const BASE_URL = 'https://erp-ryss.ap.gov.in/api/method'

async function request(endpoint, params = {}) {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function getCarouselImages() {
  return request('get_carousel_img')
}

export async function getNewsList(page = 1, pageLength = 3) {
  return request('get_news_list', { page, page_length: pageLength })
}

export async function getEventsList(page = 1, pageLength = 6) {
  return request('get_events_list', { page, page_length: pageLength })
}

export async function getAnnouncementList() {
  return request('get_announcement_list')
}

export async function getPodcastList(page = 1, pageLength = 6) {
  return request('get_podcast_data', { page, page_length: pageLength })
}

export async function getWebinarList(page = 1, pageLength = 6) {
  return request('get_webinar_list', { page, page_length: pageLength })
}

export async function getWebinarsByType(type, page = 1, pageSize = 8) {
  return request('get_webinar_list', { type, page, page_size: pageSize })
}

export async function registerForWebinar(webinarId, userData) {
  const url = new URL(`${BASE_URL}/webinar_registration`)
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ webinarId, userData: JSON.stringify(userData) }),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function getGalleryData(page = 1, pageLength = 12) {
  return request('get_gallery_data', { page, page_length: pageLength })
}

export async function getBookList(params = {}) {
  return request('get_book_list', params)
}

export async function getCourses(courseType = '') {
  return request('get_all_courses', { course_type: courseType })
}

export async function getPodcastDetails(id) {
  return request('get_podcast_details', { id })
}

export async function getKnowledgeArtifacts(params = {}) {
  return request('get_knowledge_artificates', params)
}

// Shared by the original Library filters (year, language and author).
export async function getDoctypeList(params = {}) {
  return request('get_doctype_list', params)
}

export async function getLibraryOptions(doctype, params = {}) {
  return request('get_all_course_list', { doctype, ...params })
}

export async function getLibrarySessions(params = {}) {
  return request('get_newsession_list', params)
}

export async function getEbooks(params = {}) {
  return request('get_ebooks_lists', params)
}

export async function getModuleDependentOptions(params = {}) {
  return request('get_module_dependent_options', params)
}

export async function getArticlesList(params = {}) {
  return request('get_articles_list', params)
}

export async function getAssessmentList(params = {}) {
  return request('get_assessment_list', params)
}

export async function getAllEvents(params = {}) {
  return request('get_all_events', params)
}

export async function getFieldMeta(params = {}) {
  return request('get_field_meta', params)
}

export async function getLinkField(params = {}) {
  return request('get_link_filed', params)
}

export async function getLanguageList() {
  return request('get_doctype_list', { doctype: 'Language', fields: JSON.stringify(['name', 'language_name']), filters: JSON.stringify([['enabled', '=', '1']]) })
}

export async function getCalendarEvents() {
  return request('get_calendar_events')
}

export async function getRTIData(page = 1, rowPerPage = 10) {
  return request('rti-data', { page, rowPerPage })
}

export async function getLearningResources(params = {}) {
  return request('get_learning_resource_data', params)
}
