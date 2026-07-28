import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'aos/dist/aos.css'
import 'vue3-toastify/dist/index.css'
import './assets/css/main.css'
import './style.css'

import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import AOS from 'aos'
import Vue3Toastify from 'vue3-toastify'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'light',
})

AOS.init({ duration: 600, once: true })

app.mount('#app')
