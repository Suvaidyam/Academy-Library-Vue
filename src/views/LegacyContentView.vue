<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const page = computed(() => route.meta.page || {})
const title = computed(() => page.value.title || 'IGGAARL')
const intro = computed(() => page.value.intro || 'Explore resources and updates from the Indo-German Global Academy for Agroecology Research and Learning.')
const highlights = computed(() => page.value.highlights || ['Research and learning resources', 'Knowledge shared with our community', 'Get in touch for further information'])
</script>

<template>
  <div>
    <div class="page-title dark-background" style="padding:80px 0;">
      <div class="container position-relative">
        <h1>{{ title }}</h1>
        <p>{{ intro }}</p>
        <nav class="breadcrumbs"><ol><li><RouterLink to="/">Home</RouterLink></li><li class="current">{{ title }}</li></ol></nav>
      </div>
    </div>
    <section class="section light-background">
      <div class="container">
        <div class="row justify-content-center"><div class="col-lg-9">
          <div class="rounded-4 bg-white p-4 shadow-sm md:p-5">
            <h2 class="mb-3 text-2xl font-semibold text-slate-800">{{ title }}</h2>
            <p class="lead text-slate-600">{{ intro }}</p>
            <div class="row g-3 mt-2">
              <div v-for="item in highlights" :key="item" class="col-md-4"><div class="h-100 rounded-3 border border-slate-100 p-3"><i class="bi bi-check-circle-fill text-success me-2"></i>{{ item }}</div></div>
            </div>
            <RouterLink to="/" class="btn btn-success mt-4">Return to home</RouterLink>
          </div>
        </div></div>
      </div>
    </section>
  </div>
</template>
