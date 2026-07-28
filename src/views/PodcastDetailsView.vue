<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getPodcastDetails } from '../services/api'

const route = useRoute()
const API_BASE = 'https://erp-ryss.ap.gov.in'

const podcastData = ref(null)
const episodes = ref([])
const currentEpisodeIndex = ref(0)
const loading = ref(true)

const videoPlayer = ref(null)
const audioPlayer = ref(null)

const currentEpisode = computed(() => episodes.value[currentEpisodeIndex.value] || null)
const isVideo = computed(() => currentEpisode.value?.file_type === 'Video')

onMounted(() => loadPodcast())

async function loadPodcast() {
  loading.value = true
  try {
    const id = route.query.id
    const data = await getPodcastDetails(id)
    const msg = data?.message
    podcastData.value = msg || null
    episodes.value = msg?.episodes || []
    if (episodes.value.length > 0) {
      playEpisode(0)
    }
  } catch {
    podcastData.value = null
    episodes.value = []
  } finally {
    loading.value = false
  }
}

function getMediaUrl(path) {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE}${path}`
}

function getYoutubeThumbnail(url) {
  if (!url) return ''
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : ''
}

function playEpisode(index) {
  currentEpisodeIndex.value = index
  const ep = episodes.value[index]
  if (!ep) return

  if (ep.source === 'External') {
    window.open(ep.podcast_file, '_blank')
    return
  }

  const url = getMediaUrl(ep.podcast_file)
  if (ep.file_type === 'Video') {
    if (videoPlayer.value) {
      videoPlayer.value.src = url
      videoPlayer.value.load()
    }
  } else {
    if (audioPlayer.value) {
      audioPlayer.value.src = url
      audioPlayer.value.load()
    }
  }
}
</script>

<template>
  <div>
    <div v-if="loading" class="text-center py-5 mt-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <section v-else id="about" class="section about">
      <div class="container">
        <h4 id="episode_title">{{ currentEpisode?.title || '' }}</h4>
        <div class="row g-4 align-items-center justify-content-center">
          <div class="col-md-7 col-lg-7 col-xl-7" data-aos="fade-up">
            <div class="d-flex justify-content-center align-items-center">
              <video
                v-if="isVideo"
                ref="videoPlayer"
                id="video_player"
                width="100%"
                controls
              >
                Your browser does not support HTML video.
              </video>
              <audio
                v-else
                ref="audioPlayer"
                id="audio_player"
                class="w-100"
                controls
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>

          <div class="col-md-5 col-lg-5 col-xl-5" data-aos="fade-up" data-aos-delay="200">
            <h3 id="show_title">{{ podcastData?.title || 'Podcast' }}</h3>
            <div class="list-group" id="episode_list" style="max-height: 340px; overflow-y: auto;">
              <a
                v-for="(ep, idx) in episodes"
                :key="idx"
                href="#"
                class="list-group-item list-group-item-action episode-item"
                :class="{ active: idx === currentEpisodeIndex }"
                @click.prevent="playEpisode(idx)"
              >
                <div class="d-flex align-items-center gap-2">
                  <img
                    v-if="ep.source === 'External' && getYoutubeThumbnail(ep.podcast_file)"
                    :src="getYoutubeThumbnail(ep.podcast_file)"
                    width="60"
                    height="40"
                    style="object-fit: cover; flex-shrink: 0;"
                    :alt="ep.title"
                  />
                  <i
                    v-else-if="ep.file_type === 'Audio'"
                    class="bi bi-music-note-beamed fs-3 flex-shrink-0"
                  ></i>
                  <i
                    v-else
                    class="bi bi-play-circle fs-3 flex-shrink-0"
                  ></i>
                  <div class="overflow-hidden">
                    <div class="small fw-semibold text-truncate">{{ ep.title }}</div>
                    <div class="text-muted" style="font-size: 0.75rem;">
                      {{ ep.source === 'External' ? 'External Link' : ep.file_type }}
                    </div>
                  </div>
                </div>
              </a>
              <div v-if="episodes.length === 0" class="text-muted small p-2">No episodes available.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
