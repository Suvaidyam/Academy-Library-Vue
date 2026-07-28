<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '' },
  size: { type: String, default: 'max-w-2xl' },
})
const emit = defineEmits(['close'])

function close() { emit('close') }
function onKeydown(event) { if (event.key === 'Escape' && props.open) close() }

watch(() => props.open, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100000] flex items-center justify-center p-4" role="dialog" aria-modal="true" :aria-label="title" @click.self="close">
      <div class="absolute inset-0 bg-slate-950/75 backdrop-blur-sm"></div>
      <section :class="['relative z-10 max-h-[90vh] w-full overflow-auto rounded-2xl bg-white shadow-2xl', size]">
        <header class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 class="m-0 text-xl font-semibold text-slate-800">{{ title }}</h2>
          <button class="rounded-full p-1 text-2xl leading-none text-slate-500 hover:bg-slate-100" aria-label="Close" @click="close">&times;</button>
        </header>
        <div class="p-5"><slot /></div>
        <footer v-if="$slots.footer" class="border-t border-slate-200 px-5 py-3"><slot name="footer" /></footer>
      </section>
    </div>
  </Teleport>
</template>
