<template>
  <section class="py-16 sm:py-24 bg-surface-subtle">
    <div class="max-w-4xl mx-auto px-5 sm:px-6">

      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-title-md sm:text-title-lg font-semibold tracking-tight text-content-primary">
          Programme du mariage
        </h2>
        <p class="text-content-muted mt-3 text-body-sm sm:text-body">
          Trois jours de célébration à Yaoundé, du jeudi 23 au samedi 25 juillet
        </p>
      </div>

      <div class="relative">
        <div class="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-border-soft"></div>

        <div class="space-y-10">
          <div
              v-for="(event, index) in timeline"
              :key="event.start.getTime()"
              :ref="el => setEventRef(el, index)"
              class="relative"
          >
            <div
                class="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 rounded-full transition-all duration-300"
                :class="statusStyles(index).dot"
            ></div>

            <div
                class="ml-12 sm:ml-0 sm:grid sm:grid-cols-2 sm:gap-12"
                :class="index % 2 !== 0 ? 'sm:text-right' : ''"
            >
              <div :class="index % 2 === 0 ? 'sm:col-start-1' : 'sm:col-start-2'">
                <div
                    class="app-card p-5 sm:p-6 transition-all duration-300"
                    :class="statusStyles(index).card"
                >
                  <p class="text-xs sm:text-sm opacity-60 mb-2">
                    {{ formatDate(event.start) }}
                  </p>

                  <h3 class="text-lg sm:text-xl font-medium">
                    {{ event.title }}
                  </h3>

                  <button
                      @click="toggle(index)"
                      class="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-md bg-surface-subtle hover:bg-border-soft text-body-sm font-medium transition-all duration-200"
                      :class="openedIndex === index ? 'bg-border-soft' : ''"
                  >
                    <span>
                      {{ openedIndex === index ? 'Masquer les détails' : 'Voir les détails' }}
                    </span>

                    <svg
                        class="w-4 h-4 transition-transform duration-300"
                        :class="openedIndex === index ? 'rotate-180' : ''"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <transition
                      enter-active-class="transition-all duration-300 ease-out"
                      leave-active-class="transition-all duration-200 ease-in"
                      enter-from-class="opacity-0 -translate-y-2"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-2"
                  >
                    <div v-show="openedIndex === index" class="mt-4">
                      <p class="text-body-sm text-content-secondary/85">
                        {{ event.description }}
                      </p>

                      <p
                          v-if="event.location"
                          class="text-xs uppercase tracking-wide opacity-50 mt-3"
                      >
                        {{ event.location }}
                      </p>
                    </div>
                  </transition>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick, type ComponentPublicInstance } from 'vue'

type EventStatus = 'past' | 'current' | 'upcoming'

interface TimelineEvent {
  start: Date
  end?: Date
  title: string
  description: string
  location?: string
}

function createDate(date: string, time: string) {
  return new Date(`${date}T${time}:00`)
}

function formatDate(date: Date) {
  return date.toLocaleString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  })
}

const timeline = ref<TimelineEvent[]>([
  {
    start: createDate('2026-07-23', '10:00'),
    title: 'Dot à Yaoundé',
    description: 'Première étape de notre union : la dot, entourés de nos familles, entre traditions, émotions et bénédictions.',
    location: 'Yaoundé'
  },
  {
    start: createDate('2026-07-24', '10:00'),
    title: 'Mariage civil + vin d’honneur',
    description: 'Cérémonie civile à la mairie de Yaoundé VI, suivie d’un vin d’honneur pour partager ce moment avec nos proches.',
    location: 'Mairie de Yaoundé VI'
  },
  {
    start: createDate('2026-07-25', '10:00'),
    title: 'Célébration religieuse + soirée',
    description: 'Messe de mariage à la paroisse St Esprit de Mvolyé, puis soirée festive pour célébrer notre union jusqu’au bout de la nuit.',
    location: 'Paroisse St Esprit de Mvolyé'
  }
].sort((a, b) => a.start.getTime() - b.start.getTime()))

const now = ref(new Date())
let interval: number

onMounted(() => {
  interval = window.setInterval(() => {
    now.value = new Date()
  }, 60000)
})

onUnmounted(() => clearInterval(interval))

function getEventEnd(index: number) {
  return timeline.value[index].end ?? timeline.value[index + 1]?.start ?? null
}

function getEventStatus(index: number): EventStatus {
  const event = timeline.value[index]
  const end = getEventEnd(index)

  if (now.value < event.start) return 'upcoming'
  if (!end || now.value < end) return 'current'
  return 'past'
}

const statusMap: Record<EventStatus, { card: string; dot: string }> = {
  past: {
    card: 'bg-surface-subtle text-content-muted',
    dot: 'bg-content-muted'
  },
  current: {
    card: 'bg-surface-strong text-content-inverse shadow-xl',
    dot: 'bg-surface-strong scale-125'
  },
  upcoming: {
    card: 'bg-surface-elevated shadow-sm border border-border-soft/60',
    dot: 'bg-surface-elevated border border-border-soft'
  }
}

function statusStyles(index: number) {
  return statusMap[getEventStatus(index)]
}

const openedIndex = ref<number | null>(null)

function toggle(index: number) {
  openedIndex.value = openedIndex.value === index ? null : index
}

const currentIndex = computed(() =>
  timeline.value.findIndex((_, i) => getEventStatus(i) === 'current')
)

const eventRefs = ref<HTMLElement[]>([])

function setEventRef(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLElement) eventRefs.value[index] = el
}

watch(currentIndex, async (newIndex) => {
  if (newIndex === -1) return
  await nextTick()
  eventRefs.value[newIndex]?.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })
}, { immediate: true })
</script>
