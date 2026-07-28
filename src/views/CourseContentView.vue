<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const selectedCourse = ref('')
const selectedModule = ref('')
const selectedTopic = ref('')
const selectedChapter = ref('')
const selectedSession = ref('')
const fileTypes = ref({ pdf: false, video: false, audio: false, document: false })

const courses = ['Course 1', 'Course 2', 'Course 3']
const modules = ['Module 1', 'Module 2', 'Module 3']
const topics = ['Topic 1', 'Topic 2', 'Topic 3']
const chapters = ['Chapter 1', 'Chapter 2', 'Chapter 3']
const sessions = ['Session 1', 'Session 2', 'Session 3']

function handleSearch() {
  // Search functionality placeholder
}
</script>

<template>
  <div>
    <div class="page-title dark-background" style="padding: 80px 0;">
      <div class="container position-relative">
        <h1>Course Content</h1>
        <nav class="breadcrumbs">
          <ol>
            <li><RouterLink to="/">Home</RouterLink></li>
            <li><RouterLink to="/library">Library</RouterLink></li>
            <li class="current">Course Content</li>
          </ol>
        </nav>
      </div>
    </div>

    <section id="service-details" class="service-details section">
      <div class="container">
        <div class="row gy-5">
          <!-- Main Search Area -->
          <div class="col-lg-8" data-aos="fade-up" data-aos-delay="100">
            <div class="service-box">
              <form @submit.prevent="handleSearch">
                <div class="row mb-3">
                  <div class="col-sm-12">
                    <select class="form-select" v-model="selectedCourse">
                      <option value="" disabled selected>Select Course</option>
                      <option v-for="c in courses" :key="c" :value="c">{{ c }}</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-sm-12">
                    <select class="form-select" v-model="selectedModule">
                      <option value="" disabled selected>Select Module</option>
                      <option v-for="m in modules" :key="m" :value="m">{{ m }}</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-sm-12">
                    <select class="form-select" v-model="selectedTopic">
                      <option value="" disabled selected>Select Topic</option>
                      <option v-for="t in topics" :key="t" :value="t">{{ t }}</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-sm-12">
                    <select class="form-select" v-model="selectedChapter">
                      <option value="" disabled selected>Select Chapter</option>
                      <option v-for="ch in chapters" :key="ch" :value="ch">{{ ch }}</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-sm-12">
                    <select class="form-select" v-model="selectedSession">
                      <option value="" disabled selected>Select Session</option>
                      <option v-for="s in sessions" :key="s" :value="s">{{ s }}</option>
                    </select>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-sm-12">
                    <button type="submit" class="btn btn-success w-100">
                      <i class="bi bi-search me-1"></i> Search
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <div class="text-center py-5 text-muted">
              <i class="bi bi-collection-play fs-1"></i>
              <p class="mt-2">Select filters above to browse course content.</p>
            </div>
          </div>

          <!-- Sidebar File Type Filters -->
          <div class="col-lg-4" data-aos="fade-up" data-aos-delay="200">
            <div class="service-box">
              <h4>File Type</h4>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" v-model="fileTypes.pdf" id="ftPdf" />
                <label class="form-check-label" for="ftPdf"><i class="bi bi-file-pdf me-1"></i> PDF</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" v-model="fileTypes.video" id="ftVideo" />
                <label class="form-check-label" for="ftVideo"><i class="bi bi-camera-video me-1"></i> Video</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" v-model="fileTypes.audio" id="ftAudio" />
                <label class="form-check-label" for="ftAudio"><i class="bi bi-music-note me-1"></i> Audio</label>
              </div>
              <div class="form-check mb-2">
                <input class="form-check-input" type="checkbox" v-model="fileTypes.document" id="ftDoc" />
                <label class="form-check-label" for="ftDoc"><i class="bi bi-file-text me-1"></i> Document</label>
              </div>
            </div>

            <div class="help-box d-flex flex-column justify-content-center align-items-center">
              <i class="bi bi-envelope help-icon"></i>
              <h4>Have a Question?</h4>
              <p class="d-flex align-items-center mt-1 mb-0">
                <i class="bi bi-envelope me-2"></i>
                <a href="mailto:iggaarl@ryss.ap.gov.in">iggaarl@ryss.ap.gov.in</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
