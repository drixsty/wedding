<template>
  <section class="py-16 sm:py-24 bg-surface-subtle">
    <div class="max-w-4xl mx-auto px-5 sm:px-6">

      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-title-md sm:text-title-lg font-semibold tracking-tight text-content-primary">
          Programme immersif du week-end
        </h2>
        <p class="text-content-muted mt-3 text-body-sm sm:text-body">
          Plus qu'un mariage : une expérience en plusieurs actes, de l'accueil à la dernière danse
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
                    class="rounded-2xl p-5 sm:p-6 transition-all duration-300"
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
                      class="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-xl
                           bg-surface-subtle hover:bg-border-soft text-body-sm font-medium transition-all duration-200"
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
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const timeline = ref<TimelineEvent[]>([
  {
    start: createDate('2026-07-17', '19:30'),
    title: 'Veillée des proches',
    description: 'Un dîner intimiste pour lancer les festivités : retrouvailles, anecdotes, musique douce et premières surprises imaginées par nos témoins.',
    location: 'Rooftop Lumière • Paris'
  },
  {
    start: createDate('2026-07-18', '13:00'),
    end: createDate('2026-07-18', '14:15'),
    title: 'Accueil signature',
    description: 'Cocktail de bienvenue, remise du carnet invité et installation dans les espaces. Prenez le temps d’écrire un mot dans notre livre de promesses.',
    location: 'Maison des Arts & Jardins'
  },
  {
    start: createDate('2026-07-18', '14:30'),
    end: createDate('2026-07-18', '16:00'),
    title: 'Cérémonie de l’union',
    description: 'Échange des vœux, rituels symboliques afro-européens, chants live et bénédictions familiales : le cœur de notre engagement.',
    location: 'Pavillon des Cèdres'
  },
  {
    start: createDate('2026-07-18', '16:15'),
    end: createDate('2026-07-18', '18:30'),
    title: 'Cocktail & expériences',
    description: 'Ateliers signatures (bar à senteurs, photobooth éditorial, coin souvenirs) accompagnés de bouchées créatives et d’un set acoustique.',
    location: 'Jardins suspendus'
  },
  {
    start: createDate('2026-07-18', '19:30'),
    end: createDate('2026-07-19', '00:30'),
    title: 'Dîner spectacle & première danse',
    description: 'Un dîner en 4 temps, ponctué de prises de parole, performances surprises et ouverture du bal avant la nuit dansante.',
    location: 'Orangerie Royale'
  },
  {
    start: createDate('2026-07-19', '11:30'),
    title: 'Brunch de clôture',
    description: 'Un dernier moment ensemble autour d’un brunch convivial pour revivre les plus beaux instants et prolonger la magie.',
    location: 'Salon Azur'
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
