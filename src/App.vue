<script setup>
import AppHeader from './components/layout/AppHeader.vue'
import AppFooter from './components/layout/AppFooter.vue'
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const hideLayout = computed(() => route.name === 'Login')
</script>

<template>
  <div id="app-wrapper">
    <AppHeader v-if="!hideLayout" />
    <main :class="hideLayout ? '' : 'main-content'">
      <RouterView />
    </main>
    <AppFooter v-if="!hideLayout" />
    <a href="#" id="scroll-top" class="scroll-top d-flex align-items-center justify-content-center">
      <i class="bi bi-arrow-up-short"></i>
    </a>
  </div>
</template>

<style>
.main-content {
  margin-top: 92px;
}
#scroll-top {
  position: fixed;
  visibility: hidden;
  opacity: 0;
  right: 15px;
  bottom: 15px;
  z-index: 99999;
  background-color: var(--accent-color);
  width: 40px;
  height: 40px;
  border-radius: 4px;
  transition: all 0.4s;
  color: #fff;
  font-size: 24px;
}
#scroll-top.active {
  visibility: visible;
  opacity: 1;
}
</style>
