<template>
  <section class="py-16 sm:py-24 bg-neutral-50">
    <div class="max-w-4xl mx-auto px-5 sm:px-6">

      <!-- Header -->
      <div class="text-center mb-12 sm:mb-16">
        <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
          Programme
        </h2>
        <p class="text-neutral-500 mt-3 text-sm sm:text-base">
          Le déroulé des festivités
        </p>
      </div>

      <!-- Timeline -->
      <div class="relative">
        <!-- Ligne verticale -->
        <div class="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 top-0 bottom-0 w-px bg-neutral-200"></div>

        <div class="space-y-10">
          <div
              v-for="(event, index) in timeline"
              :key="event.start.getTime()"
              :ref="el => setEventRef(el, index)"
              class="relative"
          >
            <!-- Dot -->
            <div
                class="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 rounded-full transition-all duration-300"
                :class="statusStyles(index).dot"
            ></div>

            <!-- Card -->
            <div
                class="ml-12 sm:ml-0 sm:grid sm:grid-cols-2 sm:gap-12"
                :class="index % 2 !== 0 ? 'sm:text-right' : ''"
            >
              <div :class="index % 2 === 0 ? 'sm:col-start-1' : 'sm:col-start-2'">
                <div
                    class="rounded-2xl p-5 sm:p-6 transition-all duration-300"
                    :class="statusStyles(index).card"
                >
                  <!-- Date -->
                  <p class="text-xs sm:text-sm opacity-60 mb-2">
                    {{ formatDate(event.start) }}
                  </p>

                  <!-- Title -->
                  <h3 class="text-lg sm:text-xl font-medium">
                    {{ event.title }}
                  </h3>

                  <!-- Toggle Button -->
                  <button
                      @click="toggle(index)"
                      class="mt-4 w-full flex items-center justify-between px-4 py-3 rounded-xl
                           bg-neutral-100 hover:bg-neutral-200 text-sm font-medium transition-all duration-200"
                      :class="openedIndex === index ? 'bg-neutral-200' : ''"
                  >
                    <span>
                      {{ openedIndex === index ? 'Masquer les détails' : 'Voir les détails' }}
                    </span>

                    <!-- Chevron -->
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

                  <!-- Animated Content -->
                  <transition
                      enter-active-class="transition-all duration-300 ease-out"
                      leave-active-class="transition-all duration-200 ease-in"
                      enter-from-class="opacity-0 -translate-y-2"
                      enter-to-class="opacity-100 translate-y-0"
                      leave-from-class="opacity-100 translate-y-0"
                      leave-to-class="opacity-0 -translate-y-2"
                  >
                    <div v-show="openedIndex === index" class="mt-4">
                      <p class="text-sm opacity-80">
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

type EventStatus = 'past' | 'current' | 'upcoming'

interface TimelineEvent {
  start: Date
  end?: Date
  title: string
  description: string
  location?: string
}

/* -----------------------------
   Helpers
------------------------------*/

function createDate(date: string, time: string) {
  return new Date(`${date}T${time}:00`)
}

function formatDate(date: Date) {
  return date.toLocaleString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  })
}

/* -----------------------------
   Timeline data
------------------------------*/

const timeline = ref<TimelineEvent[]>([
  {
    start: createDate("2026-07-18", "13:30"),
    title: "Accueil des invités",
    description: "Installation et accueil.",
    location: "Hall principal"
  },
  {
    start: createDate("2026-07-18", "14:00"),
    end: createDate("2026-07-18", "15:30"),
    title: "Cérémonie",
    description: "Échange des vœux."
  },
  {
    start: createDate("2026-07-18", "19:00"),
    title: "Dîner",
    description: "Dîner gastronomique."
  },
  {
    start: createDate("2026-07-19", "11:00"),
    title: "Brunch",
    description: "Moment convivial du lendemain."
  }
].sort((a, b) => a.start.getTime() - b.start.getTime()))

/* -----------------------------
   Reactive clock
------------------------------*/

const now = ref(new Date())
let interval: number

onMounted(() => {
  interval = window.setInterval(() => {
    now.value = new Date()
  }, 60000)
})

onUnmounted(() => clearInterval(interval))

/* -----------------------------
   Event status logic
------------------------------*/

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
    card: "bg-neutral-100 text-neutral-400",
    dot: "bg-neutral-400"
  },
  current: {
    card: "bg-black text-white shadow-xl",
    dot: "bg-black scale-125"
  },
  upcoming: {
    card: "bg-white shadow-sm",
    dot: "bg-white border border-neutral-300"
  }
}

function statusStyles(index: number) {
  return statusMap[getEventStatus(index)]
}

/* -----------------------------
   Collapse logic
------------------------------*/

const openedIndex = ref<number | null>(null)

function toggle(index: number) {
  openedIndex.value = openedIndex.value === index ? null : index
}

/* -----------------------------
   Auto scroll to current event
------------------------------*/

const currentIndex = computed(() =>
    timeline.value.findIndex((_, i) => getEventStatus(i) === 'current')
)

const eventRefs = ref<HTMLElement[]>([])

function setEventRef(el: HTMLElement | null, index: number) {
  if (el) eventRefs.value[index] = el
}

watch(currentIndex, async (newIndex) => {
  if (newIndex === -1) return
  await nextTick()
  eventRefs.value[newIndex]?.scrollIntoView({
    behavior: "smooth",
    block: "center"
  })
}, { immediate: true })
</script>
