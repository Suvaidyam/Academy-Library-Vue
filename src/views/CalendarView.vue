<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { getCalendarEvents } from '../services/api'

const calendarEl   = ref(null)
const loading      = ref(true)
const error        = ref(false)
let   calendarInst = null

const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

onMounted(async () => {
  try {
    const data = await getCalendarEvents()
    const raw  = data?.message?.all_events || []

    const events = raw.map(ev => ({
      title:       ev.title,
      start:       (ev.start || '').replace(' ', 'T'),
      url:         ev.url || '',
      description: ev.description || '',
    }))

    loading.value = false
    await new Promise(r => setTimeout(r, 0)) // flush DOM

    if (!calendarEl.value || !window.FullCalendar) return

    calendarInst = new window.FullCalendar.Calendar(calendarEl.value, {
      initialView: 'dayGridMonth',
      height: 'calc(100vh - 100px)',
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
        const evDate = new Date(info.event.start)
        evDate.setHours(0, 0, 0, 0)

        if      (evDate < TODAY) info.el.style.backgroundColor = '#d9534f'
        else if (evDate > TODAY) info.el.style.backgroundColor = '#5cb85c'
        else                     info.el.style.backgroundColor = '#0275d8'

        info.el.style.color       = 'white'
        info.el.style.borderColor = 'transparent'

        if (window.tippy) {
          window.tippy(info.el, {
            content:   `<strong>${info.event.title}</strong><br>${info.event.extendedProps?.description || ''}`,
            allowHTML: true,
            placement: 'top',
            theme:     'light',
          })
        }
      },
    })

    calendarInst.render()
  } catch (e) {
    console.error('CalendarView:', e)
    error.value   = true
    loading.value = false
  }
})

onBeforeUnmount(() => {
  calendarInst?.destroy()
})
</script>

<template>
  <div class="calendar-page">

    <!-- Loading -->
    <div v-if="loading" class="cal-center">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Loading…</span>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="cal-center text-muted">
      <i class="bi bi-exclamation-circle-fill text-danger me-2"></i>
      Failed to load calendar events.
    </div>

    <!-- Calendar -->
    <div v-show="!loading && !error" ref="calendarEl" id="main-calendar"></div>

  </div>
</template>

<style scoped>
.calendar-page {
  margin-top: 100px;
  width: 100%;
  padding: 0 16px 24px;
  box-sizing: border-box;
}

.cal-center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 140px);
  font-size: 1rem;
}

#main-calendar {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 16px rgba(0,0,0,.08);
  border: 1px solid #dee2e6;
}
</style>

<!-- CDN-rendered FullCalendar elements don't carry scoped attributes, so global styles needed -->
<style>
/* Day-name header row */
#main-calendar .fc-col-header         { background: #1a2535; }
#main-calendar .fc-col-header-cell    { background: #1a2535; border-color: #2a3548 !important; }
#main-calendar .fc-col-header-cell-cushion {
  color: #fff; font-weight: 600; font-size: .82rem;
  text-transform: uppercase; letter-spacing: .5px;
  padding: 8px 4px; text-decoration: none !important;
}

/* Toolbar */
#main-calendar .fc-toolbar.fc-header-toolbar {
  padding: 10px 14px; margin-bottom: 0;
  background: #fff; border-bottom: 1px solid #dee2e6;
}
#main-calendar .fc-toolbar-title { font-size: 1.25rem; font-weight: 700; color: #1a2535; }

/* Prev / next / today buttons */
#main-calendar .fc-button-primary {
  background: #e9ecef !important; border-color: #ced4da !important;
  color: #333 !important; font-size: .82rem; font-weight: 600;
  box-shadow: none !important; text-transform: capitalize;
}
#main-calendar .fc-button-primary:hover { background: #dee2e6 !important; }

/* Active view button */
#main-calendar .fc-button-primary:not(:disabled).fc-button-active,
#main-calendar .fc-button-primary:not(:disabled):active {
  background: #1a2535 !important; border-color: #1a2535 !important; color: #fff !important;
}

/* Events */
#main-calendar .fc-event {
  border: none !important; border-radius: 4px;
  cursor: pointer; font-weight: 600; font-size: .78rem;
}

/* Day numbers */
#main-calendar .fc-daygrid-day-number {
  color: #1a2535; font-size: .82rem; font-weight: 600; text-decoration: none !important;
}

/* Today highlight */
#main-calendar .fc-daygrid-day.fc-day-today { background: #eaf6ef !important; }
#main-calendar .fc-daygrid-day.fc-day-today .fc-daygrid-day-number { color: #2d6a4f; }

/* Cell borders */
#main-calendar .fc-daygrid-day,
#main-calendar .fc-scrollgrid td,
#main-calendar .fc-scrollgrid th { border-color: #e0e0e0 !important; }
#main-calendar .fc-scrollgrid    { border-color: #dee2e6 !important; }

/* Days outside current month */
#main-calendar .fc-day-other .fc-daygrid-day-number { color: #bbb; }

@media (max-width: 768px) {
  #main-calendar .fc-toolbar.fc-header-toolbar { flex-wrap: wrap; gap: 6px; padding: 8px; }
  #main-calendar .fc-toolbar-title { font-size: 1rem; }
}
</style>
